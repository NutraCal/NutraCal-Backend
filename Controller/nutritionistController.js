const jwt = require("jsonwebtoken");
const Nutritionist = require("../Models/nutritionist");
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

      const currentUser = await Nutritionist.findById(decoded.id);

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

exports.deleteNutritionist = catchAsync(async (req, res, next) => {
  Nutritionist.deleteOne({ email: req.params.email }, function (err, result) {
    if (err) return res.status(500).json({ msg: "Unable to delete record" });
    res.status(200).json(result);
  });
});

exports.signupNutritionist = catchAsync(async (req, res, next) => {
  const { name, email, password, qualification, availability, role } = req.body;

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
    name: name,
    qualification: qualification,
    availability: availability,
  });
  try {
    const savedUser = await nutritionist.save();
    return res.status(200).send("Nutritionist registered successfully");
  } catch (err) {
    console.log(err);
  }
});

exports.loginNutritionist = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Kindly fill all required fields");
  }
  const user = await Nutritionist.findOne({ email: email });
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

exports.rateNutritionist = catchAsync(async (req, res, next) => {
  try {
    const nutritionistEmail = req.body.email;
    const userId = req.body.user;
    const rating = req.body.rating;

    // Find the nutritionist by id
    const nutritionist = await Nutritionist.findOne({
      email: nutritionistEmail,
    });

    if (!nutritionist) {
      return res.status(404).json({ message: "Nutritionist not found" });
    }
    // Check if user has already rated the nutritionist
    let existingRating;
    if (nutritionist.rating) {
      existingRating = nutritionist.rating.find((r) => r.user === userId);
    }
    const newRating = {
      user: userId,
      rate: req.body.rate,
    };

    if (existingRating) {
      // Update the rating if user has already rated the nutritionist
      existingRating.rate = rating;
    } else {
      if (nutritionist.rating) {
        nutritionist.rating.push(newRating);
      } else {
        nutritionist.rating = [newRating];
      }
    }

    // Calculate the new average rating of the nutritionist
    const totalRating = nutritionist.rating.reduce((sum, r) => sum + r.rate, 0);
    const averageRating = totalRating / nutritionist.rating.length;
    console.log(averageRating);

    // Update the nutritionist's average rating
    nutritionist.ratingAverage = averageRating;

    // Save the updated nutritionist object to the database
    await nutritionist.save();

    res.json(nutritionist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Route to follow the nutritionist
exports.followNutritionist = catchAsync(async (req, res, next) => {
  try {
    const nutritionistEmail = req.body.email;
    const userEmail = req.body.userEmail;

    // Check if the blog post exists in the database
    const nutritionist = await Nutritionist.findOne({
      email: nutritionistEmail,
    });
    if (!nutritionist) {
      return res.status(404).json({ message: "Nutritionist not found" });
    }

    // Check if the user has already followed thisNutritionist
    const existingFollow = nutritionist.followers.find(
      (follow) => follow.user === userEmail
    );

    if (existingFollow) {
      // If the user has already followed the nutritionist, remove
      nutritionist.followers = nutritionist.followers.filter(
        (follow) => follow.user !== userEmail
      );
    } else {
      // Otherwise, add a new like
      nutritionist.followers.push({
        user: userEmail,
      });
    }

    // Save the updated blog post to the database
    let updatedBlogPost = await nutritionist.save();

    res.status(200).json({
      message: "Followers updated successfully",
      likesCount: updatedBlogPost.followers.length,
      object: updatedBlogPost.followers,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
exports.bookAppointment = catchAsync(async (req, res, next) => {
  try {
    // Get the nutritionist's ID from their email
    const nutritionist = await Nutritionist.findOne({
      email: req.body.nutritionistEmail,
    });
    const usr = await User.findOne({
      email: req.body.userEmail,
    });

    if (!nutritionist || !usr) {
      return res.status(404).send({ error: "Please provide valid email" });
    }
    const nutritionistId = nutritionist._id;
    const userId = usr._id;
    // Check if the appointment slot is available
    const appointmentDate = req.body.date;
    const appointmentTime = req.body.time;
    const isAvailable = await Nutritionist.findOne({
      _id: nutritionistId,
      "appointments.date": appointmentDate,
      "appointments.time": appointmentTime,
    });
    if (isAvailable) {
      return res
        .status(400)
        .send({ error: "This appointment slot is not available" });
    }

    // Create the appointment for the user and nutritionist
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          appointments: {
            nutritionist: nutritionistId,
            date: appointmentDate,
            time: appointmentTime,
          },
        },
      },
      { new: true }
    );

    // Add the appointment for the nutritionist
    const nutritionistUpdate = await Nutritionist.findOneAndUpdate(
      { _id: nutritionistId },
      {
        $push: {
          appointments: {
            user: userId,
            date: appointmentDate,
            time: appointmentTime,
          },
        },
      },
      { new: true }
    );

    // Return the updated user document
    res.status(200).json({
      message: "Appointment book successfully",
      Appointments: user.appointments,
      Nutritionist: nutritionistUpdate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
});

exports.cancelAppointment = catchAsync(async (req, res, next) => {
  try {
    const { date, time } = req.body;

    // // Find the appointment in the user's appointments array
    const user = await User.findOneAndUpdate(
      {
        "appointments.date": date,
        "appointments.time": time,
      },
      { $pull: { appointments: { date: date, time: time } } }
    );
    // Find the appointment in the user's appointments array
    const nutritionist = await Nutritionist.findOneAndUpdate(
      {
        "appointments.date": date,
        "appointments.time": time,
      },
      { $pull: { appointments: { date: date, time: time } } }
    );

    return res.status(200).json({ message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});
