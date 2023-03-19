let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const Recipes = require("../Models/recipes");
const User = require("../Models/user");
const vision = require("@google-cloud/vision");

const private_key =
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCysCt6TnP7sCoM\nPTpWcD3ps+/tT1jsE/Yn9tbkmp1tBce/H/08AwyI2QAEBtR7YSFoO4gEqk8rMh+d\nsrzdr6vHKgH+XWCPKDZfyRsbvHLvgvSul23Q3b0H5NnsJg47DdwK8mGg74cLS8iN\n6XiaYgpWmdy/1chUW+kndUwQVF2+1yEcUxseYMezwGeCNfxVJrG6C0iQiWAfa3dk\nEbFmmRwsSZ5Vpmvn0wRs4OjeOM5LH/EvE/vGDk1o+YAIm8ay8Cdwb3W35tBNcXqF\nJKmh9433czg+fohmGUJXl+8NalTjzlMc93JhC148zAl0gPq0lSqpeOMbragFQwTy\n9/QAkoszAgMBAAECggEAA9Atgq3ilb5NqS+lwLlbzG8OeLDBkgkJrvYzcAE6c3kK\nN2tdOtxJy9smhwvqRDrhLqCVtbg4srrzp8UWzgoRjyabV54rLa2SHiXV9bRX7HNx\nTtZINqdmgS8tKnfwi1wTImA5jq/DNhvxyu184ihOHUj/Dxefmj4mGQqwUhQAKCQO\nHMBPy5EcolU/gcnFaT4FMwXrGfiO13luxQf8O3vltsnjZfJ+R8nn64pgqrDn5z5U\n//m25NzxT7hEcCnhj73mTb6n7+yy5b+e12/Yu1GVTV0EP7zQU+uPb8z2EN4FAR99\nOrR9B7v9jXAiW+IKOmP+Tga0Mh3HLSA5RBBgIgHWGQKBgQD6sDpwcjjbv+/TB5sx\nEykN0jpCb2DMAW+wgHTv/noOpoGiPEf3hYocdlOczYhqEMN6hZlgAIkelNyaorQl\nFv3Y/l+Yjo6ahJ0sHC5aAGqdVVMs6CooMdT7EeKxMwSOoYYiRLnYLGSDWSILJLqt\n0q+wrz+EJvHPzxcSV2M9JmVWDwKBgQC2eWbEmxvn0tjtfmCcIZLdK69HriVb1bDt\nbUmVgwaR3H7qStoXTeRTJXV7yXXuhbup9ddQjlTOdz5IgoDUgQPuePbN3MajxjZp\nofeFVcCmD9/DsHAQllGI5j9yCEP0a+KtmxgLiAkeWtf5oXEaQzdK840vihA8ejY/\no0YCVur8nQKBgQDineR2OgtEO6Ik9r9IAbYfFGguHlk2kiXRPI55VWYpUEPn0O6N\nx14ulJjJKtOibj0HyTX5HwLVbmRuNZ772GjpfCoW0uf+rtsWQPN10OKQD838znMt\nmr6ZqHVxElmQRlvnJpGJ5beHNVAdGrrW35qK8iFM6Ze279I/dlfzs33v6QKBgEKm\ngVUa2syIhVfqK1ucH8rNZA6om1i56xAuNQx5eXLZuTnW8WZFuzprmkgGxB7FllB0\nTZtNAckQYR2XHXuBTHBUmsGC/MNhaQqYcJKxSdbeQXt2/NfyMAHzKAV842Vp6rhC\nyDueCsado/m4cFmJZ67m2xEcOuX8Nch02OON3/M5AoGBAKc3JuKVzMN4IOXePshD\nh1mNO8jbI1tmBbrdtI3PRVjdGce6PPa29Croa5euKRCPGl5kFNOWiBnK/6ajzYOi\nEf2lTmaH2Bxa1pD4DjrWoa9dpVQ2x8HgE/WLfM34z+ajXghgrPQKPNHal2bRQv6K\nhsUoNBw+OgOspwQMfxRUEG69\n-----END PRIVATE KEY-----\n";
const client_email = "sa-nutracal-ocr@nutracal-ocr.iam.gserviceaccount.com";

exports.detectText = catchAsync(async (req, res, next) => {
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

exports.viewRecipes = catchAsync(async (req, res, next) => {
  Recipes.find()
    .populate("User")
    .exec((error, result) => {
      if (error) {
        return next(error);
      } else {
        res.json(result);
      }
    });
});

exports.viewRecipeByName = catchAsync(async (req, res, next) => {
  Recipes.find({ Title: req.body.title }).exec(async function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  Recipes.deleteOne({ Title: req.body.title }, function (err, result) {
    if (err) return next(err);
    res.json(result);
  });
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
        return next(err);
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
        return next(err);
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
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});
