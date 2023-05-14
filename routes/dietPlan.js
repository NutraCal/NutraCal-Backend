var express = require("express");
var router = express.Router();

const dietPlanController = require("../Controller/dietPlanController");

router.post("/dietPlan", dietPlanController.dietPlan);
router.post("/getPlan", dietPlanController.getPlan);
module.exports = router;
