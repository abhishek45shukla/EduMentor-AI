import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tutor", label: "AI Tutor" },
  { to: "/quiz", label: "Quiz" },
  { to: "/progress", label: "Progress" },
  { to: "/profile", label: "Profile" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center gap-2 font-display font-bold text-lg text-edu-blue-deep">
          <span className="w-9 h-9 rounded-xl bg-edu-blue flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </span>
          EduMentor AI
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                location.pathname === link.to
                  ? "bg-edu-blue-soft text-edu-blue-deep"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-2 flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-500 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <button className="md:hidden text-ink" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium ${
                location.pathname === link.to ? "bg-edu-blue-soft text-edu-blue-deep" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-medium text-red-500"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
