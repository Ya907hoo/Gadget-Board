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
        /* Comic ink — used for every outline and hard shadow */
        ink: {
          DEFAULT: "#17222E",
          soft: "#2C3A4B",
          faint: "#5A6B7D",
        },
        doraemon: {
          blue: {
            DEFAULT: "#0A84FF",
            light: "#E7F3FF",
            sky: "#7EC8E3",
            dark: "#0066CC",
            hover: "#0073E6",
            /* Authentic character cyan-blue */
            character: "#00A0E9",
            deep: "#0077B6",
          },
          red: {
            DEFAULT: "#FF4D4D",
            light: "#FFEAEB",
            hover: "#E83A3A",
            dark: "#CC2E2E",
            character: "#E4262C",
          },
          yellow: {
            DEFAULT: "#FFD447",
            light: "#FFF9E6",
            gold: "#F7B731",
            dark: "#E5BE27",
            bell: "#FFD100",
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
          pink: {
            door: "#F5A9C5",
            light: "#FFEEF5",
          },
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        full: "9999px",
      },
      borderWidth: {
        3: "3px",
        5: "5px",
      },
      boxShadow: {
        /* Legacy soft shadows, kept so existing markup keeps working */
        "doraemon-sm": "0 2px 8px -2px rgba(10, 132, 255, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)",
        "doraemon-card": "0 8px 24px -6px rgba(10, 132, 255, 0.10), 0 2px 8px -2px rgba(0, 0, 0, 0.04)",
        "doraemon-hover": "0 16px 36px -8px rgba(10, 132, 255, 0.18), 0 4px 12px -2px rgba(0, 0, 0, 0.06)",
        "doraemon-red": "0 8px 20px -4px rgba(255, 77, 77, 0.35)",
        "doraemon-gold": "0 8px 20px -4px rgba(255, 212, 71, 0.45)",

        /* Comic hard-offset shadows */
        "ink-xs": "2px 2px 0 0 #17222E",
        "ink-sm": "3px 3px 0 0 #17222E",
        ink: "4px 4px 0 0 #17222E",
        "ink-lg": "6px 6px 0 0 #17222E",
        "ink-xl": "8px 8px 0 0 #17222E",
        "ink-press": "1px 1px 0 0 #17222E",
        "ink-blue": "4px 4px 0 0 #0077B6",
        "ink-red": "4px 4px 0 0 #B81B21",
        "ink-gold": "4px 4px 0 0 #E0A800",
      },
      fontFamily: {
        display: ["Baloo 2", "Nunito", "system-ui", "sans-serif"],
        heading: ["Nunito", "system-ui", "-apple-system", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite linear",
        bob: "bob 4s ease-in-out infinite",
        wiggle: "wiggle 2.5s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "pop-in": "pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "drift-x": "drift-x 18s ease-in-out infinite",
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
        bob: {
          "0%, 100%": { transform: "translateY(0) rotate(-1.5deg)" },
          "50%": { transform: "translateY(-14px) rotate(1.5deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "drift-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(28px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
