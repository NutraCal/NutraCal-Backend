var express = require("express");
var router = express.Router();
const Student = require("../Models/Student");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Backend" });
});

router.post("/abc", function (req, res, next) {
  console.log(req.body);
  Student.create(req.body)
    .then(
      (student) => {
        console.log("Teacher has been Added ", teacher);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(teacher);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/getCaloriesInfo", function (req, res, next) {
  res.render("index", { title: "Backend" });
});

router.get("/getBarcodeInfo", function (req, res, next) {
  res.render("index", { title: "Backend" });
});

module.exports = router;
