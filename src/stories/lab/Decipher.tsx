import React from "react";

/**
 * PROTOTIPO — Desciframiento.
 *
 * Lo oculto no se destapa con un gesto (hover, clic, rascar): se vuelve legible cuando se sabe lo suficiente.
 * El texto está en un alfabeto desconocido; cada palabra aprendida aparece traducida encima, como una glosa
 * interlineal de estudioso, sin borrar el glifo. Lo que todavía no se sabe sigue siendo glifo.
 *
 * Los glifos están dibujados a pluma a partir de las formas del Voynich: bucles (o, a), minims (i, n), medias
 * lunas (e, c), el banco (ch), las astas «horca» (k, t), el 8 (d), la cola (y).
 */

// Glifos en una caja de 16×24, línea base en y=18, altura de x de 9. [trazo, ancho de avance]
const G: Record<string, [string, number]> = {
  o: ["M8 9.5 C3.5 9.5 3.5 18 8 18 C12.5 18 12.5 9.5 8 9.5 Z", 13],
  a: ["M8 9.5 C3.5 9.5 3.5 18 8 18 C11 18 12 15 12 12 M12 10 C12 14 12.5 17 14.5 18", 15],
  i: ["M6 10 C6 13 6 16 6.5 18", 8],
  n: ["M5 10 C5 14 5 17 6 18 C9 18.5 11 15 11.5 11", 13],
  e: ["M11.5 10.5 C8 8.5 4.5 10 4.5 13.5 C4.5 17 8 18.5 11.5 17", 13],
  c: ["M11 10 C6.5 9 4 11.5 4.5 14.5 C5 17.5 8 18.5 11 17.5 M4.5 14 L10 13", 13],
  h: ["M2.5 18 C2 12 3 9.5 6 9.5 C8 9.5 9 11 9 13 M9 13 C9 10.5 11 9.5 13 9.5 C16 9.5 16.5 12.5 16 18", 18],
  k: ["M4 18 C4 12 4.5 6 5 2.5 C6 0.5 9 0.5 10 3 C11 6 7 7.5 6 5 M10 3 C11.5 1 14.5 1.5 14 5 C13.5 9 13.5 13 13.5 18 M2.5 10 C7 9 12 9 16 10", 18],
  t: ["M4.5 18 C4.5 12 5 6 5.5 2 C7 0 10 1 9.5 4 C9 7 6.5 7 6 5 M9.5 4 C10.5 2 13 2 13 5 C13 9 12.5 13 13 18 M2.5 10.5 C7 9.5 12 9.5 15.5 10.5", 17],
  d: ["M9 18 C4 18 3.5 12.5 7.5 11.5 C11 10.5 12.5 7 10.5 4 C9 2 6 2.5 6.5 5 C7 8 12 10 12.5 14 C13 17 11 18 9 18 Z", 15],
  y: ["M7.5 9.5 C3.5 9.5 3.5 17.5 7.5 17.5 C10.5 17.5 11.5 14 11.5 11 M11.5 10 C12 16 11 21 8 22.5 C6 23.5 4 22.5 4.5 21", 14],
  l: ["M5 3 C5.5 8 6 13 7 18 C9.5 19 12.5 17 13 13.5", 15],
  r: ["M5 10 C5 13 5 16 5.5 18 M5 12.5 C7.5 9 11 9 12.5 11.5", 14],
  s: ["M12 10 C9 8.5 5 9.5 5.5 12 C6 14 11 13.5 11.5 15.5 C12 18 7.5 19 4.5 17.5", 15],
  q: ["M4 13.5 L12.5 13.5 M10 18 C10 14 10.5 9 11 4.5 C8 7 6 10 4 13.5", 15],
  p: ["M4.5 18 C4.5 12 5 6 5.5 2 C7 0 10 1 9.5 4 C9 7 6.5 7 6 5 M9.5 4 C11 1.5 14.5 2 14.5 6 C14.5 9.5 12 10.5 10 10.5 M2.5 10.5 L16 10.5", 18],
};
// Correspondencia arbitraria (y fija) entre letras latinas y glifos. Las letras más frecuentes del castellano
// caen en los glifos más ajenos (bancos, astas, ochos) para que el texto no se «lea» por parecido.
const MAP: Record<string, string> = {
  a: "h", e: "d", o: "k", s: "y", n: "q", r: "c", l: "t", d: "e", t: "p", c: "s", i: "a", u: "n", m: "r",
  p: "l", g: "i", b: "o", f: "k", h: "i", j: "y", v: "l", x: "q", y: "a", z: "s", ñ: "r", q: "o", k: "p", w: "h",
};

const norm = (w: string) => w.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Una palabra dibujada en glifos (decorativa: el texto real va aparte para lectores de pantalla). */
export function GlyphWord({ word, size = 1 }: { word: string; size?: number }) {
  // Las vocales dobles y «ch» se funden en el banco, como en el Voynich.
  const letters = norm(word).replace(/[^a-zñ]/g, "").split("");
  let x = 0;
  const strokes = letters.map((ch, i) => {
    const g = G[MAP[ch] ?? "o"]!;
    const el = <path key={i} d={g[0]} transform={`translate(${x} 0)`} />;
    x += g[1] - 3;
    return el;
  });
  const w = x + 4;
  return (
    <svg className="lab-glyph" width={w * 0.9 * size} height={24 * 0.9 * size} viewBox={`0 0 ${w} 24`} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        {strokes}
      </g>
    </svg>
  );
}

export interface DecipherProps {
  /** El texto en claro. Las palabras se comparan sin acentos ni mayúsculas. */
  text: string;
  /** Palabras que el lector ya sabe leer. */
  known: Set<string>;
  className?: string;
}

/** Párrafo en el alfabeto desconocido; las palabras sabidas llevan su glosa encima. */
export function Decipher({ text, known, className }: DecipherProps) {
  const tokens = text.split(/(\s+)/);
  const words = tokens.filter((t) => /\S/.test(t));
  const read = words.filter((w) => known.has(norm(w.replace(/[^\p{L}]/gu, "")))).length;
  return (
    <div className={["lab-decipher", className].filter(Boolean).join(" ")}>
      <p className="lab-decipher__line">
        {tokens.map((tok, i) => {
          if (!/\S/.test(tok)) return " ";
          const bare = tok.replace(/[^\p{L}]/gu, "");
          const punct = tok.slice(bare.length ? tok.indexOf(bare) + bare.length : 0);
          const isKnown = known.has(norm(bare));
          return (
            <span key={i} className="lab-decipher__word" data-known={isKnown || undefined}>
              <span className="lab-decipher__glyph">
                <GlyphWord word={bare} />
                {punct && <span className="lab-decipher__punct">{punct}</span>}
              </span>
              <span className="lab-decipher__gloss" aria-hidden={!isKnown}>
                {isKnown ? bare : " "}
              </span>
              {!isKnown && <span className="sr-only">[sin descifrar]</span>}
            </span>
          );
        })}
      </p>
      <p className="lab-decipher__count" aria-live="polite">
        {read} de {words.length} palabras descifradas
      </p>
    </div>
  );
}
