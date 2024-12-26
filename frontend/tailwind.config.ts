/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        "max-sm": { max: "640px" },
        "max-md": { max: "902px" },
        "max-lg": { max: "1024px" },
        "max-xl": { max: "1280px" },
      },
      colors: {
        primary: "#cbfe33",
        success: "#22bb33",
        failed: "#bb2124",
      },
    },
  },
  plugins: [],
};

export default config;
