var express = require("express");
var router = express.Router();

const dietPlanController = require("../Controller/dietPlanController");

router.post("/dietPlan", dietPlanController.dietPlan);
router.post("/getPlan", dietPlanController.getPlan);
router.post("/getPlanOfDay", dietPlanController.getPlanOfDay);
router.put("/editPlan", dietPlanController.editPlan);
module.exports = router;
