var express = require("express");
var router = express.Router();

const dietPlanController = require("../Controller/dietPlanController");

router.post("/dietPlan", dietPlanController.dietPlan);
module.exports = router;
