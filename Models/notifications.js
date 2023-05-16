const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const notificationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  tokenID: {
    type: String,
    required: true,
  },
  notifications: {
    type: [Object],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
