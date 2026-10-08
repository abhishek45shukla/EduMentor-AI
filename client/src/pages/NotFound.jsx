import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const NotFound = () => (
  <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-6">
    <span className="w-16 h-16 rounded-2xl bg-edu-blue-soft text-edu-blue flex items-center justify-center mb-6">
      <Compass className="w-8 h-8" />
    </span>
    <h1 className="text-6xl font-display font-extrabold text-edu-blue-deep mb-2">404</h1>
    <p className="text-edu-slate mb-6">This page hasn't been taught yet.</p>
    <Link to="/dashboard" className="btn-primary">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
