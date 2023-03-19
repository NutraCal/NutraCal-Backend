var express = require("express");

const authController = require("../Controller/authController");

var router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
let config = require("../config");

router.post("/createUser", authController.signup);
router.post("/login", authController.login);
router.post("/googleLogIn", authController.googleLogin);
router.delete("/deleteUser/:email", authController.deleteUser);
router.put("/findBmi", authController.findBmi);
router.get("/viewUser/:email", authController.viewUser);
router.post("/updateWaterIntake", authController.updateWaterIntake);
router.get("/", authController.getAllUsers);

module.exports = router;
