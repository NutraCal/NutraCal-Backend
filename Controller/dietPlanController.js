const config = require("../config");
const catchAsync = require("../utils/catchAsync");
const DietPlan = require("../Models/dietPlan");
const Users = require("../Models/user");
const request = require("request");
var fs = require("fs");
const { json } = require("body-parser");

exports.dietPlan = catchAsync(async (req, response, next) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  let goal = user.fitnessGoal;
  if (!goal) {
    goal = "Be Healthier";
  }
  let plan = [];
  let savedDietPlan = "";
  let dietPlan = "";
  const options = {
    url: `http://127.0.0.1:5000/dietPlan?goal=${goal}`,
  };
  const now = new Date();
  const currDate =
    now.getFullYear() +
    "-" +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    now.getDate();

  await request.post(options, async function (error, res, body) {
    try {
      // Replace any NaN values with a default recipe
      const parsedBody = JSON.parse(res.body);
      const mealPlan = parsedBody;
      const defaultRecipe = "Greek Yogurt with Berries";
      plan = parsedBody;
      dietPlan = new DietPlan({
        email: req.body.email,
        day1: [plan[0][0], plan[0][1], plan[0][2]],
        day2: [plan[1][0], plan[1][1], plan[1][2]],
        day3: [plan[2][0], plan[2][1], plan[2][2]],
        day4: [plan[3][0], plan[3][1], plan[3][2]],
        day5: [plan[4][0], plan[4][1], plan[4][2]],
        day6: [plan[5][0], plan[5][1], plan[5][2]],
        day7: [plan[6][0], plan[6][1], plan[6][2]],
        date: currDate,
      });
      savedDietPlan = await dietPlan.save();
    } catch (err) {
      console.log(err);
    }
  });
  return response
    .status(200)
    .json({ message: "Diet Plan created successfully" });
});

exports.getPlan = catchAsync(async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log(email);
    const latestPlan = await DietPlan.findOne({ email: email })
      .sort({ date: -1 })
      .exec();
    if (latestPlan) {
      res.json(latestPlan);
    } else {
      res.status(404).json({ message: "Diet plan not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.getPlanOfDay = catchAsync(async (req, res, next) => {
  try {
    const email = req.body.email;
    const day = req.body.day;
    let dayNumber = "day" + req.body.day;
    console.log(dayNumber);
    console.log(day);
    console.log(email);
    const latestPlan = await DietPlan.findOne({ email: email })
      .sort({ date: -1 })
      .exec();
    if (latestPlan) {
      console.log(latestPlan[dayNumber]);
      res.json(latestPlan[dayNumber]);
    } else {
      res.status(404).json({ message: "Diet plan not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
