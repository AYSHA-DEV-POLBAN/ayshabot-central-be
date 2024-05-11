var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors')
var session = require('express-session')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var indexRouter = require('./routes/index');
var usersRouter = require('./app/users/router');
var informasiRouter = require('./app/information/router');
var commandRouter = require('./app/prompting/router');
var authRouter = require('./app/auth/router');

const URL = '/api/v1'
const sequelize = require('./database/sequelize');
sequelize.sync()
  .then(() => {
    console.log('Sinkronisasi model berhasil.');
   
  })
  .catch((error) => {
    console.error('Gagal melakukan sinkronisasi model:', error);
  });

require('dotenv').config();

var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(methodOverride('_method'))
app.use(session({
  secret: 'Keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{}
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/', async function () {
//   try {
//     // console.log(process.env.DB_CONNECTION)
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// });
app.use(`${URL}/users`, usersRouter);
app.use(`${URL}/auth`, authRouter);
app.use(`${URL}/informasi`,informasiRouter);
app.use(`${URL}/command`,commandRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
