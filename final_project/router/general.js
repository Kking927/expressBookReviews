const express = require("express");
let books = require("./booksdb.js");
let public_users = express.Router();

// Get all books
public_users.get("/", (req, res) => {
  res.send(JSON.stringify(books, null, 4));
});

// Get book by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get books by author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const result = Object.values(books).filter(book => book.author === author);
  res.send(result);
});

// Get books by title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const result = Object.values(books).filter(book => book.title === title);
  res.send(result);
});

module.exports.general = public_users;
