var express = require("express");
var router = express.Router();
const shopListController = require("../Controller/shopListController");

router.get("/viewList/:id", shopListController.getShopList);
router.post("/addList", shopListController.addShopList);
router.put("/updateList", shopListController.updateShopList);
router.put("/removeItem", shopListController.removeFromShopList);
router.delete("/deleteList", shopListController.deleteShopList);

module.exports = router;
