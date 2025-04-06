/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        accent: {
          teal: '#2DD4BF',
          gray: '#374151'
        }
      }
    },
  },
  plugins: [],
};