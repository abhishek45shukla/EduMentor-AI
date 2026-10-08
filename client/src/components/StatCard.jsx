import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, label, value, accent = "blue", delay = 0 }) => {
  const accentClasses =
    accent === "green"
      ? "bg-edu-green-soft text-edu-green"
      : "bg-edu-blue-soft text-edu-blue";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="glass-card p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentClasses}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-edu-slate font-medium">{label}</p>
        <p className="text-xl font-display font-bold text-ink">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
