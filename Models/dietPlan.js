const mongoose = require("mongoose");

const dietPlanSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  day1: {
    type: [String],
    required: true,
  },
  day2: {
    type: [String],
    required: true,
  },
  day3: {
    type: [String],
    required: true,
  },
  day4: {
    type: [String],
    required: true,
  },
  day5: {
    type: [String],
    required: true,
  },
  day6: {
    type: [String],
    required: true,
  },
  day7: {
    type: [String],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);

module.exports = DietPlan;
