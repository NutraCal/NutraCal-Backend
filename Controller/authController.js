const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const Nutritionist = require("../Models/nutritionist");
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

exports.verifyToken = catchAsync(async (req, res, next) => {
  if (req?.body?.token) {
    try {
      const decoded = await jwt.verify(
        req?.body?.token,
        process.env.JWT_SECRET
      );

      let currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        currentUser = await Nutritionist.findById(decoded.id);
      }
      if (!currentUser) {
        return res.status(400).send("User doesn't exist");
      }

      res.status(200).json({
        status: "success",
        data: {
          user: currentUser,
        },
      });
    } catch (err) {
      res.status(401).json({ error: err });
    }
  } else {
    console.log("Error");
  }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  User.deleteOne({ email: req.params.email }, function (err, result) {
    if (err) return res.status(500).json({ msg: "Unable to delete record" });
    res.json(result);
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.role == "User") {
    console.log("User");
    const {
      name,
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
      role,
    } = req.body;

    //Check if email and password not empty
    if (!email || !password) {
      return res.status(400).send("Please Provide Email and Password");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.status(400).send("Email already exists");
    } else {
      console.log("here");
      let heightMeters, weightKg;
      if (heightUnit == "cm") {
        heightMeters = height / 100;
        console.log("calculating height in cm");
      } else {
        heightMeters = height * 0.3048;
        console.log("calculating height in ft");
      }
      if (weightUnit == "kg") {
        weightKg = weight;
      } else {
        weightKg = weight * 0.45359237;
        console.log("calculating height in kg");
      }

      console.log(weightKg);
      console.log("height");
      console.log(heightMeters);

      console.log("hehe");
      const bmiValue = weightKg / (heightMeters * heightMeters);
      const bmi = bmiValue.toFixed(2);
      console.log(bmi);

      const user = new User({
        // name: name,
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
        bmi: bmi,
        role: "User",
      });
      if (req.file) {
        console.log("Storing Image");
        user.Image = {
          filename: req.file.filename,
          contentType: req.file.mimetype,
          url: "http://localhost:8000/" + req.file.filename,
        };
      }
      try {
        const savedUser = await user.save();
        return res.status(200).json(user);
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (req.body.role == "Nutritionist") {
    console.log("Please");
    const {
      name,
      email,
      password,
      qualification,
      areaOfExpertise,
      startDay,
      endDay,
      startTime,
      endTime,
      role,
    } = req.body;

    //Check if email and password not empty
    if (!name || !email || !password) {
      return res.status(400).send("Kindly fill all fields");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const emailExists = await Nutritionist.findOne({ email: email });
    if (emailExists) {
      return res.status(400).send("Email already exists");
    }
    const nutritionist = new Nutritionist({
      name: name,
      email: email,
      password: hashPassword,
      qualification: qualification,
      areaOfExpertise: areaOfExpertise,
      startDay: startDay,
      endDay: endDay,
      startTime: startTime,
      endTime: endTime,
      role: "Nutritionist",
    });
    if (req.file) {
      console.log("Storing Image");
      nutritionist.Image = {
        filename: req.file.filename,
        contentType: req.file.mimetype,
        url: "http://localhost:8000/" + req.file.filename,
      };
    }
    try {
      const savedUser = await nutritionist.save();
      return res.status(200).json(nutritionist);
    } catch (err) {
      console.log(err);
    }
  }
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    // Check if email exists in User collection
    let user = await User.findOne({ email: email });
    // If not found, check if email exists in Nutritionist collection
    if (!user) {
      user = await Nutritionist.findOne({ email: email });
    }
    if (!user) {
      return res.status(400).send("User doesn't exist");
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (validPass) {
      createSendToken(user, 200, req, res);
    } else {
      console.log("Here");
      return res.status(500).send("Couldn't Login, Incorrect Password");
    }
  } catch (e) {
    res.status(500).send(e);
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
      return res.status(500).json({ msg: "Unable to find user" });
    }
    // Respond with valid data
    res.json(results);
  });
});

exports.getUserId = catchAsync(async (req, res, next) => {
  const user = User.findOne({ email: req.params.email }).exec(async function (
    error,
    results
  ) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    console.log(results._id);
    res.json(results._id);
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const {
    email,
    password,
    gender,
    weight,
    weightUnit,
    height,
    heightUnit,
    age,
    fitnessGoal,
  } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  User.findOneAndUpdate(
    { email: email },
    {
      password: hashPassword,
      gender: gender,
      weight: weight,
      weightUnit: weightUnit,
      height: height,
      heightUnit: heightUnit,
      age: age,
      fitnessGoal: fitnessGoal,
    },
    function (err, result) {
      if (err) {
        res.status(400).send("Can't update the details");
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});

exports.getWaterIntake = catchAsync(async (req, res, next) => {
  try {
    console.log("get water");
    const now = new Date();
    const currDate =
      now.getFullYear() +
      "-" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      now.getDate();
    const { email } = req.params.email;
    const user = await User.find({ email: email });
    if (user == null) {
      return res.status(400).send("User doesn't exist");
    } else {
      console.log("here");
      const lastRecord = user.waterIntake[user.waterIntake.length - 1];
      if (lastRecord && lastRecord.date === currDate) {
        res.json(lastRecord.water);
      } else {
        res.json(0);
      }
    }
  } catch (err) {
    return res.status(500).json({ msg: "Unable to retreive record" });
    console.log(err.message);
  }
});
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
