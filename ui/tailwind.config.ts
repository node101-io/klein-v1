import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
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
      animation: {
        pop: "pop 0.5s ease-out",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.5)", opacity: "0.5" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
