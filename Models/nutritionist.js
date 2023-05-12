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
  startDay: {
    type: String,
    required: true,
  },
  endDay: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
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
        day: {
          type: String,
        },
        time: {
          type: String,
        },
      },
    ],
  },
  role: {
    type: String,
    required: true,
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

module.exports = mongoose.model("Nutritionist", nutritionistSchema);
