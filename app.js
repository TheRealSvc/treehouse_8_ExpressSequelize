var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require("./models").sequelize;
let indexRouter = require('./routes/index');


(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection successful to database");
    await sequelize.sync();
    console.log("all tables between db and orm synced"); 
  } catch (err) {
    console.log("Failed to connect to database or syncing failed", err);
  }
})();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Sorry! We couldn't find the page you were looking for");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err.status);
  res.locals.error = err;

  if (err.status === 404) {
      err.message = "Sorry! We couldn't find the page you were looking for"
      res.status(err.status);
      console.log(`An error happened with status ${err.status} and message ${err.message}`);
      return res.render('page-not-found', err);
  } else {
      err.status = 500;
      err.message = 'something went wrong'
      console.log(`An error happened with status ${err.status} and message ${err.message}`);
      res.status(err.status)
      return res.render('error', err);
  }

  /* set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); */
});

module.exports = app;
