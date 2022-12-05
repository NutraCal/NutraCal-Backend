var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
let config = require("../config");

/* GET users routes. */ router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/viewUser/:email", function (req, res, next) {
  User.find({ email: req.params.email }).exec(async function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

/* POST user routes. */
router.post("/createUser", async function (req, res, next) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  console.log(req.body);
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send("Email allready exists");
  } else {
    const user = new User({
      email: req.body.email,
      password: hashPassword,
      fitnessGoal: req.body.fitnessGoal,
      gender: req.body.gender,
      age: req.body.age,
      height: req.body.height,
      heightUnit: req.body.heightUnit,
      weight: req.body.weight,
      weightUnit: req.body.weightUnit,
      allergies: req.body.allergies,
      diet: req.body.diet,
      ingredients: req.body.ingredients,
    });
    try {
      const savedUser = await user.save();
      return res.status(200).send("User added successfully");
    } catch (err) {
      console.log(err);
    }
  }
});
router.post("/login", async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (user == null) {
    return res.status(400).send("Email or password is wrong");
  } else {
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (validPass) {
      res.statusCode = 200;
      let token = jwt.sign({ _id: user._id }, config.secret);
      res.statusCode = 200;
      res.header("auth-token", token).send(token);
    } else {
      return res.status(400).send("Email or password is wrong");
    }
  }
});
/*Delte user route. */
router.delete("/deleteUser/:email", function (req, res, next) {
  User.deleteOne({ email: req.params.email }, function (err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

/* PUT user route. */
router.put("/findBmi/:email/:bmi", (req, res, next) => {
  console.log(req.params.bmi);
  User.findOneAndUpdate(
    { email: req.params.email },
    { bmi: req.params.bmi },
    function (err, result) {
      if (err) {
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});

router.put("/editAllergies/:uid", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { allergies: req.body.allergies },
    function (err, result) {
      if (err) {
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});

router.put("/addStepCount/:uid", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        stepCount: {
          count: req.body.count,
          date: Date.now,
        },
      },
    },

    function (err, result) {
      if (err) {
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});

router.put("/addCalores/:uid", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        calories: {
          caloriesIntake: req.body.calories,
          date: Date.now,
        },
      },
    },
    function (err, result) {
      if (err) {
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});

router.put("/addWaterIntake/:uid", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        waterIntake: {
          waterIntake: req.body.waterIntake,
          date: Date.now,
        },
      },
    },
    function (err, result) {
      if (err) {
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});
module.exports = router;
