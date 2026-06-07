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
          50: "#fdf3ec",
          100: "#fbe3d3",
          400: "#dd7a45",
          500: "#c85d2a",
          600: "#b14a1f",
          700: "#8a3713",
          800: "#6e2c0f",
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
