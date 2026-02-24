/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,ts,tsx}", "./src/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0f0f0f",
          card: "#1a1a1a",
          border: "#2d2d2d",
        },
        cream: "#f5f0e8",
        gold: "#c9a962",
        "gold-dim": "#a68b4a",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
