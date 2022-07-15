var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var usersRouter = require('./routes/users');

var repositoryRouter = require('./routes/repositoryRouter');

const mongoose = require('mongoose');


const Repositories = require('./models/repositories');


const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {

    console.log('Connected correctly to server');

},(err) => {console.log(err); });

var app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
    return next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));



app.use(passport.initialize());
app.use(passport.session());

// app.use('/', indexRouter);
app.use('/users', usersRouter);



// app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.use('/repositories', repositoryRouter);


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


// live reload
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

//connect live-reload
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

//connect live-reload
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

module.exports = app;
