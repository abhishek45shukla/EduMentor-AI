const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Progress = require("../models/Progress");
const { generateQuiz } = require("../utils/gemini");

// @route POST /api/generateQuiz
// body: { topic: string, difficulty?: string }
const createQuiz = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ success: false, message: "Topic is required." });
    }

    const student = await User.findById(req.userId);
    if (!student) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const effectiveDifficulty = difficulty || student.learningLevel || "Beginner";

    const questions = await generateQuiz(student, topic, effectiveDifficulty);

    const quiz = await Quiz.create({
      userId: student._id,
      topic,
      difficulty: effectiveDifficulty,
      questions,
    });

    // Don't leak the correct answers to the client before submission.
    const safeQuestions = quiz.questions.map((q) => ({
      question: q.question,
      options: q.options,
    }));

    res.status(201).json({
      success: true,
      quizId: quiz._id,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      questions: safeQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/submitQuiz
// body: { quizId: string, answers: string[] }
const submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "quizId and answers array are required.",
      });
    }

    const quiz = await Quiz.findOne({ _id: quizId, userId: req.userId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }

    if (quiz.submitted) {
      return res.status(400).json({ success: false, message: "This quiz was already submitted." });
    }

    let correctCount = 0;
    const results = quiz.questions.map((q, idx) => {
      const studentAnswer = answers[idx] ?? null;
      const isCorrect = studentAnswer === q.correctAnswer;
      if (isCorrect) correctCount += 1;
      return {
        question: q.question,
        options: q.options,
        studentAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    quiz.studentAnswers = answers;
    quiz.score = correctCount;
    quiz.submitted = true;
    await quiz.save();

    // Update the student's rolling stats.
    const student = await User.findById(req.userId);
    student.lastQuizScore = correctCount;

    const today = new Date();
    const lastDate = student.lastStudyDate ? new Date(student.lastStudyDate) : null;
    const isNewDay = !lastDate || lastDate.toDateString() !== today.toDateString();
    if (isNewDay) {
      const isConsecutive =
        lastDate && today - lastDate <= 1000 * 60 * 60 * 24 * 2; // within ~2 days counts as continued streak
      student.studyStreak = isConsecutive ? student.studyStreak + 1 : 1;
      student.lastStudyDate = today;
    }
    await student.save();

    // Log this attempt in the progress tracker.
    await Progress.create({
      userId: req.userId,
      topic: quiz.topic,
      subject: student.subject,
      quizScore: correctCount,
      totalQuestions: quiz.questions.length,
      completed: true,
      date: new Date(),
    });

    let feedback;
    if (correctCount === quiz.questions.length) {
      feedback = "Perfect score! You've fully mastered this topic — ready to move on.";
    } else if (correctCount >= Math.ceil(quiz.questions.length * 0.6)) {
      feedback = "Great work! A quick revision of the questions you missed will lock this in.";
    } else {
      feedback = "Good effort. Revisit this topic's fundamentals before moving ahead.";
    }

    res.status(200).json({
      success: true,
      score: correctCount,
      total: quiz.questions.length,
      results,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createQuiz, submitQuiz };
