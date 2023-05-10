const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var shoppingListSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    // ref: "User",
    required: true,
  },
  list: [String],
});

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
