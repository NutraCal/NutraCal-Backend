var express = require("express");
const authController = require("../Controller/nutritionistController");
var router = express.Router();

router.post("/createNutritionist", authController.signupNutritionist);
router.post("/loginNutritionist", authController.loginNutritionist);
router.delete("/deleteNutritionist/:email", authController.deleteNutritionist);
router.post("/verifyToken", authController.verifyToken);
router.post("/rateNutritionist", authController.rateNutritionist);
router.post("/followNutritionist", authController.followNutritionist);
module.exports = router;
