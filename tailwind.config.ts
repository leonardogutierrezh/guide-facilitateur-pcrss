import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#fbf7ef",
          100: "#f3e9d5",
          200: "#e7d2aa",
        },
        clay: {
          500: "#d97706",
          600: "#c2620b",
          700: "#9a4d0a",
        },
        leaf: {
          500: "#15803d",
          600: "#166534",
        },
        sky2: {
          500: "#0284c7",
          600: "#0369a1",
        },
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
