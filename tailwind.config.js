/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        orange: {
          600: '#ea580c',
          700: '#c2410c',
        },
        green: {
          600: '#16a34a',
          700: '#15803d',
        },
      },
    },
  },
  plugins: [],
}