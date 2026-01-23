/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f0f1a',
          800: '#1a1a2e',
          700: '#252540',
          600: '#3d3d5c',
        },
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
        },
        accent: {
          purple: '#a855f7',
          blue: '#3b82f6',
          pink: '#ec4899',
        }
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-soft': 'bounce 2s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
