const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require("../models/book");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('Queries');
});

/* GET authors. */
router.get('/author', async function (req, res, next) {
  const firstName = req.query["first_name"];
  const familyName = req.query["family_name"];

  let query = {};
  if (firstName) query.first_name = new RegExp(firstName, "i");
  if (familyName) query.family_name = new RegExp(familyName, "i");

  try {
    const authors = await Author.find(query);

    if (authors.length > 0) {
      const result = `<ul>${authors.map(author => `<li>${author.name}</li>`).join('')}</ul>`;
      res.send(result);
    } else {
      res.send('<h1>Not found</h1>');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('<h1>Server Error</h1>');
  }
});

/* GET books (поки заглушка). */
router.get('/books', async function (req, res, next) {
  res.send('Books');
});

module.exports = router;

/* GET books by title */
router.get('/books', async function (req, res, next) {
    const title = req.query["title"];
    
    const query = {};
    if (title) {
      query.title = new RegExp(title, "i"); // нечутливий до регістру пошук
    }
  
    try {
      const books = await Book.find(query).populate("author"); // підтягуємо автора
  
      if (books.length > 0) {
        const result = `<ul>${books.map(book => 
          `<li>${book.title} by ${book.author.first_name} ${book.author.family_name}</li>`
        ).join("")}</ul>`;
        res.send(result);
      } else {
        res.send("<h1>Not found</h1>");
      }
    } catch (err) {
      next(err); // обробка помилок
    }
  });