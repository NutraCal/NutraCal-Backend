var express = require("express");
var router = express.Router();
const Recipes = require("../Models/recipes");
const Users = require("../Models/user");
const recipeController = require("../Controller/recipeController");

router.get("/viewRecipes", recipeController.viewRecipes);
router.get("/viewRecipeByName", recipeController.viewRecipeByName);
router.get("/detectText", recipeController.detectText);
router.put("/editRecipe", recipeController.editRecipe);
router.put("/edit/likes", recipeController.updateLikes);
router.put("/approveRecipe", recipeController.approveRecipe);
router.delete("/deleteRecipe", recipeController.deleteRecipe);

// /* POST user routes. */
// router.post("/addRecipe", function(req,res,next){
//   Recipes.create(req.body)
//     .then(
//       (recipe) => {
//         console.log("Recipe added ", recipe);
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "application/json");
//         res.json(recipe);
//       },
//       (err) => next(err)
//     )
//     .catch((err) => next(err));
// })

module.exports = router;
