const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
    let { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Example of checking if user already exists
        let userExists = users.find(user => user.username === username);
        if (userExists) {
            return res.status(409).json({ message: "Username already exists" });
        }

        // Add new user to the users list
        users.push({ username, password });
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while registering the user" });
    }
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Simulate fetching books from a database
    let bookList = await Promise.resolve(books);
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({message: "An error occurred while retrieving the books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    let isbn = req.params.isbn;
    let book = await Promise.resolve(books[isbn]);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "An error occurred while retrieving the book details"});
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    let author = req.params.author;
    let booksByAuthor = await Promise.resolve(Object.values(books).filter(book => book.author === author));
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({message: "No books found for the author provided"});
    }
  } catch (error) {
    return res.status(500).json({message: "An error occurred while retrieving the books by author"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    let title = req.params.title;
    let booksByTitle = await Promise.resolve(Object.values(books).filter(book => book.title.includes(title)));
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({message: "No books found with the title provided"});
    }
  } catch (error) {
    return res.status(500).json({message: "An error occurred while retrieving the books by title"});
  }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  try {
    let isbn = req.params.isbn;
    let book = await Promise.resolve(books[isbn]);
    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({message: "No reviews found for the book with the provided ISBN"});
    }
  } catch (error) {
    return res.status(500).json({message: "An error occurred while retrieving the book reviews"});
  }
});

module.exports.general = public_users;
