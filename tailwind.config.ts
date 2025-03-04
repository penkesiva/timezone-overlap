import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        location1: {
          DEFAULT: '#4A90E2',
          bright: '#60A5FA'
        },
        location2: {
          DEFAULT: '#8B5CF6',
          bright: '#A78BFA'
        },
        night: "#1a1a1a",
        dawn: "#ff7b54",
      },
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};

export default config;
