const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
