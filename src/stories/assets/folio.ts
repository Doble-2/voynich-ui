/**
 * Un folio de herbario en SVG, dibujado como un grabado a plumilla y no como una ilustración plana:
 * trazo fino de grosor variable, sombreado con rayado (la luz viene de arriba a la izquierda), aguadas
 * irregulares que no rellenan del todo la forma, papel con fibra y manchas de óxido, y renglones en
 * transcripción EVA con la tinta desigual de una pluma.
 *
 * Va dentro del repo para que las stories no dependan de la red.
 */

// Generador determinista: el mismo dibujo en cada carga (y en el servidor).
let seed = 17;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const jit = (n: number) => (rnd() - 0.5) * 2 * n;
const f = (n: number) => n.toFixed(1);

const INK = "#3a2a1a";

type Pt = [number, number];

/** Hoja lanceolada asimétrica desde `base`, con ángulo `a` (rad), largo `len` y ancho `w`. */
function leaf(base: Pt, a: number, len: number, w: number, id: string) {
  const [bx, by] = base;
  const ux = Math.cos(a), uy = Math.sin(a); // eje del nervio
  const nx = -uy, ny = ux; // normal
  const at = (t: number, s: number): Pt => [bx + ux * len * t + nx * s, by + uy * len * t + ny * s];
  const tip = at(1, jit(3));
  const c1 = at(0.25, w * (0.9 + jit(0.15))), c2 = at(0.7, w * (0.75 + jit(0.15)));
  const c3 = at(0.7, -w * (0.6 + jit(0.15))), c4 = at(0.25, -w * (0.8 + jit(0.15)));
  const outline = `M${f(bx)} ${f(by)} C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(tip[0])} ${f(tip[1])} C${f(c3[0])} ${f(c3[1])} ${f(c4[0])} ${f(c4[1])} ${f(bx)} ${f(by)}Z`;

  // Rayado del lado en sombra (abajo a la derecha de la luz): trazos cortos paralelos al nervio.
  const shadeSide = ny > 0 ? 1 : -1;
  let hatch = "";
  for (let i = 0; i < 16; i++) {
    const t = 0.12 + (i / 16) * 0.78;
    const p = at(t, shadeSide * w * 0.15);
    const q = at(t + 0.05, shadeSide * w * (0.55 + jit(0.12)));
    hatch += `M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}`;
  }
  // Nervaduras secundarias.
  let veins = "";
  for (let i = 1; i < 6; i++) {
    const t = i / 6.5;
    const p = at(t, 0);
    for (const s of [1, -1]) {
      const q = at(t + 0.12, s * w * 0.5);
      veins += `M${f(p[0])} ${f(p[1])}Q${f(at(t + 0.04, s * w * 0.2)[0])} ${f(at(t + 0.04, s * w * 0.2)[1])} ${f(q[0])} ${f(q[1])}`;
    }
  }
  const mid = at(0.96, 0);
  return `
  <clipPath id="${id}"><path d="${outline}"/></clipPath>
  <path d="${outline}" fill="url(#wash-green)" opacity="${f(0.55 + jit(0.1))}" filter="url(#bleed)"/>
  <g clip-path="url(#${id})" stroke="${INK}" stroke-width="0.7" opacity="0.55"><path d="${hatch}"/></g>
  <path d="M${f(bx)} ${f(by)}L${f(mid[0])} ${f(mid[1])}" stroke="${INK}" stroke-width="0.9" opacity="0.7"/>
  <path d="${veins}" clip-path="url(#${id})" stroke="${INK}" stroke-width="0.5" opacity="0.45" fill="none"/>
  <path d="${outline}" fill="none" stroke="${INK}" stroke-width="1.15" opacity="0.85"/>`;
}

function stemPath(x0: number, y0: number, x1: number, y1: number) {
  const pts: Pt[] = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    pts.push([x0 + (x1 - x0) * t + Math.sin(t * 3.1) * 7 + jit(1.2), y0 + (y1 - y0) * t]);
  }
  return "M" + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L");
}

