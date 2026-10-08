import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ToastContainer from "../components/Toast";
import { useToast } from "../hooks/useToast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, dismissToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast("Welcome back!", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed. Please try again.", "error");
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
          <h1 className="text-2xl font-display font-bold text-ink">Welcome back</h1>
          <p className="text-sm text-edu-slate mt-1">Log in to continue your learning streak.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input-field pl-11"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Logging in..." : (<><LogIn className="w-4 h-4" /> Login</>)}
          </button>
        </form>

        <p className="text-sm text-edu-slate text-center mt-6">
          New here?{" "}
          <Link to="/register" className="text-edu-blue font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
