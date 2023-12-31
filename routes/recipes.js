var express = require("express");
var router = express.Router();
const recipeController = require("../Controller/recipeController");
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
router.post("/addRecipe", upload.single("photo"), recipeController.addRecipe);
router.get("/viewRecipes", recipeController.viewRecipes);
router.get("/viewAllUnapproved", recipeController.viewAllUnapproved);
router.post("/viewRecipeByName", recipeController.viewRecipeByName); //TO THIS
router.post("/detectText", upload.single("photo"), recipeController.detectText);
router.put("/editRecipe", recipeController.editRecipe);
router.put("/edit/likes", recipeController.updateLikes);
router.put("/approveRecipe", recipeController.approveRecipe);
router.delete("/deleteRecipe", recipeController.deleteRecipe);
router.post("/filterRecipe", recipeController.filterRecipe);
router.post("/userRecipes", recipeController.userRecipes);
router.post("/userUnapprovedRecipes", recipeController.userUnapprovedRecipes);
router.post("/searchRecipes", recipeController.searchRecipes);
router.post("/findCalories", recipeController.findCalories);
router.post("/likeRecipe", recipeController.likeRecipe);
router.post("/suggestRecipes", recipeController.suggestRecipe);
router.put("/rejectRecipe", recipeController.rejectRecipe);

module.exports = router;
