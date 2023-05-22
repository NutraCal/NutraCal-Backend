let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const Recipes = require("../Models/recipes");
const User = require("../Models/user");
const vision = require("@google-cloud/vision");

const private_key =
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCysCt6TnP7sCoM\nPTpWcD3ps+/tT1jsE/Yn9tbkmp1tBce/H/08AwyI2QAEBtR7YSFoO4gEqk8rMh+d\nsrzdr6vHKgH+XWCPKDZfyRsbvHLvgvSul23Q3b0H5NnsJg47DdwK8mGg74cLS8iN\n6XiaYgpWmdy/1chUW+kndUwQVF2+1yEcUxseYMezwGeCNfxVJrG6C0iQiWAfa3dk\nEbFmmRwsSZ5Vpmvn0wRs4OjeOM5LH/EvE/vGDk1o+YAIm8ay8Cdwb3W35tBNcXqF\nJKmh9433czg+fohmGUJXl+8NalTjzlMc93JhC148zAl0gPq0lSqpeOMbragFQwTy\n9/QAkoszAgMBAAECggEAA9Atgq3ilb5NqS+lwLlbzG8OeLDBkgkJrvYzcAE6c3kK\nN2tdOtxJy9smhwvqRDrhLqCVtbg4srrzp8UWzgoRjyabV54rLa2SHiXV9bRX7HNx\nTtZINqdmgS8tKnfwi1wTImA5jq/DNhvxyu184ihOHUj/Dxefmj4mGQqwUhQAKCQO\nHMBPy5EcolU/gcnFaT4FMwXrGfiO13luxQf8O3vltsnjZfJ+R8nn64pgqrDn5z5U\n//m25NzxT7hEcCnhj73mTb6n7+yy5b+e12/Yu1GVTV0EP7zQU+uPb8z2EN4FAR99\nOrR9B7v9jXAiW+IKOmP+Tga0Mh3HLSA5RBBgIgHWGQKBgQD6sDpwcjjbv+/TB5sx\nEykN0jpCb2DMAW+wgHTv/noOpoGiPEf3hYocdlOczYhqEMN6hZlgAIkelNyaorQl\nFv3Y/l+Yjo6ahJ0sHC5aAGqdVVMs6CooMdT7EeKxMwSOoYYiRLnYLGSDWSILJLqt\n0q+wrz+EJvHPzxcSV2M9JmVWDwKBgQC2eWbEmxvn0tjtfmCcIZLdK69HriVb1bDt\nbUmVgwaR3H7qStoXTeRTJXV7yXXuhbup9ddQjlTOdz5IgoDUgQPuePbN3MajxjZp\nofeFVcCmD9/DsHAQllGI5j9yCEP0a+KtmxgLiAkeWtf5oXEaQzdK840vihA8ejY/\no0YCVur8nQKBgQDineR2OgtEO6Ik9r9IAbYfFGguHlk2kiXRPI55VWYpUEPn0O6N\nx14ulJjJKtOibj0HyTX5HwLVbmRuNZ772GjpfCoW0uf+rtsWQPN10OKQD838znMt\nmr6ZqHVxElmQRlvnJpGJ5beHNVAdGrrW35qK8iFM6Ze279I/dlfzs33v6QKBgEKm\ngVUa2syIhVfqK1ucH8rNZA6om1i56xAuNQx5eXLZuTnW8WZFuzprmkgGxB7FllB0\nTZtNAckQYR2XHXuBTHBUmsGC/MNhaQqYcJKxSdbeQXt2/NfyMAHzKAV842Vp6rhC\nyDueCsado/m4cFmJZ67m2xEcOuX8Nch02OON3/M5AoGBAKc3JuKVzMN4IOXePshD\nh1mNO8jbI1tmBbrdtI3PRVjdGce6PPa29Croa5euKRCPGl5kFNOWiBnK/6ajzYOi\nEf2lTmaH2Bxa1pD4DjrWoa9dpVQ2x8HgE/WLfM34z+ajXghgrPQKPNHal2bRQv6K\nhsUoNBw+OgOspwQMfxRUEG69\n-----END PRIVATE KEY-----\n";
const client_email = "sa-nutracal-ocr@nutracal-ocr.iam.gserviceaccount.com";

exports.detectText = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const client = new vision.ImageAnnotatorClient({
    credentials: {
      private_key: private_key,
      client_email: client_email,
    },
  });
  try {
    let [result] = await client.textDetection(req.body.file);
    console.log(result.fullTextAnnotation.text);
    res.send(result.fullTextAnnotation.text);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error detecting text.");
  }
});

exports.addRecipe = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const {
    user,
    title,
    category,
    quantity,
    recipeMethod,
    ingredients,
    calories,
    proteins,
    fats,
    carbs,
    allergies,
    servingSize,
  } = req.body;

  if (
    !user ||
    !title ||
    !category ||
    !quantity ||
    !recipeMethod ||
    !ingredients ||
    !calories ||
    !proteins ||
    !fats ||
    !carbs ||
    !allergies ||
    !servingSize
  ) {
    return res.status(400).send("Please fill all the fields");
  }

  const recipe = new Recipes({
    User: user,
    Title: title,
    Category: category,
    Quantity: quantity,
    RecipeMethod: recipeMethod,
    Ingredients: ingredients,
    Calories: calories,
    Proteins: proteins,
    Fats: fats,
    Carbs: carbs,
    Allergies: allergies,
    ServingSize: servingSize,
  });
  if (req.file) {
    console.log("Storing Image");
    recipe.Image = {
      filename: req.file.filename,
      contentType: req.file.mimetype,
      url: "http://localhost:8000/" + req.file.filename,
    };
  }
  try {
    const savedUser = await recipe.save();
    return res.status(200).send("Recipe added successfully");
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err);
  }
});

