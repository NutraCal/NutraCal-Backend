var express = require("express");
const authController = require("../Controller/authController");
var router = express.Router();
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
//multer image storing for blogs
router.post("/createUser", upload.single("photo"), authController.signup);
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
