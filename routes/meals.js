var express = require("express");
var router = express.Router();
const mealsController = require("../Controller/mealsController");

router.get("/viewMeal/:email", mealsController.getMeal);
router.post("/dailyLog", mealsController.dailyLog);
router.post("/addMeal/:email", mealsController.addMeal);
router.put("/updateMeal", mealsController.updateMeal);
router.delete("/deleteAll", mealsController.deleteAllMeals);
router.delete("/deleteMeal", mealsController.deleteMeal);
router.post("/updateCalories", mealsController.updateCalories);
router.post("/updateStepCount", mealsController.updateStepCount);
router.post("/getCaloriesMacros", mealsController.getCaloriesMacros);
router.post("/getSteps", mealsController.getSteps);
router.post("/getWaterIntake", mealsController.getWaterIntake);

module.exports = router;
