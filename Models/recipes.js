const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recipesSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required:true
  },
  recipeName:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  ingredients:{
    type:[String],
    required:true
  },
  calories:{
    type:Number,
    required:true
  },
  servingSize:{
    type:Number.
    required:true
  },
  recipeMethod:{
    type:String,
    required:true
  },
  likesCount:{
    type:Number,
    required:true,
    default:0
  }
});

module.exports = mongoose.model("Recipes", recipesSchema);
