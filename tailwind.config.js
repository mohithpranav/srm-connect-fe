/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2A73E2', // Primary Blue
          dark: '#2266C2',    // Dark Blue
          light: '#D9ECFF',   // Light Blue
        },
        gray: {
          text: '#5C5E63',    // Text Gray
          dark: '#202225',    // Dark Gray
          light: '#F5F7FA',   // Light Gray
        }
      }
    },
  },
  plugins: [],
};