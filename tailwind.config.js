/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        background: "#0A0A0A",
        surface: "#1A1A1A",
        "text-primary": "#FFFFFF",
        "text-secondary": "#B3B3B3",
        "text-tertiary": "#666666",
      },
    },
  },
  plugins: [],
};