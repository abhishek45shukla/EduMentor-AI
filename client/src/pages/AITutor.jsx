import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Search, Sparkles } from "lucide-react";
import { sendChatMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ToastContainer from "../components/Toast";
import { useToast } from "../hooks/useToast";

const suggestedTopics = ["Binary Search", "Photosynthesis", "Newton's Laws", "Fractions", "Time Complexity"];

const AITutor = () => {
  const { user } = useAuth();
  const { toasts, showToast, dismissToast } = useToast();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.name?.split(" ")[0] || "there"}! I'm your AI tutor. Tell me a topic you'd like to learn, or ask me anything you're stuck on.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const messageText = text ?? input;
    if (!messageText.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: messageText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: messageText,
        history: newMessages.slice(-10),
        topic: topic || undefined,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      showToast(err.response?.data?.message || "The AI tutor is unavailable right now.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (t) => {
    setTopic(t);
    handleSend(`I don't understand ${t}. Can you explain it to me?`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-[calc(100vh-4rem)]">
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2">
            <Bot className="w-6 h-6 text-edu-blue" /> AI Tutor
          </h1>
          <p className="text-sm text-edu-slate">
            {topic ? `Currently exploring: ${topic}` : "Ask about any topic to get started."}
          </p>
        </div>
      </div>

      {/* Suggested topics */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestedTopics.map((t) => (
          <button
            key={t}
            onClick={() => handleTopicClick(t)}
            className="flex items-center gap-1.5 text-xs font-medium bg-edu-blue-soft text-edu-blue-deep px-3 py-1.5 rounded-full hover:bg-edu-blue hover:text-white transition"
          >
            <Sparkles className="w-3 h-3" /> {t}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll glass-card p-5 space-y-4 mb-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <span className="w-8 h-8 rounded-full bg-edu-blue flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </span>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${
                msg.role === "user"
                  ? "bg-edu-blue text-white rounded-br-sm"
                  : "bg-white border border-slate-100 text-ink rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <span className="w-8 h-8 rounded-full bg-edu-blue-deep flex items-center justify-center text-white shrink-0">
                <User className="w-4 h-4" />
              </span>
            )}
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <span className="w-8 h-8 rounded-full bg-edu-blue flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </span>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-edu-blue/50 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or name a topic..."
            className="input-field pl-11"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary !px-5 !py-3.5">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AITutor;
