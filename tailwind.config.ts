import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./emails/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--p))",
        accent: "hsl(var(--a))",
        ink: "hsl(var(--ink))",
        soft: "hsl(var(--soft))",
        paper: "hsl(var(--paper))"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,.06)"
      }
    }
  },
  plugins: []
} satisfies Config;