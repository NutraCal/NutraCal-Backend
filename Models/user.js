const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: "User",
  },
  fitnessGoal: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  heightUnit: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  weightUnit: {
    type: String,
    required: true,
  },
  allergies: {
    type: String,
    required: true,
  },
  diet: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  waterIntake: {
    type: [
      {
        waterIntake: {
          type: Number,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  calories: {
    type: [
      {
        caloriesIntake: {
          type: Number,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  stepCount: {
    type: [
      {
        count: {
          type: Number,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
