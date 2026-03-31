import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Thème Jungle Moonkey — fonds verts riches
        jungle: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
          // Tons profonds pour fonds stylés
          deep: "#0a1f12",
          forest: "#0d2818",
          sage: "#1a3326",
          leaf: "#234d36",
          cream: "#faf8f5",
          ivory: "#f5f1eb",
        },
        anthracite: {
          50: "#f6f6f7",
          100: "#e2e3e5",
          200: "#c4c6ca",
          300: "#9fa2a9",
          400: "#7a7e87",
          500: "#5f636d",
          600: "#4c4f58",
          700: "#3f4149",
          800: "#36383e",
          900: "#2f3035",
          950: "#1a1b1e",
        },
        gold: {
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
        },
        copper: {
          400: "#b45309",
          500: "#ea580c",
          600: "#c2410c",
          700: "#9a3412",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
