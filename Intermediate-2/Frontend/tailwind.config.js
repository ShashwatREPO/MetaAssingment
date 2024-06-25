/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent" : ["#802bb1"],
        "offWhite" : ["#D1D7E0"],
        "primary" : ["#2D283E"],
        "secondary" : ["#564F6F"],
        "neutral" : ["#4C495D"]
      },
      fontFamily:{
        "Josefin" : ["Josefin Sans"],
      }
    },
  },
  plugins: [],
}

