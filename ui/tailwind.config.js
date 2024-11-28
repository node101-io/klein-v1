/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: "#F4F6F8",
        bg_dark_gray: "#1F1F1F",
        hover_gray: "#DBDBDB",
        text_gray: "#757575",
        text_purple: "#847DFF",
        blue_klein: "#4A5EE5",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
