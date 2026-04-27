/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff2b2b',
          container: '#e7131d',
          fixed: '#ffdad6',
        },
        surface: {
          DEFAULT: '#f9f9f9',
          low: '#f3f3f4',
          lowest: '#ffffff',
          variant: '#e2e2e2',
          container: {
            low: '#f3f3f4',
            lowest: '#ffffff',
            high: '#e8e8e8',
            highest: '#e2e2e2',
          }
        },
        'on-surface': '#1a1c1c',
        'outline-variant': 'rgba(147, 110, 106, 0.15)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      animation: {
        'glow-perimeter': 'glow-perimeter 3s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
      },
      keyframes: {
        'glow-perimeter': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
        premium: '20px',
      }
    },
  },
  plugins: [],
}
