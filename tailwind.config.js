/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        voynich: {
          vellum:     '#eadbb6',
          vellumAged: '#eaddc5',
          inkDark:    '#30180d',
          inkDeep:    '#21120a',
          inkMedium:  '#5c331d',
          glow:       '#5eead4',
          blood:      '#8b0000',
          alchBrown:  '#8b4a2a',
        },
      },
      fontFamily: {
        manuscript: ['IM Fell English', 'Georgia', 'serif'],
      },
      borderRadius: {
        vellum: '40% 10% 80% 20% / 20% 60% 40% 90%',
      },
    },
  },
  plugins: [],
}