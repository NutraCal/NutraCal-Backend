const admin = require("firebase-admin");
let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const User = require("../Models/user");
const Notification = require("../Models/notifications");

exports.registerNotification = catchAsync(async (req, res, next) => {
  console.log("register");
  const { tokenID, email } = req.body;
  console.log(email);
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  const userID = user._id;
  console.log(userID);
  const obj = await Notification.findOne({ user: userID });
  console.log("here");
  if (obj) {
    return res.status(200).json({
      status: "success",
      data: {
        message: "Token already registered!",
      },
    });
  }
  console.log("Token already registered");
  const newNotification = new Notification({
    user: userID, // Assign a valid user ID here
    tokenID: tokenID, // Assign a valid token ID here
    notifications: [
      { title: "New Message", body: "Log data for better performance" },
    ],
  });
  const savedNotification = await newNotification.save();
  return res.status(200).send({ message: "Token saved successfully" });
});

exports.sendNotification = catchAsync(async (req, res, next) => {
  try {
    const { tokenID, email, title, body, navigate } = req.body;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    const userID = user._id;
    const obj = await Notification.findOne({ user: userID });

    if (!obj) {
      return next(
        new AppError("No Such User with Notifications Object Found", 404)
      );
    }
    // Define the message payload
    const notification = {
      title: title ? title : "New Notification",
      body: body ? body : "Log data for better performance!",
      data: {
        navigate: navigate ? navigate : "SelectRole",
      },
      android: {
        // smallIcon: "logo_circle",
        channelId: "default",
        importance: 4,
        actions: [
          {
            title: "Mark as Read",
            pressAction: {
              id: "read",
            },
          },
        ],
      },
    };
    obj.notifications.push(notification);
    await obj.save();

    await admin.messaging().sendMulticast({
      tokens: [tokenID],
      data: {
        notifee: JSON.stringify(notification),
      },
    });

    res.status(200).json({ message: "Successfully sent notifications!" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

exports.getNotification = catchAsync(async (req, res, next) => {
  const { tokenID, email } = req.body;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ message: "User not found" });
  }
  const userID = user._id;
  const obj = await Notification.findOne({ user: userID });

  if (!obj) {
    return next(
      new AppError("No Such User with Notifications Object Found", 404)
    );
  }

  return res.status(200).json({
    status: "success",
    obj,
  });
});

exports.updateNotification = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ message: "User not found" });
  }
  const userID = user._id;

  const obj = await Notification.findOne({ user: userID });
  if (!obj) {
    return res.status(400).send({ message: "User not found" });
  }
  try {
    Notification.findOneAndUpdate(
      { _id: obj._id },
      { tokenID: req.body.tokenID },
      function (err, result) {
        if (err) {
          return res.status(500).json({ message: "Error while editing blog" });
        }
        res.status(200).json({ message: "Blog successfully updated" });
      }
    );
  } catch (err) {
    return res.status(400).json({ message: "Error while editing blog" });
  }
});
