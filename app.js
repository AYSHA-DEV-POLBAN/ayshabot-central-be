var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cors = require("cors");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var methodOverride = require("method-override");

var indexRouter = require("./routes/index");

var authRouter = require("./app/auth/router");
var categoryInformationRouter = require("./app/categoryInformation/router");
var clientRouter = require("./app/client/router");
var chromaRouter = require("./app/chroma/router");
var commandRouter = require("./app/command/router");
var conversationRouter = require("./app/conversation/router");
var informationRouter = require("./app/information/router");
var logHistoryRouter = require("./app/logHistory/router");
var roleRouter = require("./app/role/router");
var usersRouter = require("./app/users/router");

const URL = "/api/" + process.env.APP_VERSION;
const sequelize = require("./database/sequelize");

// DESKRIPSI PROJECT
console.log();
console.log("|===============================================|");
console.log("|                                               |");
console.log("| PROJECT      : " + process.env.APP_NAME + " |");
console.log("| VERSION      : " + process.env.APP_VERSION + "                             |");
console.log("| CREATED YEAR : 2024                           |");
console.log("| PORT         : " + process.env.PORT + "                           |");
console.log("| URL APP      : " + process.env.BASE_URL + ":" + process.env.PORT + "/" +  "         |");
console.log("| URL ENDPOINT : " + process.env.BASE_URL + ":" + process.env.PORT + URL + "   |");
console.log("|                                               |");
console.log("|===============================================|");
console.log();


console.log();
console.log("|=============================================== SINKRONISASI MODEL DATABASE ===============================================|");
console.log();
sequelize
	.sync()
	.then(() => {
		console.log();
		console.log(" RESULT : Sinkronisasi model database berhasil.");
		console.log();
		console.log("|===========================================================================================================================|");
		console.log();
	})
	.catch((error) => {
		console.log();
		console.error(" RESULT : Gagal melakukan sinkronisasi model database.", error);
		console.log();
		console.log("|===========================================================================================================================|");
		console.log();
	});

require("dotenv").config();

var app = express();
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(methodOverride("_method"));
app.use(
	session({
		secret: "Keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: {},
	})
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// app.use('/', async function () {
//   try {
//     // console.log(process.env.DB_CONNECTION)
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// });

app.use(`${URL}/auth`, authRouter);
app.use(`${URL}/category-information`, categoryInformationRouter);
app.use(`${URL}/client`, clientRouter);
app.use(`${URL}/chroma`, chromaRouter);
app.use(`${URL}/command`, commandRouter);
app.use(`${URL}/conversation`, conversationRouter);
app.use(`${URL}/information`, informationRouter);
app.use(`${URL}/log-history`, logHistoryRouter);
app.use(`${URL}/role`, roleRouter);
app.use(`${URL}/users`, usersRouter);
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
