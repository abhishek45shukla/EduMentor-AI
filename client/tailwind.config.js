/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        paper: "#F7F9FC",
        edu: {
          blue: "#2151D6",
          "blue-deep": "#132B7A",
          "blue-soft": "#EAF0FF",
          green: "#0FA968",
          "green-soft": "#E4F8EF",
          slate: "#5B6478",
        },
      },
      fontFamily: {
        display: ["'Lexend'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(33, 81, 214, 0.10)",
        card: "0 2px 12px 0 rgba(11, 18, 32, 0.06)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 1px 1px, rgba(33,81,214,0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
