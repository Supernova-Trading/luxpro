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
      fontFamily: {
        sans:  ["Inter", "var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["Cormorant Garamond", "var(--font-cormorant)", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // ── Primitive palette ─────────────────────────────────────────────────
        obsidian: {
          950: "#0D1117",
          900: "#151B23",
          800: "#1A2330",
          700: "#22303F",
          600: "#2C3D4F",
        },
        gold: {
          500: "#C8A84B",
          400: "#D9BB6A",
          300: "#E5C97D",
          200: "#F0DCA0",
        },
        // ── Semantic lux.* aliases (point at primitives) ───────────────────────
        lux: {
          bg:        "var(--lp-bg)",
          bg2:       "var(--lp-bg2)",
          bg3:       "var(--lp-bg3)",
          surface:   "var(--lp-surface)",
          card:      "#FFFFFF",
          text:      "#1A1A1A",
          mid:       "#3D3D3D",
          dim:       "#6B7280",
          warm:      "#F97316",
          cold:      "#0EA5E9",
          gold:      "var(--lp-gold)",
          "gold-soft": "var(--lp-gold-soft)",
          navy:      "#0A1F3F",
          navy2:     "#1565C0",
          blue2:     "#42A5F5",
        },
      },
      borderRadius: {
        "lux-sm": "10px",
        "lux-lg": "18px",
        "lux-xl": "22px",
        "lux-2xl": "28px",
      },
      boxShadow: {
        lux:       "0 4px 24px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.25)",
        "lux-lg":  "0 12px 48px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.35)",
        "lux-glass": "0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glow-gold":  "0 0 20px rgba(200,168,75,0.35), 0 0 40px rgba(200,168,75,0.15)",
        "glow-warm":  "0 0 20px rgba(249,115,22,0.40), 0 0 40px rgba(249,115,22,0.18)",
        "glow-cold":  "0 0 20px rgba(14,165,233,0.40), 0 0 40px rgba(14,165,233,0.18)",
      },
      letterSpacing: {
        widest2: "4px",
        widest3: "3px",
      },
      backgroundImage: {
        "spotlight-gold":
          "radial-gradient(ellipse at 30% 60%, rgba(200,168,75,0.10) 0%, transparent 65%), linear-gradient(135deg, #1A2330, #151B23)",
      },
    },
  },
  plugins: [],
};
export default config;
