const User = require("../models/User");
const Progress = require("../models/Progress");
const { generateRecommendation } = require("../utils/gemini");

// @route GET /api/progress
const getProgress = async (req, res, next) => {
  try {
    const entries = await Progress.find({ userId: req.userId }).sort({ date: -1 });

    const completedTopics = new Set(entries.filter((e) => e.completed).map((e) => e.topic)).size;

    const scores = entries.filter((e) => e.quizScore !== null && e.totalQuestions);
    const averageScore =
      scores.length > 0
        ? Math.round(
            (scores.reduce((sum, e) => sum + e.quizScore / e.totalQuestions, 0) / scores.length) * 100
          )
        : 0;

    res.status(200).json({
      success: true,
      completedTopics,
      averageScore,
      recentActivity: entries.slice(0, 10),
      history: entries,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/recommendation
const getRecommendation = async (req, res, next) => {
  try {
    const student = await User.findById(req.userId);
    if (!student) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const recentProgress = await Progress.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(5);

    const recommendation = await generateRecommendation(student, recentProgress);

    res.status(200).json({ success: true, recommendation });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgress, getRecommendation };
