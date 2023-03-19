const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var nutritionistSchema = new Schema({
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
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
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
