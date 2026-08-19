import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#f4f1ea",
        terracotta: "#cb6d51",
        moss: "#4a5d23",
        walnut: "#3e2723",
        softglow: "rgba(255, 255, 255, 0.15)",
      },
      fontFamily: {
        serif: ['var(--font-lora)', 'serif'],
        sans: ['var(--font-nunito)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

export default config;