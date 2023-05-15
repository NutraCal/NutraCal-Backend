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

exports.updateShopList = catchAsync(async (req, res, next) => {
  try {
    console.log(req.body.userId);
    let shoppingList = await ShoppingList.findOne({ user: req.body.userId });
    const items = req.body.list;
    if (!shoppingList) {
      shoppingList = new ShoppingList({ user: req.body.userId, list: [] });
      await shoppingList.save();
      console.log("list created successfully");
      // return res.status(404).send({ message: "Shopping list not found" });
    }
    if (shoppingList.list.length === 0) {
      console.log("list empty");
      shoppingList.list.push(...items);
    } else {
      for (const item of items) {
        if (shoppingList.list.indexOf(item) !== -1) {
          // shoppingList.list = shoppingList.list.filter((i) => i !== item);
          return res.status(200).send({ message: "Item already exists" });
        } else {
          shoppingList.list.push(item);
        }
      }
    }

    await shoppingList.save();

    return res
      .status(200)
      .json({ message: "Shopping list updated", shoppingList });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

exports.removeFromShopList = catchAsync(async (req, res, next) => {
  try {
    console.log(req.body.userId);
    let shoppingList = await ShoppingList.findOne({ user: req.body.userId });
    const items = req.body.list;
    if (!shoppingList) {
      shoppingList = new ShoppingList({ user: req.body.userId, list: [] });
      await shoppingList.save();
      console.log("list created successfully");
      // return res.status(404).send({ message: "Shopping list not found" });
    }
    if (shoppingList.list.length === 0) {
      console.log("list empty");
      shoppingList.list.push(...items);
    } else {
      for (const item of items) {
        const index = shoppingList.list.findIndex(
          (i) => i.toLowerCase() === item.toLowerCase()
        );
        if (index !== -1) {
          shoppingList.list.splice(index, 1);
        } else {
          return res
            .status(200)
            .json({ message: "Nothing to Update", shoppingList });
        }
      }
    }
    await shoppingList.save();

    return res
      .status(200)
      .json({ message: "Shopping list updated", shoppingList });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});
