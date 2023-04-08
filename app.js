var createError = require("http-errors");
var express = require("express");
var path = require("path");
const port = 8000;
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controller/errorController");

var app = express();
app.use(express.json());

//var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
var recipesRouter = require("./routes/recipes");
var shopRouter = require("./routes/shopList");
var mealRouter = require("./routes/meals");
var blogRouter = require("./routes/blogs");
var discussionThread = require("./routes/discussionThread");
var adminRouter = require("./routes/admin");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/recipes", recipesRouter);
app.use("/meals", mealRouter);
app.use("/shoppingList", shopRouter);
app.use("/users", usersRouter);
app.use("/blogs", blogRouter);
app.use("/discussionThreads", discussionThread);
app.use("/admin", adminRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
