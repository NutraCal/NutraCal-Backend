const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recipesSchema = new Schema({
  User: {
    type: String,
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Quantity: {
    type: [String],
    required: true,
  },
  RecipeMethod: {
    type: [String],
    required: true,
  },
  Ingredients: {
    type: [String],
    required: true,
  },
  Calories: {
    type: Number,
  },
  Proteins: {
    type: Number,
  },
  Fats: {
    type: Number,
  },
  Carbs: {
    type: Number,
  },
  Allergies: {
    type: [String],
    required: true,
  },
  Breakfast: {
    type: Number,
    required: true,
    default: 0,
  },
  Lunch: {
    type: Number,
    required: true,
    default: 0,
  },
  Dinner: {
    type: Number,
    required: true,
    default: 0,
  },
  LikesCount: {
    type: [
      {
        email: {
          type: String,
        },
        like: {
          type: Number,
        },
      },
    ],
  },
  ServingSize: {
    type: String,
  },
  Approved: {
    type: Number,
  },
  Image: {
    filename: {
      type: String,
    },
    contentType: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});

module.exports = mongoose.model("Recipes", recipesSchema);
