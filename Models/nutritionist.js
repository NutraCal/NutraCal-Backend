const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var nutritionistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  qualification: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  rating: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      rate: {
        type: Number,
      },
    },
  ],
  ratingAverage: {
    type: String,
  },
  followers: {
    type: [
      {
        user: {
          type: String,
        },
      },
    ],
  },
  appointments: {
    type: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: String,
        },
        time: {
          type: String,
        },
      },
    ],
  },
});

module.exports = mongoose.model("Nutritionist", nutritionistSchema);
