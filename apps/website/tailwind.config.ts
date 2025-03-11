import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // backgroundPrimary: "var(--color-background-primary)",
        // backgroundSecondary: "var(--color-background-secondary)",
        // primary: "var(--color-primary)",
        // secondary: "var(--color-secondary)",
        // textPrimary: "var(--color-text-primary)",
        // textSecondary: "var(--color-text-secondary)",
        // border: "var(--color-border)",
        // accent1: "var(--color-accent-1)",
        // accent2: "var(--color-accent-2)",
        background: {
          primary: "var(--color-background)",
          secondary: "var(--color-background-secondary)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
        },
        button: {
          primary: "var(--color-button-primary)",
          secondary: "var(--color-button-secondary)",
        },
        accent: "var(--color-accent)",
        highlight: "var(--color-highlight)",
        border: "var(--color-border)",
        link: "var(--color-link)",        
      },
      fontFamily: {
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
