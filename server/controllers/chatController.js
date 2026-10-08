const User = require("../models/User");
const { chatWithTutor } = require("../utils/gemini");

// @route POST /api/chat
// body: { message: string, history?: [{role, content}], topic?: string }
const chat = async (req, res, next) => {
  try {
    const { message, history, topic } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const student = await User.findById(req.userId);
    if (!student) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Update the student's current topic so the AI's memory stays fresh.
    if (topic) {
      student.currentTopic = topic;
      await student.save();
    }

    const reply = await chatWithTutor(student, message, history || []);

    res.status(200).json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat };
