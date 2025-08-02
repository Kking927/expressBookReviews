const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const general_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Middleware to protect authenticated routes under /customer/auth/*
app.use("/customer/auth/*", (req, res, next) => {
  if (!req.session.authorization) {
    return res.status(401).json({ message: "Unauthorized: No session found" });
  }

  const token = req.session.authorization.accessToken;

  jwt.verify(token, "access", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = user;
    next();
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", general_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
