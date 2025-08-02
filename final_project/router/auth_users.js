const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password;
};

// Login endpoint
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { username },
      'access',
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add or update a book review (authenticated)
// Add or update a book review (authenticated)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.query.review;
  
    if (!review) {
      return res.status(400).json({ message: "Review content required" });
    }
  
    if (books[isbn]) {
      if (!books[isbn].reviews) {
        books[isbn].reviews = {};
      }
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added/updated." });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });  

// (Optional) Delete review endpoint
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted." });
  } else {
    return res.status(404).json({ message: "Review or book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
