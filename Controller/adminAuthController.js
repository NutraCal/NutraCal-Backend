const jwt = require("jsonwebtoken");
const Admin = require("../Models/admin");
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

      const currentUser = await Admin.findById(decoded.id);

      if (!currentUser) {
        return next(new AppError("User not found"));
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

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  Admin.deleteOne({ email: req.params.email }, function (err, result) {
    if (err) return res.status(500).json({ msg: "Unable to delete record" });
    res.status(200).json(result);
  });
});

exports.signupAdmin = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  //Check if email and password not empty
  if (!name || !email || !password) {
    return res.status(400).send("Kindly fill all fields");
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const emailExists = await Admin.findOne({ email: email });
  if (emailExists) {
    return res.status(400).send("Email already exists");
  }
  const admin = new Admin({
    name: name,
    email: email,
    password: hashPassword,
  });
  try {
    const savedUser = await admin.save();
    return res.status(200).send("Admin registered successfully");
  } catch (err) {
    console.log(err);
  }
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Kindly fill all required fields");
  }
  const user = await Admin.findOne({ email: email });
  if (user == null) {
    return res.status(400).send("User doesn't exist");
  } else {
    const validPass = await bcrypt.compare(password, user.password);
    if (validPass) {
      let token = jwt.sign({ _id: user._id }, config.secret);
      createSendToken(user, 200, req, res);
    } else {
      return res.status(500).send("Couldn't Login, Incorrect Password");
    }
  }
});
