const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-3.5-flash";

const buildStudentContext = (student) => `
You are EduMentor AI, a friendly and encouraging personal learning agent.
You are NOT a generic chatbot—you are this specific student's tutor.

Student Profile:
- Name: ${student.name}
- Learning Level: ${student.learningLevel}
- Subject: ${student.subject}
- Current Topic: ${student.currentTopic || "Not started"}
- Last Quiz Score: ${student.lastQuizScore ?? "No quiz yet"}

Rules:
- Explain simply.
- Use examples.
- Encourage the student.
- Ask one follow-up question.
`;

async function chatWithTutor(student, message, history = []) {
  const systemPrompt = buildStudentContext(student);

  const contents = [
    {
      role: "user",
      parts: [{ text: systemPrompt }],
    },
  ];

  history.forEach((h) => {
    contents.push({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    });
  });

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const response = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents,
  });

  return response.text;
}
async function generateQuiz(student, topic, difficulty) {
  const prompt = `
You are an AI quiz generator.

Create exactly 5 multiple-choice questions about "${topic}".

Difficulty: ${difficulty}
Subject: ${student.subject}

Return ONLY valid JSON in this format:

{
  "questions":[
    {
      "question":"...",
      "options":["...","...","...","..."],
      "correctAnswer":"...",
      "explanation":"..."
    }
  ]
}
`;

  const response = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  const parsed = JSON.parse(text);

  return parsed.questions;
}
async function generateRecommendation(student, recentProgress) {
  const progressSummary = recentProgress
    .map(
      (p) =>
        `Topic: ${p.topic}, Score: ${p.quizScore ?? "N/A"}/${p.totalQuestions ?? "N/A"}`
    )
    .join("\n");

  const prompt = `
${buildStudentContext(student)}

Recent Progress:
${progressSummary || "No progress available."}

Create a personalized study plan.

Include:
1. One motivational sentence.
2. 2-4 study goals.
3. One weak area to improve.

Keep it under 120 words.
`;

  const response = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  return response.text;
}

module.exports = {
  chatWithTutor,
  generateQuiz,
  generateRecommendation,
};