// Tallo: dos trazos casi paralelos (grosor variable de la pluma) en lugar de una línea gruesa.
const stem = stemPath(300, 556, 302, 206);
const stem2 = stemPath(304, 556, 305, 210);

const leaves = [
  leaf([302, 470], Math.PI * 1.1, 96, 26, "l1"),
  leaf([304, 432], -Math.PI * 0.12, 104, 28, "l2"),
  leaf([301, 384], Math.PI * 1.18, 92, 24, "l3"),
  leaf([305, 340], -Math.PI * 0.2, 88, 23, "l4"),
  leaf([302, 296], Math.PI * 1.24, 72, 19, "l5"),
  leaf([305, 262], -Math.PI * 0.28, 66, 17, "l6"),
].join("");

// Flor: pétalos estrechos con aguada de lapislázuli desigual y rayado radial.
let petals = "";
for (let i = 0; i < 9; i++) {
  const a = (i / 9) * Math.PI * 2 + jit(0.08);
  const len = 40 + jit(5);
  const bx = 304 + Math.cos(a) * 9, by = 190 + Math.sin(a) * 9;
  const tx = 304 + Math.cos(a) * len, ty = 190 + Math.sin(a) * len;
  const nx = -Math.sin(a) * 8, ny = Math.cos(a) * 8;
  const d = `M${f(bx)} ${f(by)} Q${f((bx + tx) / 2 + nx)} ${f((by + ty) / 2 + ny)} ${f(tx)} ${f(ty)} Q${f((bx + tx) / 2 - nx)} ${f((by + ty) / 2 - ny)} ${f(bx)} ${f(by)}Z`;
  petals += `<path d="${d}" fill="url(#wash-lapis)" opacity="${f(0.5 + jit(0.12))}" filter="url(#bleed)"/>`;
  petals += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.9" opacity="0.8"/>`;
  petals += `<path d="M${f(bx)} ${f(by)}L${f(304 + Math.cos(a) * len * 0.8)} ${f(190 + Math.sin(a) * len * 0.8)}" stroke="${INK}" stroke-width="0.45" opacity="0.5"/>`;
}

// Raíz: bulbo con rayado cruzado y raicillas finas que se adelgazan.
let roots = "";
for (let i = 0; i < 9; i++) {
  const a = Math.PI * (0.18 + (i / 8) * 0.64) + jit(0.06);
  const len = 60 + jit(26);
  const x0 = 302 + jit(14), y0 = 572;
  const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len;
  roots += `<path d="M${f(x0)} ${f(y0)} Q${f((x0 + x1) / 2 + jit(12))} ${f((y0 + y1) / 2)} ${f(x1)} ${f(y1)}" stroke="${INK}" stroke-width="${f(0.6 + rnd() * 0.7)}" fill="none" opacity="0.75"/>`;
}
let bulbHatch = "";
for (let i = 0; i < 14; i++) {
  const x = 270 + i * 5;
  bulbHatch += `M${x} 552L${x + 12} 594`;
}

// Renglones en EVA: cada renglón con su propia carga de tinta.
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
    `<text x="${f(548 + jit(4))}" y="${f(140 + i * 38 + jit(1.5))}" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="23" letter-spacing="0.4" fill="${INK}" opacity="${f(0.62 + rnd() * 0.3)}">${t}</text>`,
).join("");

// Pautado: las líneas guía del escriba, casi borradas.
let ruling = "";
for (let i = 0; i < 12; i++) ruling += `M540 ${147 + i * 38}H950`;

