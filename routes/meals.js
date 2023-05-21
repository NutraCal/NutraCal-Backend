var express = require("express");
var router = express.Router();
const mealsController = require("../Controller/mealsController");
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.get("/viewMeal/:email", mealsController.getMeal);
router.post("/dailyLog", mealsController.dailyLog);
router.post("/addMeal/:email", upload.single("photo"), mealsController.addMeal);
router.put("/updateMeal", mealsController.updateMeal);
router.delete("/deleteAll", mealsController.deleteAllMeals);
router.delete("/deleteMeal", mealsController.deleteMeal);
router.post("/updateCalories", mealsController.updateCalories);
router.post("/updateStepCount", mealsController.updateStepCount);
router.post("/getCaloriesMacros", mealsController.getCaloriesMacros);
router.post("/getSteps", mealsController.getSteps);
router.post("/getWaterIntake", mealsController.getWaterIntake);

module.exports = router;
