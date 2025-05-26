require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const queriesRouter = require("./routes/queries");
const catalogRouter = require("./routes/catalog");

const compression = require("compression");
const helmet = require("helmet");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const connectDB = require('./db'); // Import the database connection
const app = express();

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 хвилина
  max: 20,
});




// Connect to MongoDB
connectDB();

app.use(limiter);
app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/queries", queriesRouter); // Add catalog routes to middleware chain.
app.use("/catalog", catalogRouter); // Додавання маршрутів каталогу до ланцюжка проміжного програмного забезпечення.

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
