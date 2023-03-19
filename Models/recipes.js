const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recipesSchema = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "User",
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
    required: true,
  },
  Proteins: {
    type: Number,
    required: true,
  },
  Fats: {
    type: Number,
    required: true,
  },
  Carbs: {
    type: Number,
    required: true,
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
  Likes: {
    type: Number,
    required: true,
    default: 0,
  },
  ServingSize: {
    type: String,
    required: true,
  },
  Approved: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Recipes", recipesSchema);
