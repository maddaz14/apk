/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          dark: '#047857',
        },
        gold: '#f59e0b',
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
        }
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(5, 150, 105, 0.4)',
        'glow-gold': '0 0 15px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
}
