var express = require("express");
var router = express.Router();
const Recipes = require("../Models/recipes");

/* GET users routes. */
router.get("/viewRecipes", function (req, res, next) {
  Recipes.find().populate("user").exec((error,result))=>{
    if(error){
      return next(error);
    }
    else{
      res.json(result);
    }
  }
});

router.get("/viewRecipes/:rid", function (req, res, next) {
  Recipes.findById(req.params.rid).populate("user").exec((error,result))=>{
    if(error){
      return next(error);
    }
    else{
      res.json(result);
    }
  }
});

/* POST user routes. */
router.post("/addRecipe", function(req,res,next){
  Recipes.create(req.body)
    .then(
      (recipe) => {
        console.log("Recipe added ", recipe);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(recipe);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
})


/*Delte user route. */
router.delete("/delete/:rid", function (req, res, next) {
  Recipes.deleteOne({ _id: req.params.rid }, function (err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

/* PUT user route. */
router.put("/update/:rid",(req,res,next)=>{
  User.findOneAndUpdate({_id:req.params.rid},{
    recipeName:req.body.userName,
    ingredients:req.body.ingredients,
    calories:req.body.calories,
    servingSize:req.body.servingSize,
    recipeMethod:req.body.recipeMethod
  },
  function(err,result){
    if(err) {
      return next(err);
    }
    res.status(200).json(result);
  })
});

router.put("/update/likes/:rid",(req,res,next)=>{
  User.findOneAndUpdate({_id:req.params.rid},{likes:req.body.likes},
  function(err,result){
    if(err) {
      return next(err);
    }
    res.status(200).json(result);
  })
});


