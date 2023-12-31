const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
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
  bmi: {
    type: Number,
  },

  waterIntake: {
    type: [
      {
        water: {
          type: Number,
        },
        date: {
          type: String,
        },
      },
    ],
  },
  calories: {
    type: [
      {
        caloriesIntake: {
          type: Number,
        },
        proteinsIntake: {
          type: Number,
          default: 0,
        },
        fatsIntake: {
          type: Number,
          default: 0,
        },
        carbsIntake: {
          type: Number,
          default: 0,
        },
        date: {
          type: String,
        },
      },
    ],
  },
  stepCount: {
    type: [
      {
        count: {
          type: Number,
        },
        date: {
          type: String,
        },
      },
    ],
  },
  appointments: {
    type: [
      {
        nutritionist: {
          type: mongoose.Types.ObjectId,
          ref: "Nutritionist",
        },
        date: {
          type: String,
          required: true,
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
  following: {
    type: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "Nutritionist",
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

module.exports = mongoose.model("User", userSchema);
