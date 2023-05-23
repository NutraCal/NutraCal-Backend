var express = require("express");
const authController = require("../Controller/nutritionistController");
var router = express.Router();

router.delete("/deleteNutritionist/:email", authController.deleteNutritionist);
router.post("/rateNutritionist", authController.rateNutritionist);
router.post("/followNutritionist", authController.followNutritionist);
router.post("/bookAppointment", authController.bookAppointment);
router.delete("/cancelAppointment", authController.cancelAppointment);
router.post("/searchNutritionist", authController.searchNutritionist);
router.post("/getAppointments", authController.getAppointments);
router.get("/viewNutritionists", authController.viewNutritionists);
module.exports = router;
