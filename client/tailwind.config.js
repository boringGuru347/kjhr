/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        appBg: "#f4f6f8",
        ink: "#10233e",
        muted: "#5f6b7a",
        cardBorder: "#dbe3ea",
        accent: "#1f8c4a",
        accentSoft: "#e7f5ec"
      },
      boxShadow: {
        soft: "0 8px 28px rgba(16, 35, 62, 0.07)"
      },
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
