require('dotenv').config();
const sql_query = require('./sql');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

var app = express();

// Body Parser Config
app.use(bodyParser.urlencoded({
    extended: false
}));

// Authentication Setup
require('./auth').init(app);
app.use(session({
    secret: process.env.DATABASE_URL,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Router set up
require('./routes').init(app);
//app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 401 and forward to error handler
app.use(function (req, res, next) {
    res.status(401).render('401');
    next(createError(401));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('404');
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.render('error');
    res.render('500');
});

module.exports = app;