// Manchas de óxido (foxing): puntos pequeños y desvaídos, no manchones.
let foxing = "";
for (let i = 0; i < 26; i++) {
  foxing += `<circle cx="${f(rnd() * 1000)}" cy="${f(rnd() * 700)}" r="${f(0.8 + rnd() * 3.2)}" fill="#8a5a2b" opacity="${f(0.08 + rnd() * 0.16)}"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">
<defs>
  <filter id="paper" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="4" seed="3" result="n"/>
    <feDiffuseLighting in="n" surfaceScale="0.6" lighting-color="#efe6d4" result="lit"><feDistantLight azimuth="225" elevation="58"/></feDiffuseLighting>
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="8" result="fiber"/>
    <feColorMatrix in="fiber" values="0 0 0 0 0.42  0 0 0 0 0.32  0 0 0 0 0.2  0 0 0 0.09 0" result="fiberInk"/>
    <feBlend in="lit" in2="SourceGraphic" mode="multiply" result="base"/>
    <feComposite in="fiberInk" in2="base" operator="over"/>
  </filter>
  <filter id="bleed" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="5" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="5" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" result="m"/>
    <feColorMatrix in="m" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.6 -0.35" result="mask"/>
    <feComposite in="d" in2="mask" operator="in"/>
  </filter>
  <filter id="pen"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="2" result="p"/><feDisplacementMap in="SourceGraphic" in2="p" scale="1.2"/></filter>
  <linearGradient id="wash-green" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d9a62"/><stop offset="1" stop-color="#5e6d3c"/></linearGradient>
  <linearGradient id="wash-lapis" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a74a3"/><stop offset="1" stop-color="#2f4a7a"/></linearGradient>
  <radialGradient id="edge" cx="0.5" cy="0.5" r="0.72"><stop offset="0.62" stop-color="#b89a74" stop-opacity="0"/><stop offset="1" stop-color="#7a5a36" stop-opacity="0.42"/></radialGradient>
  <radialGradient id="tide" cx="0.86" cy="0.9" r="0.32"><stop offset="0" stop-color="#a07c50" stop-opacity="0.16"/><stop offset="0.85" stop-color="#a07c50" stop-opacity="0.05"/><stop offset="0.95" stop-color="#8a6438" stop-opacity="0.14"/><stop offset="1" stop-color="#8a6438" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1000" height="700" fill="#e2d5bd" filter="url(#paper)"/>
<rect width="1000" height="700" fill="url(#tide)"/>
${foxing}
<path d="${ruling}" stroke="#8a6a46" stroke-width="0.5" opacity="0.18"/>
<g filter="url(#pen)" stroke-linecap="round" stroke-linejoin="round">
  ${roots}
  <path d="M262 572 C266 546 340 544 344 572 C340 598 266 600 262 572Z" fill="#8b5a36" opacity="0.32" filter="url(#bleed)"/>
  <clipPath id="bulb"><path d="M262 572 C266 546 340 544 344 572 C340 598 266 600 262 572Z"/></clipPath>
  <path d="${bulbHatch}" clip-path="url(#bulb)" stroke="${INK}" stroke-width="0.6" opacity="0.5"/>
  <path d="M262 572 C266 546 340 544 344 572 C340 598 266 600 262 572Z" fill="none" stroke="${INK}" stroke-width="1.2" opacity="0.85"/>
  <path d="${stem}" stroke="${INK}" stroke-width="1.1" fill="none" opacity="0.85"/>
  <path d="${stem2}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.6"/>
  ${leaves}
  ${petals}
  <circle cx="304" cy="190" r="9" fill="#a34a33" opacity="0.45" filter="url(#bleed)"/>
  <circle cx="304" cy="190" r="9" fill="none" stroke="${INK}" stroke-width="0.9"/>
</g>
<g filter="url(#pen)">
  <text x="74" y="86" font-family="Georgia, serif" font-style="italic" font-size="30" fill="#8e3f2b" opacity="0.8">pchocthy</text>
  ${lines}
  <text x="928" y="56" font-family="Georgia, serif" font-size="19" fill="#5a4b30" opacity="0.55">1r</text>
</g>
<rect width="1000" height="700" fill="url(#edge)"/>
</svg>`;

export const FOLIO_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
