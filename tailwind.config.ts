import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Abelec design-system colors (brief exact) ──────────────────────
      colors: {
        "abelec-navy":        "#1a3a5c",   // remplace #1B3A5C
        "abelec-navy-ink":    "#0f2340",
        "abelec-navy-soft":   "#2b4c72",
        "abelec-orange":      "#d97e3a",   // remplace #C2762B
        "abelec-orange-dark": "#b8612a",
        "abelec-orange-soft": "#f4dfc8",
        "abelec-cream-light": "#F8F5F0",
        "abelec-cream-deep":  "#F4EFE6",
        "abelec-cream-line":  "#E8DFD0",
        "abelec-cream-ink":   "#D8CBAE",
        "abelec-muted":       "#5a5a5a",
        "abelec-muted-2":     "#8a8a8a",
        "abelec-paper":       "#FBF8F3",
        // shadcn/ui tokens (garde la compatibilité CSS variables)
        background:           "var(--background)",
        foreground:           "var(--foreground)",
        border:               "var(--border)",
        ring:                 "var(--ring)",
        primary: {
          DEFAULT:            "var(--primary)",
          foreground:         "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:            "var(--secondary)",
          foreground:         "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT:            "var(--muted)",
          foreground:         "var(--muted-foreground)",
        },
      },

      // ── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        slab:  ["var(--font-slab)", "Georgia", "serif"],
        sans:  ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:  ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      // ── Shadows (single token) ──────────────────────────────────────────
      boxShadow: {
        "card-sm": "0 1px 2px rgba(26,58,92,.06)",
        "card-md": "0 1px 2px rgba(26,58,92,.06), 0 8px 24px rgba(26,58,92,.06)",
        "card-lg": "0 4px 12px rgba(26,58,92,.08), 0 20px 48px rgba(26,58,92,.10)",
      },

      // ── Border radius ───────────────────────────────────────────────────
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        pill: "9999px",
      },

      // ── Keyframes ───────────────────────────────────────────────────────
      keyframes: {
        ticker: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },
      animation: {
        ticker: "ticker 70s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
