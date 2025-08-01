const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Use session middleware for customer routes
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware for /customer/auth/* routes
app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  // Extract token value from Bearer scheme (if used)
  let jwtToken = token;
  if (token.startsWith("Bearer ")) {
    jwtToken = token.slice(7, token.length);
  }

  jwt.verify(jwtToken, "access", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Attach user info to request object (optional)
    req.user = user;
    next();
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
