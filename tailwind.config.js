/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "overlay-bg": "rgba(255, 255, 255, .6)",
        "very-dark-gray": "hsl(0, 0%, 17%)",
        "dark-gray": "hsl(0, 0%, 59%)",
      },
      backgroundImage: {
        "header": "url('/assets/images/pattern-bg.png')",
      },
      fontFamily: {
        "rubik": "'Rubik', sans-serif"
      },
      width: {
        "cols-4": "calc(100% / 4)",
      },
      height: {
        "map-desktop": "calc(100vh - 250px)",
        "map-mobile": "calc(100vh - 340px)"
      }
    },
  },
  plugins: [],
}

