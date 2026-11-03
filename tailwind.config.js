import voynich from './tailwind.preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [voynich],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
