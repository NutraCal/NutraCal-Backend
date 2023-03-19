var express = require("express");
var router = express.Router();
const shopListController = require("../Controller/shopListController");

router.get("/viewList", shopListController.getShopList);
router.post("/addList", shopListController.addShopList);
router.put("/updateList", shopListController.updateShopList);
router.delete("/deleteList", shopListController.deleteShopList);

module.exports = router;
