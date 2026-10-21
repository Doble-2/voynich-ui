import { create } from 'storybook/theming';

export default create({
  base: 'dark',

  // Brand
  brandTitle: 'Voynich UI',
  brandUrl: 'https://github.com/Doble-2/voynich-ui',
  // Inline SVG brand image — a Voynich-style ouroboros sigil
  brandImage: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="200" height="40">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#8b6a3e" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#c9a95f"/>
        <stop offset="100%" stop-color="#8b6a3e" stop-opacity="0.6"/>
      </linearGradient>
    </defs>
    <!-- Sigil circle -->
    <circle cx="20" cy="20" r="13" fill="none" stroke="url(#g)" stroke-width="1.2" opacity="0.7"/>
    <circle cx="20" cy="20" r="8" fill="none" stroke="#c9a95f" stroke-width="0.6" opacity="0.35"/>
    <text x="20" y="24.5" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#c9a95f" opacity="0.85">V</text>
    <!-- Small ornamental dots -->
    <circle cx="20" cy="5.5" r="1.2" fill="#c9a95f" opacity="0.4"/>
    <circle cx="20" cy="34.5" r="1.2" fill="#c9a95f" opacity="0.4"/>
    <!-- Title -->
    <text x="44" y="18" font-family="Georgia, 'Times New Roman', serif" font-size="14" fill="#c9a95f" letter-spacing="0.08em" font-weight="400">Voynich</text>
    <text x="44" y="32" font-family="'Courier New', monospace" font-size="8.5" fill="#5a4d38" letter-spacing="0.25em" font-weight="300">UI LIBRARY</text>
    <!-- Decorative line -->
    <line x1="44" y1="21" x2="108" y2="21" stroke="#5a4d38" stroke-width="0.4" opacity="0.5"/>
  </svg>`)}`,
  brandTarget: '_self',

  // Typography
  fontBase: "'IM Fell English', Georgia, 'Times New Roman', serif",
  fontCode: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",

  // Palette
  colorPrimary: '#c9a95f',
  colorSecondary: '#8b6a3e',

  // UI surfaces
  appBg: '#060402',
  appContentBg: '#0a0704',
  appPreviewBg: '#0d0905',
  appBorderColor: 'rgba(42,29,18,0.35)',
  appBorderRadius: 2,

  // Typography colors
  textColor: '#c0b08a',
  textInverseColor: '#0d0905',
  textMutedColor: '#6b5a3a',

  // Toolbar
  barTextColor: '#7a6b50',
  barSelectedColor: '#c9a95f',
  barHoverColor: '#d4b76a',
  barBg: '#060402',

  // Forms
  inputBg: '#080503',
  inputBorder: 'rgba(42,29,18,0.3)',
  inputTextColor: '#b0a07a',
  inputBorderRadius: 3,

  // Buttons
  buttonBg: '#100b06',
  buttonBorder: 'rgba(58,42,24,0.35)',

  // Grid
  gridCellSize: 12,
});
