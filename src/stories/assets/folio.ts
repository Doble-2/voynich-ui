/**
 * Un folio de herbario dibujado en SVG, al estilo de la sección botánica del manuscrito Voynich:
 * una planta con raíces, hojas lavadas en verde y flor de lapislázuli, junto a renglones de texto en
 * transcripción EVA (el alfabeto con el que se transcribe el Voynich).
 *
 * Sustituye a las fotos de stock: va dentro del repo, no depende de la red y es del mundo del manuscrito.
 */

// Primeras palabras del folio 1r en EVA, más algunas frecuentes del herbario.
const EVA = [
  "fachys ykal ar ataiin shol shory",
  "cthres y kor sholdy sory ckhar or",
  "y kair chtaiin shar are cthar cthar",
  "dan syaiir sheky or ykaiin shod",
  "cthoary cthes daraiin sa ooiin",
  "oteey oteos roloty cthiar daiin",
  "otaiin or okan sair chey chaiin",
  "qokeedy qokedy dal qokain okal",
  "shedy qokedy chedy qotedy lol",
  "daiin chol chor cthol sho kshy",
  "okaiin chckhy dy ytchy pchedar",
  "sor chear cheol chol dar ckhy",
];

const lines = EVA.map(
  (t, i) =>
    `<text x="540" y="${132 + i * 40}" font-family="Georgia, serif" font-style="italic" font-size="25" fill="#3b2a18" opacity="0.88">${t}</text>`,
).join("");

// Hojas: elipses giradas alrededor del tallo, con lavado verde y contorno de tinta.
const LEAF_POSITIONS: [x: number, y: number, rotation: number][] = [
  [300, 420, -40],
  [262, 372, -150],
  [338, 340, -30],
  [252, 300, -160],
  [342, 268, -20],
  [270, 236, -140],
];
const leaves = LEAF_POSITIONS
  .map(
    ([x, y, r]) =>
      `<ellipse cx="${x}" cy="${y}" rx="62" ry="22" transform="rotate(${r} ${x} ${y})" fill="#7d8c4f" fill-opacity="0.55" stroke="#2f2921" stroke-width="2.2"/>` +
      `<line x1="${x}" y1="${y}" x2="${x + 50 * Math.cos((r * Math.PI) / 180)}" y2="${y + 50 * Math.sin((r * Math.PI) / 180)}" stroke="#2f2921" stroke-width="1" opacity="0.6"/>`,
  )
  .join("");

const petals = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * 360;
  return `<ellipse cx="300" cy="134" rx="14" ry="32" transform="rotate(${a} 300 168)" fill="#2f4a7a" fill-opacity="0.6" stroke="#2f2921" stroke-width="1.6"/>`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">
<defs>
  <radialGradient id="stain" cx="0.78" cy="0.82" r="0.5"><stop offset="0" stop-color="#9c7a52" stop-opacity="0.28"/><stop offset="1" stop-color="#9c7a52" stop-opacity="0"/></radialGradient>
  <radialGradient id="edge" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#bfa387" stop-opacity="0"/><stop offset="1" stop-color="#8b6a45" stop-opacity="0.45"/></radialGradient>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.12 0"/></filter>
</defs>
<rect width="1000" height="700" fill="#e4d9c7"/>
<rect width="1000" height="700" filter="url(#grain)"/>
<rect width="1000" height="700" fill="url(#stain)"/>
<rect width="1000" height="700" fill="url(#edge)"/>
<text x="930" y="56" font-family="Georgia, serif" font-size="22" fill="#5a4b30" opacity="0.7">1r</text>
<!-- raíces -->
<path d="M300 560 C 270 600 230 610 205 650 M300 560 C 320 610 360 620 392 655 M300 560 C 296 610 290 640 298 680 M262 600 C 240 620 228 640 238 668 M340 604 C 362 626 368 650 356 672" fill="none" stroke="#5a3d26" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="300" cy="560" rx="46" ry="22" fill="#8b4a2a" fill-opacity="0.55" stroke="#2f2921" stroke-width="2.4"/>
<!-- tallo -->
<path d="M300 545 C 296 460 306 330 300 200" fill="none" stroke="#2f2921" stroke-width="5" stroke-linecap="round"/>
${leaves}
<!-- flor -->
${petals}
<circle cx="300" cy="168" r="17" fill="#a34a33" fill-opacity="0.7" stroke="#2f2921" stroke-width="2"/>
<!-- texto -->
${lines}
<text x="70" y="78" font-family="Georgia, serif" font-style="italic" font-size="30" fill="#a34a33" opacity="0.85">pchocthy</text>
</svg>`;

export const FOLIO_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
