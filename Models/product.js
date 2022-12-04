const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  productBarcode: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  servingSize: {
    type: Number,
    required: true,
  },
  energy: {
    type: Number,
  },
  fat: {
    type: Number,
  },
  saturatedFat: {
    type: Number,
  },
  carbohydrates: {
    type: Number,
  },
  sugar: {
    type: Number,
  },
  fiber: {
    type: Number,
  },
  protein: {
    type: Number,
  },
});

module.exports = mongoose.model("Product", productSchema);
