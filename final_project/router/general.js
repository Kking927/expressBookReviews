const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

function promiseCb(cb, timeout = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        cb(resolve);
      } catch (err) {
        reject(err);
      }
    }, timeout);
  });
}

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

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    try {
        const data = await promiseCb((resolve) => {
            const booksList = Object.values(books);
            resolve(booksList);
    }, 3000);

    return res.status(200).json(data);
} catch (error) {
    return res.status(500).json({ message: "Internal server error."});
}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const data = await promiseCb((resolve) => {
        const isbn = req.params.isbn + "";
        const book = books[isbn];
        resolve(book);
        }, 3000);
        if (data) {
            return res.status(200).json(data);
        }     
        return res.status(404).json({message: "Invalid ISBN"});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error"});
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const data = await promiseCb((resolve) => {
            const author = (req.params.author + "").toLowerCase();
            const booksList = Object.values(books);
            const newBooks = booksList.filter((book) => {
                return book.author.toLowerCase().includes(author);
            });
            resolve(newBooks);
        }, 3000);
        if (Array.isArray(data) && data.length) {
            return res.status(200).json(data);
        }
        return res.status(404).json({ message: "Invalid author." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    } 
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const data = await promiseCb((resolve) => {
            const title = (req.params.title + "").toLocaleLowerCase();
            const booksList = Object.values(books);
            const newBooks = booksList.filter((book) =>
                book.title.toLowerCase().match(title)
            );
            resolve(newBooks);
        }, 3000);
        if (Array.isArray(data) && data.length) {
            return res.status(200).json(data);
        }
        return res.status(404).json({ message: "Invalid title." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    } 
});
        
// Get book review by ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].review);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
