var express = require("express");
const authController = require("../Controller/adminAuthController");
var router = express.Router();

router.post("/createAdmin", authController.signupAdmin);
router.post("/loginAdmin", authController.loginAdmin);
router.delete("/deleteAdmin/:email", authController.deleteAdmin);
router.post("/verifyToken", authController.verifyToken);

module.exports = router;
