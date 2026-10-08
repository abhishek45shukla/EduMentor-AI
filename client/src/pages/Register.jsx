import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, School, BookMarked, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ToastContainer from "../components/Toast";
import { useToast } from "../hooks/useToast";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, dismissToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    class: "",
    subject: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      showToast("Account created! Let's get learning.", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-grid-fade [background-size:22px_22px] px-6 py-12">
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <span className="w-12 h-12 rounded-2xl bg-edu-blue flex items-center justify-center text-white mb-3">
            <GraduationCap className="w-6 h-6" />
          </span>
          <h1 className="text-2xl font-display font-bold text-ink">Create your account</h1>
          <p className="text-sm text-edu-slate mt-1">Start your personalized learning journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="name"
              required
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password"
              required
              placeholder="Password (min. 6 characters)"
              value={form.password}
              onChange={handleChange}
              className="input-field pl-11"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="class"
                placeholder="Grade/Class"
                value={form.class}
                onChange={handleChange}
                className="input-field pl-11"
              />
            </div>
            <div className="relative">
              <BookMarked className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="subject"
                placeholder="Preferred subject"
                value={form.subject}
                onChange={handleChange}
                className="input-field pl-11"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Creating account..." : (<><UserPlus className="w-4 h-4" /> Register</>)}
          </button>
        </form>

        <p className="text-sm text-edu-slate text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-edu-blue font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
