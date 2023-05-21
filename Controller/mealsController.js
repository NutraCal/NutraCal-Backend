let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const Meals = require("../Models/meals");
const User = require("../Models/user");

exports.getMeal = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  const userId = user._id;
  Meals.find({ user: userId }).exec(async function (error, results) {
    if (error) {
      res.status(500).send(error);
    }
    res.json(results);
  });
});

exports.dailyLog = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("User not found");
  }

  const userId = user._id;
  const { date } = req.body; // Assuming the date is provided in the req.body

  // Query meals with the specific user and date
  Meals.find({ user: userId, date: req.body.date }).exec((error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(201).send("No results found");
    }
  });
});

exports.addMeal = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  const userId = user._id;

  const now = new Date();
  const currDate =
    now.getFullYear() +
    "-" +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    now.getDate();
  const { name, category, calories, proteins, fats, carbohydrates, time } =
    req.body;
  if (
    !userId ||
    !name ||
    !category ||
    !calories ||
    !proteins ||
    !fats ||
    !carbohydrates ||
    !time
  ) {
    return res.status(400).send("Kindly provide all the fields");
  } else {
    const newMeal = new Meals({
      user: userId,
      name: name,
      category: category,
      calories: calories,
      proteins: proteins,
      fats: fats,
      carbohydrates: carbohydrates,
      date: currDate,
      time: time,
    });
    if (req.file) {
      console.log("Storing Image");
      newMeal.Image = {
        filename: req.file.filename,
        contentType: req.file.mimetype,
        url: "http://localhost:8000/" + req.file.filename,
      };
    }
    try {
      const savedMeal = await newMeal.save();
      return res.status(200).send("Meal added successfully");
    } catch (err) {
      console.log(err);
    }
  }
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const {
    mealId,
    name,
    category,
    calories,
    proteins,
    fats,
    carbohydrates,
    date,
  } = req.body;
  Meals.findOneAndUpdate(
    { _id: mealId },
    {
      name: name,
      category: category,
      calories: calories,
      proteins: proteins,
      fats: fats,
      carbohydrates: carbohydrates,
      date: date,
    },
    function (err, result) {
      if (err) {
        res.status(400).send("Can't update, try again");
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});
exports.deleteAllMeals = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  const userId = user._id;
  Meals.deleteMany({ user: userId }, function (err, result) {
    if (err) {
      res.status(400).send("Can't clear, try again");
      return next(err);
    }
    res.status(200).json(result);
  });
});
exports.deleteMeal = catchAsync(async (req, res, next) => {
  Meals.deleteOne({ _id: req.body.mealId }, function (err, result) {
    if (err) {
      res.status(400).send("Can't clear, try again");
      return next(err);
    }
    res.status(200).json(result);
  });
});

exports.updateCalories = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const userId = user._id;
    const now = new Date();
    const currDate =
      now.getFullYear() +
      "-" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      now.getDate();
    console.log(currDate); // "2023-03-19"
    const meals = await Meals.find({ user: userId, date: currDate });
    const nutrientSums = {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbohydrates: 0,
    };
    meals.forEach((meal) => {
      nutrientSums.calories += meal.calories;
      nutrientSums.proteins += meal.proteins;
      nutrientSums.fats += meal.fats;
      nutrientSums.carbohydrates += meal.carbohydrates;
    });

    console.log(nutrientSums);
    const lastCaloriesRecord = user.calories[user.calories.length - 1];
    if (lastCaloriesRecord && lastCaloriesRecord.date === currDate) {
      lastCaloriesRecord.caloriesIntake = nutrientSums.calories;
      lastCaloriesRecord.proteinsIntake = nutrientSums.proteins;
      lastCaloriesRecord.fatsIntake = nutrientSums.fats;
      lastCaloriesRecord.carbsIntake = nutrientSums.carbohydrates;
    } else {
      user.calories.push({
        caloriesIntakes: nutrientSums.calories,
        proteinsIntake: nutrientSums.proteins,
        fatsIntake: nutrientSums.fats,
        carbsIntake: nutrientSums.carbohydrates,
        date: currDate,
      });
    }
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Unable to update record" });
  }
});

exports.updateStepCount = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const userId = user._id;
    const now = new Date();
    const currDate =
      now.getFullYear() +
      "-" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      now.getDate();
    console.log(currDate); // "2023-03-19"
    const lastRecord = user.stepCount[user.stepCount.length - 1];
    console.log(lastRecord); //
    console.log(req.body.stepCount); //
    if (lastRecord && lastRecord.date === currDate) {
      lastRecord.count = lastRecord.count + req.body.stepCount;
    } else {
      user.stepCount.push({
        count: req.body.stepCount,
        date: currDate,
      });
    }
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

exports.getCaloriesMacros = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body; // Extract the email from the request body

    const currentDate = new Date(); // Current date
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7); // Subtract 7 days from current date
    oneWeekAgo.setHours(0, 0, 0, 0); // Set time to midnight

    const formattedCurrentDate = formatDate(currentDate); // Format current date to "YYYY-MM-DD" string
    const formattedOneWeekAgo = formatDate(oneWeekAgo); // Format one week ago date to "YYYY-MM-DD" string

    const user = await User.findOne({
      email: email,
      "calories.date": {
        $gte: formattedOneWeekAgo,
        $lte: formattedCurrentDate,
      },
    }).select("calories");

    if (!user) {
      return res.status(404).json({
        message: "User not found or no records found for the past seven days.",
      });
    }

    // Process the retrieved calories data for the user
    const processedData = user.calories;

    res.json({ data: processedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
exports.getSteps = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body; // Extract the email from the request body

    const currentDate = new Date(); // Current date
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7); // Subtract 7 days from current date
    oneWeekAgo.setHours(0, 0, 0, 0); // Set time to midnight

    const formattedCurrentDate = formatDate(currentDate); // Format current date to "YYYY-MM-DD" string
    const formattedOneWeekAgo = formatDate(oneWeekAgo); // Format one week ago date to "YYYY-MM-DD" string

    const user = await User.findOne({
      email: email,
      "stepCount.date": {
        $gte: formattedOneWeekAgo,
        $lte: formattedCurrentDate,
      },
    }).select("stepCount");

    if (!user) {
      return res.status(404).json({
        message: "User not found or no records found for the past seven days.",
      });
    }

    // Process the retrieved calories data for the user
    const processedData = user.stepCount;

    res.json({ data: processedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.getWaterIntake = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body; // Extract the email from the request body

    const currentDate = new Date(); // Current date
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7); // Subtract 7 days from current date
    oneWeekAgo.setHours(0, 0, 0, 0); // Set time to midnight

    const formattedCurrentDate = formatDate(currentDate); // Format current date to "YYYY-MM-DD" string
    const formattedOneWeekAgo = formatDate(oneWeekAgo); // Format one week ago date to "YYYY-MM-DD" string

    const user = await User.findOne({
      email: email,
      "waterIntake.date": {
        $gte: formattedOneWeekAgo,
        $lte: formattedCurrentDate,
      },
    }).select("waterIntake");

    if (!user) {
      return res.status(404).json({
        message: "User not found or no records found for the past seven days.",
      });
    }

    // Process the retrieved calories data for the user
    const processedData = user.waterIntake;

    res.json({ data: processedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Helper function to format date as "YYYY-MM-DD" string
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
