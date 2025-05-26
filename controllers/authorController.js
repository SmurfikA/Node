const author_controller = require("../controllers/authorController");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator")
const Author = require('../models/author');
const Book = require("../models/book");

// Display list of all Authors.
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
  res.render("author_list", {
    title: "Список авторів",
    author_list: allAuthors,
  });
});
  
  // Display detail page for a specific Author.
exports.author_detail = asyncHandler(async (req, res, next) => {
  // Отримати автора і всі його книги паралельно
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // Автор не знайдений
    const err = new Error("Автора не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Деталі автора",
    author: author,
    author_books: allBooksByAuthor,
  });
});
  
// Відображення форми створення автора при GET-запиті.
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Створити автора" });
};
  
  // Handle Author create on POST.
exports.author_create_post = [
  // Валідація та очищення полів.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Ім'я повинно бути вказано.")
    .isAlphanumeric()
    .withMessage("Ім'я містить неалфанумерні символи."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Прізвище повинно бути вказано.")
    .isAlphanumeric()
    .withMessage("Прізвище містить неалфанумерні символи."),
  body("date_of_birth", "Недійсна дата народження")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Недійсна дата смерті")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Обробка запиту після валідації та очищення.
  asyncHandler(async (req, res, next) => {
    // Витягнення помилок валідації з запиту.
    const errors = validationResult(req);

    // Створення об'єкта автора з екранованими та обрізаними даними
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      // Є помилки. Відображення форми знову з очищеними значеннями та повідомленнями про помилки.
      res.render("author_form", {
        title: "Створити автора",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Дані з форми є дійсними.
      // Збереження автора.
      await author.save();
      // Перенаправлення на сторінку нового запису автора.
      res.redirect(author.url);
    }
  }),
];

  // Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete GET");
  });
  
  // Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete POST");
  });
  
  // Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update GET");
  });
  // Handle Author update on POST.
exports.author_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update POST");
  });