import { useState, useEffect } from "react";

// Persists dark mode preference and toggles the `dark` class on <html>.
// Note: this MVP ships with light-mode-first styling; the hook and toggle
// are wired up so dark: variants can be layered in incrementally.
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("edumentor_theme");
    return saved === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("edumentor_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("edumentor_theme", "light");
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return [isDark, toggle];
};
