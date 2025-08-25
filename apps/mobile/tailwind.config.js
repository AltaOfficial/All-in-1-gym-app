/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F43A45",
        gray1: "#141414",
        gray2: "#27272A",
        gray3: "#828282",
        protein: "#00FF4D",
        carbs: "#FF861C",
        fat: "#EEF43A",
        link: "#3F7BFF",
        fire: "#FF8000",
        consumed: "#4CC3FF",
      },
    },
  },
  plugins: [],
};
