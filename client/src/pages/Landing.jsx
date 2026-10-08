import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  BarChart3,
  Target,
  MessageCircleQuestion,
  ArrowRight,
  BookOpenCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Tutor, Not a Chatbot",
    desc: "Explains concepts at your level, gives real examples, and checks your understanding as you go.",
  },
  {
    icon: Target,
    title: "Personalized Study Plans",
    desc: "Your daily goal is built from your weak topics and recent quiz scores — never generic.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Instant Quizzes",
    desc: "Every topic ends in a 5-question quiz, scored and explained the moment you submit.",
  },
  {
    icon: BarChart3,
    title: "Visible Progress",
    desc: "Track completed topics, streaks, and average scores on one clear dashboard.",
  },
];

const steps = [
  { step: "01", title: "Tell us where you're starting", desc: "Set your grade, subject, and goal." },
  { step: "02", title: "Learn with your AI tutor", desc: "Ask anything — get a level-matched explanation." },
  { step: "03", title: "Prove it with a quiz", desc: "5 questions, instant scoring, clear explanations." },
  { step: "04", title: "Get your next step", desc: "EduMentor recommends what to study next." },
];

const Landing = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid-fade [background-size:22px_22px]">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-edu-green-soft text-edu-green px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Aligned with UN SDG 4 — Quality Education
            </span>
            <h1 className="text-5xl sm:text-6xl font-display font-extrabold text-edu-blue-deep leading-[1.05] mb-6">
              EduMentor AI
            </h1>
            <p className="text-lg text-edu-slate max-w-lg mb-8">
              A personalized AI learning agent that teaches at your level, quizzes what you learn,
              and tells you exactly what to study next — every single day.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-secondary">
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4 text-edu-blue-deep font-display font-semibold">
              <BookOpenCheck className="w-5 h-5" /> Today's Goal
            </div>
            <div className="space-y-3">
              {["Arrays — quick revision", "Binary Search — new topic", "Practice 5 MCQs"].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-edu-green" />
                  <span className="text-sm text-ink">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-edu-slate">Learning Level</span>
              <span className="font-semibold text-edu-blue">Intermediate</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-display font-bold text-ink text-center mb-2">
          Built to teach, not just answer
        </h2>
        <p className="text-edu-slate text-center max-w-xl mx-auto mb-12">
          Every feature exists to move you from "I don't understand" to "I've got this."
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="solid-card p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-edu-blue-soft text-edu-blue flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-ink mb-2">{title}</h3>
              <p className="text-sm text-edu-slate leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-edu-blue-deep py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-display font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <span className="text-5xl font-display font-extrabold text-white/15">{step}</span>
                <h3 className="text-white font-display font-semibold mt-2 mb-1">{title}</h3>
                <p className="text-white/70 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG 4 Impact */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <span className="inline-block text-edu-green font-display font-semibold text-sm uppercase tracking-wide mb-3">
          SDG 4 Impact
        </span>
        <h2 className="text-3xl font-display font-bold text-ink mb-4">
          Quality education, personalized for every student
        </h2>
        <p className="text-edu-slate max-w-2xl mx-auto">
          EduMentor AI exists to close the gap between one-size-fits-all classrooms and each
          student's actual pace of learning — giving every learner a tutor that adapts to them,
          not the other way around.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-edu-slate">© 2026 EduMentor AI. Built for learners everywhere.</p>
          <div className="flex gap-6 text-sm text-edu-slate">
            <Link to="/login" className="hover:text-edu-blue">Login</Link>
            <Link to="/register" className="hover:text-edu-blue">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
