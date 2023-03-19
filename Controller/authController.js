const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  console.log("here");

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  User.deleteOne({ email: req.params.email }, function (err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const {
    email,
    password,
    fitnessGoal,
    gender,
    age,
    height,
    heightUnit,
    weight,
    weightUnit,
    allergies,
    diet,
    ingredients,
  } = req.body;

  //Check if email and password not empty
  // if (!email || !password) {
  //   return next(new AppError("Please provide email and password!", 400));
  // }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return res.status(400).send("Email already exists");
  } else {
    const user = new User({
      email: email,
      password: hashPassword,
      fitnessGoal: fitnessGoal,
      gender: gender,
      age: age,
      height: height,
      heightUnit: heightUnit,
      weight: weight,
      weightUnit: weightUnit,
      allergies: allergies,
      diet: diet,
      ingredients: ingredients,
    });
    try {
      const savedUser = await user.save();
      return res.status(200).send("User added successfully");
    } catch (err) {
      console.log(err);
    }
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // if (!email || !password) {
  //   return next(new AppError("Please provide email and password!", 400));
  // }
  const user = await User.findOne({ email: email });
  if (user == null) {
    return res.status(400).send("User doesn't exist");
  } else {
    const validPass = await bcrypt.compare(password, user.password);
    if (validPass) {
      // res.statusCode = 200;
      // res.statusCode = 200;
      // res.header("auth-token", token).send(token);
      let token = jwt.sign({ _id: user._id }, config.secret);

      // res.status(200).json({
      //   status: "success",
      //   data: {
      //     token,
      //   },
      // });
      console.log("snednig into create");
      createSendToken(user, 200, req, res);
    } else {
      console.log("Here");
      return res.status(500).send("Couldn't Login, Incorrect Password");
    }
  }
});

exports.googleLogin = catchAsync(async (req, res, next) => {
  console.log("Inside Function");
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user != null) {
    return res.status(200).send("User added successfully");
  }
  // if client is not registered with the google account we will register them
  const newUser = new User({
    email: req.body.email,
  });
  try {
    await newUser.save({ validateBeforeSave: false });
    return res.status(200).send("User added successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Couldn't Login");
  }
});
exports.findBmi = catchAsync(async (req, res, next) => {
  const { email, bmi } = req.body;
  User.findOneAndUpdate({ email: email }, { bmi: bmi }, function (err, result) {
    if (err) {
      res.status(400).send("Can't update the details");
      return next(err);
    }
    res.status(200).json(result);
  });
});
exports.updateWaterIntake = catchAsync(async (req, res, next) => {
  try {
    console.log("update water");
    const now = new Date();
    const currDate =
      now.getFullYear() +
      "-" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      now.getDate();
    const { email, water } = req.body;
    console.log(water);
    const user = await User.findOne({ email: email });
    if (user == null) {
      return res.status(400).send("User doesn't exist");
    } else {
      console.log("here");
      const lastRecord = user.waterIntake[user.waterIntake.length - 1];
      console.log(lastRecord);
      if (lastRecord && lastRecord.date === currDate) {
        lastRecord.water = parseInt(lastRecord.water) + parseInt(water);
      } else {
        user.waterIntake.push({
          water: req.body.water,
          date: currDate,
        });
      }
      await user.save();
      res.json(user);
    }
  } catch (err) {
    return res.status(500).json({ msg: "Unable to update record" });
    console.log(err.message);
  }
});
exports.viewUser = catchAsync(async (req, res, next) => {
  User.find({ email: req.params.email }).exec(async function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
