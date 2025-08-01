const express = require("express");
const authenticated_user = express.Router();
const public_users = express.Router();

let users = {};

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (users[username]) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users[username] = { password };
  return res.status(200).json({ message: "User registered successfully." });
});

// Login
authenticated_user.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (users[username] && users[username].password === password) {
    req.session.authorization = { username };
    return res.status(200).json({ message: "Login successful." });
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

module.exports.authenticated = authenticated_user;
module.exports.general = public_users;
