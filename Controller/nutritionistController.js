const jwt = require("jsonwebtoken");
const Nutritionist = require("../Models/nutritionist");
const User = require("../Models/user");
let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.deleteNutritionist = catchAsync(async (req, res, next) => {
  Nutritionist.deleteOne({ email: req.params.email }, function (err, result) {
    if (err) return res.status(500).json({ msg: "Unable to delete record" });
    res.status(200).json(result);
  });
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
    const nutritionist = await Nutritionist.findOne({
      email: req.body.nutritionistEmail,
    });
    const user = await User.findOne({
      email: req.body.userEmail,
    });

    if (!nutritionist || !user) {
      return res.status(404).send({ error: "Please provide valid email" });
    }

    const nutritionistId = nutritionist._id;
    const userId = user._id;
    const appointmentDay = req.body.day;
    const appointmentTime = req.body.time;

    // Convert startDay, endDay and appointmentDay to corresponding numbers
    const dayMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };
    const startDayNum = dayMap[nutritionist.startDay];
    const endDayNum = dayMap[nutritionist.endDay];
    const appointmentDayNum = dayMap[appointmentDay];
    console.log(startDayNum, endDayNum, appointmentDayNum);
    // Check if the nutritionist is available on the given day and time
    const isAvailable = await Nutritionist.findOne({
      _id: nutritionistId,
      $and: [
        { startTime: { $lte: appointmentTime } },
        { endTime: { $gte: appointmentTime } },
      ],
    });

    if (!isAvailable) {
      if (startDayNum >= appointmentDayNum && endDayNum <= appointmentDayNum) {
        return res
          .status(400)
          .send({ error: "The nutritionist is not available at this time" });
      }
    }

    // Check if the nutritionist already has an appointment at the given day and time
    const hasAppointment = await Nutritionist.findOne({
      _id: nutritionistId,
      "appointments.day": appointmentDay,
      "appointments.time": appointmentTime,
    });

    if (hasAppointment) {
      return res
        .status(400)
        .send({ error: "This appointment slot is not available" });
    }

    // Create the appointment for the user and nutritionist
    const userUpdate = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          appointments: {
            nutritionist: nutritionistId,
            day: appointmentDay,
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
            day: appointmentDay,
            time: appointmentTime,
          },
        },
      },
      { new: true }
    );

    // Return the updated user document
    res.status(200).json({
      message: "Appointment booked successfully",
      Appointments: userUpdate.appointments,
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
