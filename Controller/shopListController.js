let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const ShoppingList = require("../Models/shoppingList");
const User = require("../Models/user");

exports.getShopList = catchAsync(async (req, res, next) => {
  try {
    ShoppingList.find({ user: req.params.id }).exec(async function (
      error,
      results
    ) {
      if (error) {
        res.status(400).json(error);
      }
      res.status(200).json(results[0].list);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.addShopList = catchAsync(async (req, res, next) => {
  try {
    const { userId, list } = req.body;
    if (!userId || !list) {
      return res.status(400).send("Kindly provide userId and list");
    } else {
      const newShoppingList = new ShoppingList({
        user: userId,
        list: list,
      });
      try {
        const savedShoppingList = await newShoppingList.save();
        return res.status(200).send("Shopping list added successfully");
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.updateShopList = catchAsync(async (req, res, next) => {
  try {
    const { userId, list } = req.body;
    ShoppingList.findOneAndUpdate(
      { user: userId },
      { list: list },
      function (err, result) {
        if (err) {
          res.status(400).send("Can't update the shopping list, try again");
          return next(err);
        }
        res.status(200).json(result);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});
exports.deleteShopList = catchAsync(async (req, res, next) => {
  try {
    ShoppingList.deleteOne({ user: req.body.userId }, function (err, result) {
      if (err) {
        res.status(400).send("Can't clear the shopping list, try again");
      }
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
