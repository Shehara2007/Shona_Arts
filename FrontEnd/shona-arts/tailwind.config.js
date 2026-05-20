/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gallery: {
          ink: '#24191b',
          red: '#d91f3c',
          rose: '#fff0f3',
          blush: '#fde8ec',
          paper: '#fffaf8',
        },
      },
      boxShadow: {
        glass: '0 20px 70px rgba(98, 23, 35, 0.16)',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
