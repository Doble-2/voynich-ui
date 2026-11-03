import React from "react";
import { InkFilters, useInkId } from "./ink";

/**
 * PROTOTIPO — Estratos (enterarse de lo que pasó).
 *
 * Una notificación aparece en una esquina y se va: lo que pasó antes, en qué orden y qué importó más se pierde.
 * Aquí cada suceso se deposita como una capa sobre las anteriores, como un sedimento. La textura dice qué tipo de
 * suceso fue (aviso rayado, nota punteada, hecho liso) y el grosor cuánto importa. Lo antiguo se compacta (adelgaza)
 * pero no desaparece: el historial es el propio objeto.
 */
export interface Stratum {
  id: string;
  text: string;
  kind: "hecho" | "nota" | "aviso";
  /** Hora del suceso. */
  at: Date;
}

const BASE = { hecho: 22, nota: 16, aviso: 30 } as const;

/** Borde superior irregular de una capa (determinista por su id). */
function edge(id: string, y: number, w: number) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const r = (i: number) => ((Math.sin(h + i * 12.9898) * 43758.5453) % 1 + 1) % 1;
  const pts = Array.from({ length: 7 }, (_, i) => [(w / 6) * i, y + (r(i) - 0.5) * 4] as const);
  return pts.map(([x, py], i) => (i ? `L${x.toFixed(1)} ${py.toFixed(1)}` : `M${x} ${py.toFixed(1)}`)).join(" ");
}

const ago = (d: Date) => {
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  return s < 60 ? "ahora" : s < 3600 ? `hace ${Math.round(s / 60)} min` : `hace ${Math.round(s / 3600)} h`;
};

export function Strata({ items, label = "Lo que ha pasado" }: { items: Stratum[]; label?: string }) {
  const id = useInkId();
  const W = 70;
  // Más reciente arriba. Cada capa se compacta un 12 % por cada capa que tiene encima (mínimo 5 px).
  const ordered = [...items].sort((a, b) => b.at.getTime() - a.at.getTime());
  let y = 6;
  const layers = ordered.map((it, i) => {
    const h = Math.max(5, BASE[it.kind] * Math.pow(0.88, i));
    const l = { it, y, h, i };
    y += h;
    return l;
  });
  // Los rótulos guardan su propio espacio (34 px) y se unen a su capa con una línea guía.
  const G = 26, ROW = 34;
  let next = 0;
  const labelY = layers.map(({ y, h }) => {
    const ly = Math.max(y + h / 2 - 9, next);
    next = ly + ROW;
    return ly;
  });
  const total = Math.max(y + 10, next);

  return (
    <section className="lab-strata" aria-label={label} style={{ height: total }}>
      <svg viewBox={`0 0 ${W + 10 + G} ${total}`} width={W + 10 + G} height={total} className="lab-strata__core" aria-hidden="true">
        <InkFilters id={id} />
        {layers.map(({ it, y, h }) => (
          <g key={it.id} className="lab-strata__layer" data-kind={it.kind}>
            <path d={`${edge(it.id, y, W)} L${W} ${y + h} L0 ${y + h} Z`} transform="translate(5 0)" className="lab-strata__fill" filter={`url(#${id}-wash)`} />
            {it.kind !== "hecho" && (
              <path d={`${edge(it.id, y, W)} L${W} ${y + h} L0 ${y + h} Z`} transform="translate(5 0)" fill={`url(#${id}-${it.kind === "aviso" ? "hatch" : "dots"})`} />
            )}
            <path d={edge(it.id, y, W)} transform="translate(5 0)" className="lab-strata__line" filter={`url(#${id}-pen)`} />
          </g>
        ))}
        <path d={`M5 6 L5 ${y} M${W + 5} 6 L${W + 5} ${y}`} className="lab-strata__line" filter={`url(#${id}-pen)`} />
        {layers.map(({ it, y, h }, k) => (
          <path key={`g-${it.id}`} d={`M${W + 7} ${y + h / 2} C${W + 16} ${y + h / 2} ${W + 14} ${labelY[k]! + 10} ${W + 10 + G} ${labelY[k]! + 10}`} className="lab-strata__leader" />
        ))}
      </svg>
      <ol className="lab-strata__list" role="log" aria-live="polite">
        {layers.map(({ it }, k) => (
          <li key={it.id} data-kind={it.kind} style={{ top: labelY[k] }} className="lab-strata__entry">
            <span className="lab-strata__text">{it.text}</span>
            <time className="lab-strata__when" dateTime={it.at.toISOString()}>
              {ago(it.at)}
            </time>
          </li>
        ))}
      </ol>
    </section>
  );
}
