var createError = require("http-errors");
var express = require("express");
var path = require("path");
const port = 8000;
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controller/errorController");
var admin = require("firebase-admin");

var serviceAccount = require("./nutracalnotf-firebase-adminsdk-edn22-2e555fb261.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var app = express();
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
var recipesRouter = require("./routes/recipes");
var shopRouter = require("./routes/shopList");
var mealRouter = require("./routes/meals");
var blogRouter = require("./routes/blogs");
var discussionThread = require("./routes/discussionThread");
var adminRouter = require("./routes/admin");
var nutritionistRouter = require("./routes/nutritionist");
var dietPlanRouter = require("./routes/dietPlan");
var notificationsRouter = require("./routes/notifications");

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
app.use("/nutritionist", nutritionistRouter);
app.use("/diet", dietPlanRouter);
app.use("/notifications", notificationsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
