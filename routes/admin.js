var express = require("express");
var router = express.Router();
const multer = require("multer");
const authController = require("../Controller/adminAuthController");

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
router.post("/createAdmin", upload.single("photo"), authController.signupAdmin);
router.post("/loginAdmin", authController.loginAdmin);
router.delete("/deleteAdmin/:email", authController.deleteAdmin);
router.post("/verifyToken", authController.verifyToken);

module.exports = router;
