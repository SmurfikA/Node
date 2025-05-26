const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Book = require("../models/book");

// Показати список усіх жанрів
exports.genre_list = async (req, res, next) => {
  try {
    const allGenres = await Genre.find().sort({ name: 1 }); // Сортування за назвою (зростання)
    res.render('genre_list', {
      title: 'Список жанрів',
      genre_list: allGenres,
    });
  } catch (err) {
    return next(err);
  }
};

// Відображення сторінки деталей для конкретного жанру.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // Отримання деталей жанру та всіх пов'язаних книг (паралельно)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // Немає результатів.
    const err = new Error("Жанр не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Деталі жанру",
    genre: genre,
    genre_books: booksInGenre,
  });
});

exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Створити жанр" });
};

exports.genre_create_post = [
  // Валідація та санітизація
  body("name", "Назва жанру повинна містити щонайменше 3 символи")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Обробка запиту після валідації
  async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // Є помилки - відобразити форму з помилками
      return res.render("genre_form", {
        title: "Створити жанр",
        genre,
        errors: errors.array(),
      });
    }

    try {
      // Перевірка чи жанр вже існує (без врахування регістру)
      const existing_genre = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (existing_genre) {
        // Жанр вже існує - редирект на його сторінку
        return res.redirect(existing_genre.url);
      }

      // Жанру немає — зберігаємо
      await genre.save();
      res.redirect(genre.url);
    } catch (err) {
      return next(err);
    }
  }
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, genreBooks] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).exec(),
  ]);

  if (genre === null) {
    res.redirect("/catalog/genres");
  }

  res.render("genre_delete", {
    title: "Видалити жанр",
    genre: genre,
    genre_books: genreBooks,
  });
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, genreBooks] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).exec(),
  ]);

  if (genreBooks.length > 0) {
    res.render("genre_delete", {
      title: "Видалити жанр",
      genre: genre,
      genre_books: genreBooks,
    });
    return;
  } else {
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genres");
  }
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});