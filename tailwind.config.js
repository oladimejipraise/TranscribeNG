/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest:  "#1a7a4a",
        accent:  "#4dba80",
        cream:   "#e8ede6",
        dark:    "#0a0f0d",
        surface: "rgba(255,255,255,0.03)",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      fontSize: {
        "2xs": "11px",
      },
      borderColor: {
        subtle: "rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
};