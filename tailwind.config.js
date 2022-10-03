/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        bg: "src('/images/bg.jpg')"
      },
      fontFamily: {
        attack: ["attack", "sans-serif"],
        tiy: ["tiy", "sans-serif"],
        dragon: ["dragon", "sans-serif"]
      }
    },
  },
  plugins: [],
}