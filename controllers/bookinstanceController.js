const BookInstance = require("../models/bookinstance");
const Book = require('../models/book');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find({})
    .populate("book")
    .exec();

  res.render("bookinstance_list", {
    title: "Список екземплярів книг",
    bookinstance_list: allBookInstances,
  });
});
// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
});
  
  // Display BookInstance create form on GET.
exports.bookinstance_create_get = async (req, res, next) => {
  try {
    const books = await Book.find({}, 'title').exec();
    res.render('bookinstance_form', {
      title: 'Create BookInstance',
      book_list: books,
    });
  } catch (err) {
    return next(err);
  }
};
  // Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  // Перевірка та нормалізація полів
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
  body('status').escape(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

  // Обробка запиту після валідації
  async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      try {
        const books = await Book.find({}, 'title').exec();
        res.render('bookinstance_form', {
          title: 'Create BookInstance',
          book_list: books,
          selected_book: req.body.book,
          errors: errors.array(),
          bookinstance: bookInstance,
        });
      } catch (err) {
        return next(err);
      }
    } else {
      try {
        await bookInstance.save();
        res.redirect(bookInstance.url);
      } catch (err) {
        return next(err);
      }
    }
  }
];
  
  // Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
});
  
  // Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
});
  
  // Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});
  
  // Handle bookinstance update on POST.
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});
  