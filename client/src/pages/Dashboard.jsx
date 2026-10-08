import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookMarked,
  BarChart2,
  Award,
  ListChecks,
  Flame,
  MessageCircle,
  Sparkles,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchProgress, fetchRecommendation } from "../services/api";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";

const quickActions = [
  { to: "/tutor", icon: MessageCircle, label: "Learn New Topic", accent: "bg-edu-blue" },
  { to: "/tutor", icon: Sparkles, label: "Ask AI", accent: "bg-edu-blue-deep" },
  { to: "/quiz", icon: ClipboardList, label: "Generate Quiz", accent: "bg-edu-green" },
  { to: "/progress", icon: TrendingUp, label: "View Progress", accent: "bg-edu-slate" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProgress();
        setProgress(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadRecommendation = async () => {
      try {
        const res = await fetchRecommendation();
        setRecommendation(res.data.recommendation);
      } catch (err) {
        setRecommendation("Start a topic with your AI Tutor to get a personalized plan here.");
      } finally {
        setRecLoading(false);
      }
    };
    loadRecommendation();
  }, []);

  if (loading) return <Loader label="Loading your dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-ink">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-edu-slate mt-1">Here's where your learning stands today.</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        <StatCard icon={BookMarked} label="Current Subject" value={user?.subject || "General"} delay={0} />
        <StatCard icon={Award} label="Learning Level" value={user?.learningLevel || "Beginner"} delay={0.05} />
        <StatCard icon={BarChart2} label="Last Quiz Score" value={`${user?.lastQuizScore ?? 0}/5`} delay={0.1} />
        <StatCard
          icon={ListChecks}
          label="Completed Topics"
          value={progress?.completedTopics ?? 0}
          accent="green"
          delay={0.15}
        />
        <StatCard
          icon={Flame}
          label="Study Streak"
          value={`${user?.studyStreak ?? 0} days`}
          accent="green"
          delay={0.2}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* Quick actions */}
        <div className="lg:col-span-2">
          <h2 className="font-display font-semibold text-ink mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map(({ to, icon: Icon, label, accent }) => (
              <Link key={label} to={to} className="solid-card p-5 flex items-center gap-4 hover:shadow-glass transition">
                <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${accent}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="font-display font-semibold text-ink">{label}</span>
              </Link>
            ))}
          </div>

          {/* Recent activity */}
          <h2 className="font-display font-semibold text-ink mt-8 mb-4">Recent Activity</h2>
          <div className="solid-card divide-y divide-slate-100">
            {progress?.recentActivity?.length ? (
              progress.recentActivity.map((entry) => (
                <div key={entry._id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-medium text-ink text-sm">{entry.topic}</p>
                    <p className="text-xs text-edu-slate">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  {entry.quizScore !== null && (
                    <span className="text-sm font-mono font-semibold text-edu-blue">
                      {entry.quizScore}/{entry.totalQuestions}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-edu-slate">
                No activity yet — start your first topic with the AI Tutor.
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendation */}
        <div>
          <h2 className="font-display font-semibold text-ink mb-4">Today's Study Plan</h2>
          <div className="glass-card p-6">
            {recLoading ? (
              <Loader label="Building your plan..." />
            ) : (
              <p className="text-sm text-ink whitespace-pre-line leading-relaxed">{recommendation}</p>
            )}
            <Link to="/tutor" className="btn-primary w-full mt-5">
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
