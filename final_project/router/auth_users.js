const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid (exists in users array)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username and password match a registered user
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login route for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Sign JWT token valid for 1 hour
  const token = jwt.sign({ username: username }, "access", { expiresIn: "1h" });

  // Save token in session authorization
  req.session.authorization = { token, username };

  return res.status(200).json({ message: "Login successful", token: token });
});

// Add or update book review (only logged-in users)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.username; // From JWT middleware
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  // Add/update review by username
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
