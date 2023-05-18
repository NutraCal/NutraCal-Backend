let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const ShoppingList = require("../Models/shoppingList");
const User = require("../Models/user");

exports.getShopList = catchAsync(async (req, res, next) => {
  try {
    const shoppingList = await ShoppingList.findOne({ user: req.params.id });
    if (!shoppingList || shoppingList.list.length == 0) {
      return res
        .status(400)
        .send({ message: "No items found in shopping list" });
    }
    const list = shoppingList.list;
    return res.status(200).json({
      list,
    });
  } catch (err) {
    return res.status(500).send({ message: "Error: " + err.message });
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
    if (!req.body.userId || !req.body.list) {
      return res.status(400).send({ message: "Kindly fill all the fields" });
    }
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
