let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const Meals = require("../Models/meals");
const User = require("../Models/user");

exports.getMeal = catchAsync(async (req, res, next) => {
  Meals.find({ user: req.body.userId }).exec(async function (error, results) {
    if (error) {
      return next(error);
    }
    res.json(results);
  });
});

exports.addMeal = catchAsync(async (req, res, next) => {
  const now = new Date();
  const currDate =
    now.getFullYear() +
    "-" +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    now.getDate();
  const { userId, name, category, calories, proteins, fats, carbohydrates } =
    req.body;
  if (
    !userId ||
    !name ||
    !category ||
    !calories ||
    !proteins ||
    !fats ||
    !carbohydrates
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
    });
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
        res.status(400).send("Can't update the shopping list, try again");
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});
exports.deleteAllMeals = catchAsync(async (req, res, next) => {
  Meals.deleteMany({ user: req.body.userId }, function (err, result) {
    if (err) {
      res.status(400).send("Can't clear the shopping list, try again");
      return next(err);
    }
    res.status(200).json(result);
  });
});
exports.deleteMeal = catchAsync(async (req, res, next) => {
  Meals.deleteOne({ _id: req.body.mealId }, function (err, result) {
    if (err) {
      res.status(400).send("Can't clear the shopping list, try again");
      return next(err);
    }
    res.status(200).json(result);
  });
});

exports.updateCalories = catchAsync(async (req, res, next) => {
  try {
    const { userId, dateExt, email } = req.body;
    const date2 = req.body.date;
    console.log(typeof date2);
    const date = date2.split("T")[0];
    const now = new Date();
    const currDate =
      now.getFullYear() +
      "-" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      now.getDate();
    console.log(currDate);
    console.log(date); // "2023-03-19"
    const meals = await Meals.find({ user: userId, date: date });
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
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
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
