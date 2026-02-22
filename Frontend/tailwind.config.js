/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'space': ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        'gradient-start': '#E0BBE4',
        'gradient-end': '#4A3B5F',
        'gradient-top-right-light': '#F8F4FF',
      },
      backgroundImage: {
        'complex-purple-blue': 'linear-gradient(to right bottom, #e7abcd, #cca2c7, #b198bd, #988eb0, #8284a0, #7d82a4, #7780a8, #707eac, #7c83c5, #8f86db, #aa87ee, #c985fd)',
      },
    },
  },
  plugins: [],
} 