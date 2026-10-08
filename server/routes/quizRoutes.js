const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { createQuiz, submitQuiz } = require("../controllers/quizController");

router.post("/generateQuiz", protect, createQuiz);
router.post("/submitQuiz", protect, submitQuiz);

module.exports = router;
