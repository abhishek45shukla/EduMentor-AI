const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { getProgress, getRecommendation } = require("../controllers/progressController");

router.get("/progress", protect, getProgress);
router.get("/recommendation", protect, getRecommendation);

module.exports = router;
