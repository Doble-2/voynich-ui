/**
 * Preset de Tailwind de Voynich UI.
 *
 * Los colores leen variables CSS (canales RGB) definidas en `voynich-ui/style.css`,
 * de modo que un proyecto puede re-tematizar la librería sin tocar los componentes:
 *
 *   :root { --voynich-vellum: 240 232 210; }
 *
 * Uso:
 *   import voynich from 'voynich-ui/tailwind-preset';
 *   export default { presets: [voynich], content: [...] };
 */
const token = (name) => `rgb(var(--voynich-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // Paleta cruda del manuscrito
        voynich: {
          vellum: token('vellum'),
          vellumAged: token('vellum-aged'),
          vellumShade: token('vellum-shade'),
          vellumDark: token('vellum-dark'),
          leather: token('leather'),
          inkDark: token('ink'),
          inkDeep: token('ink-deep'),
          inkMedium: token('ink-medium'),
          glow: token('glow'),
          blood: token('blood'),
          alchBrown: token('alch-brown'),
          void: token('void'),
          lapis: token('lapis'),
          verdigris: token('verdigris'),
          vermilion: token('vermilion'),
          gold: token('gold'),
          brass: token('brass'),
        },
        // Alias semánticos (los usan los componentes internamente)
        background: token('vellum'),
        foreground: token('ink'),
        border: token('ink-medium'),
        primary: token('ink-medium'),
        secondary: token('vellum-shade'),
        ring: token('glow'),
      },
      fontFamily: {
        manuscript: ['var(--voynich-font-body)'],
        smallcaps: ['var(--voynich-font-sc)'],
        display: ['var(--voynich-font-display)'],
        glyph: ['var(--voynich-font-glyph)', 'IM Fell English', 'serif'],
      },
      borderRadius: {
        vellum: '40% 10% 80% 20% / 20% 60% 40% 90%',
      },
    },
  },
  plugins: [],
};
