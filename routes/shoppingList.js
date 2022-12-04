var express = require("express");
var router = express.Router();
const shoppingList = require("../Models/shoppingList");

/* GET users routes. */
router.get("/viewList/:uid", (req, res, next) => {
  shoppingList.find({user:req.params.uid})
    .populate("user")
    .then(
      (list) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(list);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});


/* PUT user route. */
router.put("/clearList/:uid",(req,res,next)=>{
  shoppingList.findOneAndUpdate({user:req.params.uid},{list:[]},
  function(err,result){
    if(err) {
      return next(err);
    }
    res.status(200).json(result);
  })
});

router.put("/update/:uid",(req,res,next)=>{
  User.findOneAndUpdate({user:req.params.uid},
    {
      $push: {
        list: req.params.shoppingList
      },
    }
  function(err,result){
    if(err) {
      return next(err);
    }
    res.status(200).json(result);
  })
});

