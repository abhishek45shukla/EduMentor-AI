require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const quizRoutes = require("./routes/quizRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Connect to MongoDB ---
connectDB();

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "EduMentor AI server is running." });
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", quizRoutes); // exposes /api/generateQuiz and /api/submitQuiz
app.use("/api", progressRoutes); // exposes /api/progress and /api/recommendation

// --- 404 + error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`EduMentor AI server running on port ${PORT}`);
});
