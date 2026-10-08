import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";
import { generateQuiz, submitQuiz } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import ToastContainer from "../components/Toast";
import { useToast } from "../hooks/useToast";

const difficulties = ["Beginner", "Intermediate", "Advanced"];

const Quiz = () => {
  const { user } = useAuth();
  const { toasts, showToast, dismissToast } = useToast();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(user?.learningLevel || "Beginner");
  const [quiz, setQuiz] = useState(null); // { quizId, topic, difficulty, questions }
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      showToast("Please enter a topic first.", "error");
      return;
    }
    setGenerating(true);
    setResult(null);
    try {
      const res = await generateQuiz({ topic, difficulty });
      setQuiz(res.data);
      setAnswers(new Array(res.data.questions.length).fill(null));
    } catch (err) {
      showToast(err.response?.data?.message || "Couldn't generate the quiz. Try again.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelect = (qIdx, option) => {
    const updated = [...answers];
    updated[qIdx] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a === null)) {
      showToast("Please answer every question before submitting.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitQuiz({ quizId: quiz.quizId, answers });
      setResult(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Couldn't submit the quiz.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setAnswers([]);
    setResult(null);
    setTopic("");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
      <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2 mb-1">
        <ClipboardList className="w-6 h-6 text-edu-blue" /> Quiz Generator
      </h1>
      <p className="text-sm text-edu-slate mb-8">Test what you've learned with an AI-generated quiz.</p>

      <AnimatePresence mode="wait">
        {!quiz && (
          <motion.form
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleGenerate}
            className="solid-card p-6 space-y-5"
          >
            <div>
              <label className="text-sm font-medium text-ink mb-1.5 block">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Binary Search, Photosynthesis, Fractions"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink mb-1.5 block">Difficulty</label>
              <div className="flex gap-2">
                {difficulties.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition ${
                      difficulty === d
                        ? "bg-edu-blue text-white border-edu-blue"
                        : "border-slate-200 text-edu-slate hover:border-edu-blue/40"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={generating} className="btn-primary w-full">
              {generating ? "Generating quiz..." : (<><Sparkles className="w-4 h-4" /> Generate Quiz</>)}
            </button>
          </motion.form>
        )}

        {quiz && !result && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-ink">
                {quiz.topic} <span className="text-edu-slate font-normal text-sm">({quiz.difficulty})</span>
              </h2>
              <span className="text-xs text-edu-slate">{answers.filter((a) => a !== null).length}/{quiz.questions.length} answered</span>
            </div>

            {quiz.questions.map((q, qIdx) => (
              <div key={qIdx} className="solid-card p-5">
                <p className="font-medium text-ink mb-3">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSelect(qIdx, opt)}
                      className={`text-left text-sm rounded-xl px-4 py-3 border transition ${
                        answers[qIdx] === opt
                          ? "bg-edu-blue-soft border-edu-blue text-edu-blue-deep font-medium"
                          : "border-slate-200 hover:border-edu-blue/40"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={handleSubmit} disabled={submitting} className="btn-accent w-full">
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </motion.div>
        )}

        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-edu-slate mb-1">Your Score</p>
              <p className="text-4xl font-display font-extrabold text-edu-blue-deep">
                {result.score}/{result.total}
              </p>
              <p className="text-sm text-ink mt-3">{result.feedback}</p>
            </div>

            {result.results.map((r, i) => (
              <div key={i} className="solid-card p-5">
                <div className="flex items-start gap-2 mb-2">
                  {r.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-edu-green shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium text-ink text-sm">{r.question}</p>
                </div>
                <p className="text-xs text-edu-slate ml-7">
                  Your answer: <span className="font-medium text-ink">{r.studentAnswer}</span>
                  {!r.isCorrect && (
                    <>
                      {" "}— Correct: <span className="font-medium text-edu-green">{r.correctAnswer}</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-edu-slate ml-7 mt-1">{r.explanation}</p>
              </div>
            ))}

            <button onClick={handleReset} className="btn-secondary w-full">
              <RotateCcw className="w-4 h-4" /> Try Another Topic
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
