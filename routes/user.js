var express = require("express");
var router = express.Router();
const User = require("../Models/user");

/* GET users routes. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// router.get("/viewUser/:uid", function (req, res, next) {
//   User.findById(req.params.id).exec((error,result))=>{
//     if(error){
//       return next(error);
//     }
//     else{
//       res.json(result);
//     }
//   }
// });

/* POST user routes. */
router.post("/createUser", async function (req, res, next) {
  console.log(req.body);
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send("Email allready exists");
  } else {
    User.create(req.body)
      .then(
        (user) => {
          console.log("User added ", user);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
});

/*Delte user route. */
router.delete("/deleteUser/:uid", function (req, res, next) {
  User.deleteOne({ _id: req.params.id }, function (err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

/* PUT user route. */
router.put("/findBmi/:uid", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { bmi: req.body.bmi },
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