exports.viewRecipes = catchAsync(async (req, res, next) => {
  try {
    Recipes.find()
      .populate("User")
      .exec((error, result) => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.status(200).json(result);
        }
      });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

exports.viewRecipeByName = catchAsync(async (req, res, next) => {
  Recipes.find({ Title: req.body.title }).exec(async function (error, results) {
    if (error) {
      return res.status(500).send(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  try {
    Recipes.deleteOne({ Title: req.body.title }, function (err, result) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

exports.editRecipe = catchAsync(async (req, res, next) => {
  Recipes.findOneAndUpdate(
    { _id: req.body.recipeId },
    {
      Title: req.body.userName,
      Ingredients: req.body.ingredients,
      Calories: req.body.calories,
      ServingSize: req.body.servingSize,
      RecipeMethod: req.body.recipeMethod,
    },
    function (err, result) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(result);
    }
  );
});

exports.updateLikes = catchAsync(async (req, res, next) => {
  Recipes.findOneAndUpdate(
    { _id: req.body.recipeId },
    {
      likesCount: req.body.likes,
    },
    function (err, result) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(result);
    }
  );
});

exports.approveRecipe = catchAsync(async (req, res, next) => {
  const appStatus = 1;
  Recipes.findOneAndUpdate(
    { _id: req.body.recipeId },
    {
      approved: appStatus,
    },
    function (err, result) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(result);
    }
  );
});

exports.filterRecipe = catchAsync(async (req, res, next) => {
  try {
    const category = req.body.category;
    let ingredients = "";
    if (req.body.ingredients) {
      ingredients = req.body.ingredients.map(
        (ingredient) => new RegExp(ingredient, "i")
      );
    }

    const caloriesMin = req.body.calories_min
      ? parseInt(req.body.calories_min)
      : 0;
    const caloriesMax = req.body.calories_max
      ? parseInt(req.body.calories_max)
      : Infinity;

    let query = {};
    if (category) {
      query.Category = category;
    }
    if (ingredients.length > 0) {
      query.Ingredients = { $all: ingredients };
    }
    if (caloriesMin && caloriesMax) {
      query.Calories = { $gte: caloriesMin, $lte: caloriesMax };
    }
    const recipes = await Recipes.find(query);
    res.status(200).json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

exports.suggestRecipe = catchAsync(async (req, res, next) => {
  try {
    const ingredients = req.body.ingredients;

    if (ingredients.length === 0) {
      return res.status(400).json({ message: "Please provide ingredients" });
    }

    const lowerCaseIngredients = ingredients.map((ingredient) =>
      ingredient.toLowerCase()
    );

    const recipes = await Recipes.find({
      Ingredients: { $in: lowerCaseIngredients },
    });

    const filteredRecipes = recipes
      .map((recipe) => {
        const matchingIngredients = recipe.Ingredients.filter((ingredient) =>
          lowerCaseIngredients.includes(ingredient.toLowerCase())
        );
        return {
          Title: recipe.Title,
          MatchedIngredients: matchingIngredients,
          MatchedIngredientsCount: matchingIngredients.length,
        };
      })
      .filter((recipe) => recipe.MatchedIngredientsCount >= 2);

    res.status(200).json(filteredRecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

exports.userRecipes = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: req.body.email });
    const userId = user._id;
    console.log(userId);
    recipes = await Recipes.find({ User: userId });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
  }
});

exports.searchRecipes = catchAsync(async (req, res, next) => {
  try {
    const recipes = await Recipes.find({ Title: req.body.title });
    if (recipes == null) {
      return res.status(500).json({ message: "No recipes found" });
    } else {
      res.status(200).json(recipes);
    }
  } catch (err) {
    console.error(err.message);
  }
});

exports.findCalories = catchAsync(async (req, res, next) => {
  try {
    const recipeTitles = req.body.titles;
    const recipeCalories = [];
    for (const title of recipeTitles) {
      const recipe = await Recipes.findOne({ Title: title }).exec();
      if (recipe) {
        recipeCalories.push(recipe.Calories);
      } else {
        recipeCalories.push(null);
      }
    }
    res.status(200).json(recipeCalories);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

//Route to like the Recipe
exports.likeRecipe = catchAsync(async (req, res, next) => {
  try {
    const title = req.body.title;
    const email = req.body.email;

    // Check if the blog post exists in the database
    const recipe = await Recipes.findOne({ Title: title });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already liked the blog post
    const existingLike = recipe.LikesCount.find((like) => like.email === email);

    if (existingLike) {
      // If the user has already liked the post, remove their like
      recipe.LikesCount = recipe.LikesCount.filter(
        (like) => like.email !== email
      );
    } else {
      // Otherwise, add a new like
      recipe.LikesCount.push({
        email: email,
        like: 1,
      });
    }

    // Save the updated blog post to the database
    const updatedRecipe = await recipe.save();

    res.status(200).json({
      message: "Recipe likes saved successfully",
      likesCount: updatedRecipe.LikesCount.length,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
