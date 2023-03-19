var express = require("express");
var router = express.Router();
const mealsController = require("../Controller/mealsController");

router.get("/viewMeal", mealsController.getMeal);
router.post("/addMeal", mealsController.addMeal);
router.put("/updateMeal", mealsController.updateMeal);
router.delete("/deleteAll", mealsController.deleteAllMeals);
router.delete("/deleteMeal", mealsController.deleteMeal);
router.post("/updateCalories", mealsController.updateCalories);

module.exports = router;
