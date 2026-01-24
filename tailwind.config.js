/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Legacy dark theme (kept for compatibility)
        dark: {
          900: "#0f0f1a",
          800: "#1a1a2e",
          700: "#252540",
          600: "#3d3d5c",
        },
        // Legacy primary (kept for compatibility)
        primary: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dark: "#4f46e5",
        },
        accent: {
          purple: "#a855f7",
          blue: "#3b82f6",
          pink: "#ec4899",
        },

        // ========== NEW SOFT GOLD THEME ==========
        // Cream background scale
        cream: {
          50: "#FFFFFF", // Pure white - cards
          100: "#FCFAF7", // Subtle backgrounds
          200: "#F8F5F0", // Main background (bg-cream)
          300: "#F0EBE3", // Card shadows, hover
          400: "#E8E4DE", // Borders, dividers
          500: "#D1C9B8", // Disabled states
          600: "#A09890", // Secondary text alt
          700: "#8C857B", // Meta text (text-secondary)
          800: "#4A4035", // Primary text (text-primary)
          900: "#3D3428", // Headings, darkest
        },

        // Gold accent scale
        gold: {
          50: "#FFFBF0", // Lightest - subtle backgrounds
          100: "#FFF3DA", // Light pill backgrounds (gold-light)
          200: "#FFE7B8", // Hover states
          300: "#F5D794", // Light accent
          400: "#E6C785", // Default gold (gold-DEFAULT)
          500: "#D4A853", // Primary gold - icons, buttons
          600: "#C7A660", // Active/pressed (gold-dark)
          700: "#B08940", // Dark accents
          800: "#8A6A30", // Darker
          900: "#654D22", // Darkest gold
        },

        // Accessible text colors (WCAG 2.1 AA compliant)
        accessible: {
          // High contrast text on cream bg (ratio ≥ 4.5:1)
          text: "#3D3428", // AAA compliant
          "text-secondary": "#5C5447", // AA compliant (4.5:1+)
          // For gold buttons with white text
          "gold-dark": "#9A7B35", // Darker gold for white text (4.5:1)
          // Focus ring color
          focus: "#B08940", // Visible focus ring
        },
      },

      // Custom box shadows for Soft UI / Neumorphism
      boxShadow: {
        // Soft 3D shadow for buttons (light source from top-left)
        "soft-3d": "4px 4px 8px #d1c9b8, -4px -4px 8px #ffffff",
        "soft-3d-sm": "2px 2px 4px #d1c9b8, -2px -2px 4px #ffffff",
        "soft-3d-lg": "6px 6px 12px #d1c9b8, -6px -6px 12px #ffffff",

        // Inset shadow for pressed state
        "soft-3d-inset":
          "inset 2px 2px 4px #d1c9b8, inset -2px -2px 4px #ffffff",

        // Card shadow
        "soft-card": "0 4px 15px rgba(0, 0, 0, 0.05)",
        "soft-card-hover": "0 8px 25px rgba(0, 0, 0, 0.08)",

        // Mini player shadow
        "soft-player": "0 -4px 20px rgba(0, 0, 0, 0.08)",

        // Bottom nav shadow
        "soft-nav": "0 -2px 10px rgba(0, 0, 0, 0.05)",
      },

      animation: {
        "spin-slow": "spin 20s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        // Soft UI animations
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "fade-out": "fadeOut 0.2s ease-in forwards",
        "slide-up": "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-down": "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "scale-in": "scaleIn 0.2s ease-out forwards",
        "scale-out": "scaleOut 0.15s ease-in forwards",
        "bounce-soft": "bounceSoft 0.6s ease-out",
        "bounce-in": "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-gold": "pulseGold 2s infinite",
        ripple: "ripple 0.6s linear forwards",
        wiggle: "wiggle 0.3s ease-in-out",
        shake: "shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        // Playing bars animation
        "bar-1": "barBounce 1.2s ease-in-out infinite",
        "bar-2": "barBounce 1.2s ease-in-out 0.2s infinite",
        "bar-3": "barBounce 1.2s ease-in-out 0.4s infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
        bounceSoft: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
          "75%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(230, 199, 133, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(230, 199, 133, 0)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(230, 199, 133, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(230, 199, 133, 0.6)" },
        },
        barBounce: {
          "0%, 80%, 100%": { height: "30%", opacity: "0.7" },
          "40%": { height: "100%", opacity: "1" },
        },
      },

      fontFamily: {
        sans: ["Nunito", "Poppins", "Inter", "system-ui", "sans-serif"],
      },

      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },

      borderRadius: {
        "4xl": "2rem",
      },

      // Transitions
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },

      // Accessibility - minimum touch targets
      minHeight: {
        touch: "44px", // WCAG 2.1 minimum
        "touch-lg": "48px",
      },
      minWidth: {
        touch: "44px",
        "touch-lg": "48px",
      },

      // Reduced motion
      transitionDuration: {
        0: "0ms", // For prefers-reduced-motion
      },
    },
  },
  plugins: [],
};
