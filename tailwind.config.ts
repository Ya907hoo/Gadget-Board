import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        doraemon: {
          blue: {
            DEFAULT: "#0A84FF",
            light: "#E7F3FF",
            sky: "#7EC8E3",
            dark: "#0066CC",
            hover: "#0073E6",
          },
          red: {
            DEFAULT: "#FF4D4D",
            light: "#FFEAEB",
            hover: "#E83A3A",
            dark: "#CC2E2E",
          },
          yellow: {
            DEFAULT: "#FFD447",
            light: "#FFF9E6",
            gold: "#F7B731",
            dark: "#E5BE27",
          },
          cream: {
            DEFAULT: "#FFFDF7",
            soft: "#FDFBF7",
            card: "#FFFFFF",
            border: "#EFEBE1",
          },
          charcoal: {
            DEFAULT: "#2E2E2E",
            muted: "#6B7280",
            light: "#9CA3AF",
          },
        },
      },
      borderRadius: {
        "xl": "1rem",      // 16px
        "2xl": "1.25rem",  // 20px
        "3xl": "1.75rem",  // 28px
        "4xl": "2.25rem",  // 36px
        "full": "9999px",
      },
      boxShadow: {
        "doraemon-sm": "0 2px 8px -2px rgba(10, 132, 255, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)",
        "doraemon-card": "0 8px 24px -6px rgba(10, 132, 255, 0.10), 0 2px 8px -2px rgba(0, 0, 0, 0.04)",
        "doraemon-hover": "0 16px 36px -8px rgba(10, 132, 255, 0.18), 0 4px 12px -2px rgba(0, 0, 0, 0.06)",
        "doraemon-red": "0 8px 20px -4px rgba(255, 77, 77, 0.35)",
        "doraemon-gold": "0 8px 20px -4px rgba(255, 212, 71, 0.45)",
      },
      fontFamily: {
        heading: ["Nunito", "system-ui", "-apple-system", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
