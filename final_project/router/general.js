const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  });  

// Get all books
public_users.get('/', (req, res) => {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  let filteredBooks = {};

  for (const [isbn, book] of Object.entries(books)) {
    if (book.author.toLowerCase() === author) {
      filteredBooks[isbn] = book;
    }
  }

  if (Object.keys(filteredBooks).length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found for the given author" });
  }
});

// Get book details by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  let filteredBooks = {};

  for (const [isbn, book] of Object.entries(books)) {
    if (book.title.toLowerCase() === title) {
      filteredBooks[isbn] = book;
    }
  }

  if (Object.keys(filteredBooks).length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found for the given title" });
  }
});

// Get book review by ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
