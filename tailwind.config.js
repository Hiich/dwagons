/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        shades: "src('../public/images/shade.png')"
      },
      fontFamily: {
        attack: ["attack", "sans-serif"],
        tiy: ["tiy", "sans-serif"]
      }
    },
  },
  plugins: [],
}