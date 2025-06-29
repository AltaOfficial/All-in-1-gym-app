/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/index.tsx", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
