import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ListChecks, Percent } from "lucide-react";
import { fetchProgress } from "../services/api";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";

const Progress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProgress();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader label="Loading your progress..." />;

  const history = data?.history || [];
  const maxScorePct = 100;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2 mb-1">
        <TrendingUp className="w-6 h-6 text-edu-blue" /> Your Progress
      </h1>
      <p className="text-sm text-edu-slate mb-8">Every topic and quiz you've completed, in one place.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <StatCard icon={ListChecks} label="Completed Topics" value={data.completedTopics} delay={0} />
        <StatCard icon={Percent} label="Average Score" value={`${data.averageScore}%`} accent="green" delay={0.05} />
      </div>

      {/* Learning graph (simple bar visualization, no external chart lib needed) */}
      <div className="solid-card p-6 mb-8">
        <h2 className="font-display font-semibold text-ink mb-5">Learning Graph</h2>
        {history.length === 0 ? (
          <p className="text-sm text-edu-slate text-center py-8">
            Complete a quiz to see your score history here.
          </p>
        ) : (
          <div className="flex items-end gap-3 h-40">
            {history
              .slice(0, 12)
              .reverse()
              .map((entry, i) => {
                const pct = entry.totalQuestions
                  ? Math.round((entry.quizScore / entry.totalQuestions) * maxScorePct)
                  : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(pct, 4)}%` }}
                      transition={{ delay: i * 0.05 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-edu-blue to-edu-green"
                      style={{ maxHeight: "9rem" }}
                      title={`${entry.topic}: ${pct}%`}
                    />
                    <span className="text-[10px] text-edu-slate">{pct}%</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Recent activity table */}
      <div className="solid-card overflow-hidden">
        <h2 className="font-display font-semibold text-ink px-6 pt-6 mb-4">Recent Activity</h2>
        {history.length === 0 ? (
          <p className="text-sm text-edu-slate text-center py-8">No activity yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-edu-slate border-t border-slate-100">
                <th className="px-6 py-3 font-medium">Topic</th>
                <th className="px-6 py-3 font-medium">Subject</th>
                <th className="px-6 py-3 font-medium">Score</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry._id} className="border-t border-slate-100">
                  <td className="px-6 py-3 font-medium text-ink">{entry.topic}</td>
                  <td className="px-6 py-3 text-edu-slate">{entry.subject}</td>
                  <td className="px-6 py-3 font-mono text-edu-blue">
                    {entry.quizScore !== null ? `${entry.quizScore}/${entry.totalQuestions}` : "—"}
                  </td>
                  <td className="px-6 py-3 text-edu-slate">{new Date(entry.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Progress;
