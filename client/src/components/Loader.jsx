import React from "react";

const Loader = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="w-10 h-10 rounded-full border-4 border-edu-blue-soft border-t-edu-blue animate-spin" />
    <p className="text-sm text-edu-slate font-medium">{label}</p>
  </div>
);

export default Loader;
