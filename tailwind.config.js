/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Luxury maritime palette — deep navy base, brass/gold accent.
        navy: {
          DEFAULT: '#0A1A2F',
          50: '#E7EBF1',
          100: '#C3CCDA',
          200: '#9AAABF',
          300: '#7187A4',
          400: '#4F6A8E',
          500: '#2E4D78',
          600: '#1C3A5E',
          700: '#122B49',
          800: '#0A1A2F',
          900: '#050E1A',
        },
        gold: {
          DEFAULT: '#C5A059',
          50: '#FBF7EE',
          100: '#F3E9CF',
          200: '#E7D2A2',
          300: '#DBBC76',
          400: '#C5A059',
          500: '#A9863F',
          600: '#866A30',
          700: '#634E23',
          800: '#403216',
          900: '#22190A',
        },
        ink: '#0A1A2F',
        cloud: '#F6F8FB',
      },
      fontFamily: {
        sans: ['System', 'ui-sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
