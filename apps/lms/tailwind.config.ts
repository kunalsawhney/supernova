import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        'background-secondary': 'var(--color-background-secondary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'button-primary': 'var(--color-button-primary)',
        'button-secondary': 'var(--color-button-secondary)',
        accent: 'var(--color-accent)',
        highlight: 'var(--color-highlight)',
        border: 'var(--color-border)',
        link: 'var(--color-link)',
      },
    },
  },
  plugins: [],
};

export default config;
