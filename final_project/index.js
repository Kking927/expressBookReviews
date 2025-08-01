const express = require("express");
const session = require("express-session");

const customer_routes = require("./router/auth_users.js");
const genl_routes = require("./router/general.js");

const app = express();

app.use(express.json());

// Set up session middleware
app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware to check for valid user session
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    next();
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Mount routers
app.use("/customer", customer_routes.authenticated); // for login, review, etc.
app.use("/", customer_routes.general);               // for register and general routes
app.use("/", genl_routes);                           // for book browsing

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
