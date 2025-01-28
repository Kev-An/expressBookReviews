const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { // returns boolean
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => { // returns boolean
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }
  
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  let user = { username };
  let token = jwt.sign(user, "your_jwt_secret_key", { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    let decoded = jwt.verify(token, "your_jwt_secret_key");
    let book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Assuming book has a reviews array
    book.reviews = book.reviews || [];
    book.reviews.push({ user: decoded.username, review: review });

    return res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to authenticate token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
