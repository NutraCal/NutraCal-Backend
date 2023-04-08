var express = require("express");
const authController = require("../Controller/authController");
var router = express.Router();

router.post("/createUser", authController.signup);
router.post("/login", authController.login);
router.post("/googleLogIn", authController.googleLogin);
router.delete("/deleteUser/:email", authController.deleteUser);
router.put("/findBmi", authController.findBmi);
router.put("/updateUser", authController.updateUser);
router.get("/getWaterIntake", authController.getWaterIntake);
router.get("/viewUser/:email", authController.viewUser);
router.get("/getUserId/:email", authController.getUserId);
router.post("/updateWaterIntake", authController.updateWaterIntake);
router.get("/", authController.getAllUsers);
router.post("/verifyToken", authController.verifyToken);

module.exports = router;
