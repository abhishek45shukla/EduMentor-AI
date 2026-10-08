import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCircle2, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateProfile as updateProfileApi } from "../services/api";
import ToastContainer from "../components/Toast";
import { useToast } from "../hooks/useToast";

const levels = ["Beginner", "Intermediate", "Advanced"];

const Profile = () => {
  const { user, updateUserInSession } = useAuth();
  const { toasts, showToast, dismissToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    class: user?.class || "",
    subject: user?.subject || "",
    learningGoal: user?.learningGoal || "",
    learningLevel: user?.learningLevel || "Beginner",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfileApi(form);
      updateUserInSession(res.data.user);
      showToast("Profile updated!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Couldn't update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
      <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2 mb-1">
        <UserCircle2 className="w-6 h-6 text-edu-blue" /> Your Profile
      </h1>
      <p className="text-sm text-edu-slate mb-8">Keep this up to date so your AI tutor stays accurate.</p>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="solid-card p-6 space-y-5"
      >
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="input-field" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Grade / Class</label>
            <input name="class" value={form.class} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Subject</label>
            <input name="subject" value={form.subject} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Learning Goal</label>
          <textarea
            name="learningGoal"
            value={form.learningGoal}
            onChange={handleChange}
            rows={3}
            placeholder="e.g. Master data structures before my semester exam"
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Learning Level</label>
          <div className="flex gap-2">
            {levels.map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setForm({ ...form, learningLevel: lvl })}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition ${
                  form.learningLevel === lvl
                    ? "bg-edu-blue text-white border-edu-blue"
                    : "border-slate-200 text-edu-slate hover:border-edu-blue/40"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? "Saving..." : (<><Save className="w-4 h-4" /> Save Changes</>)}
        </button>
      </motion.form>
    </div>
  );
};

export default Profile;
