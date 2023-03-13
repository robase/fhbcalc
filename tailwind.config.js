/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      animation: {
        border: "background ease infinite",
      },
      keyframes: {
        background: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        spartan: ["League+Spartan", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
