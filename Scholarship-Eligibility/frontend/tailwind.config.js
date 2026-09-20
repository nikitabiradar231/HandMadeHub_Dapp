/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        midnight: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#bae6fd',
          500: '#6366f1',
          600: '#4f46e5',
          800: '#1e1b4b',
          900: '#0f172a',
          950: '#070b14',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(168, 85, 247, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
