var express = require("express");
var router = express.Router();
const msgController = require("../Controller/notificationController");

router.post("/registerNotification", msgController.registerNotification);
router.post("/sendNotification", msgController.sendNotification);
router.post("/getNotification", msgController.getNotification);
router.put("/updateNotification", msgController.updateNotification);

module.exports = router;
