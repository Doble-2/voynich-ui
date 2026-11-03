import React, { useRef, useState } from "react";
import { InkFilters, useInkId } from "./ink";

/**
 * PROTOTIPO — Constelación (encontrar una acción entre muchas).
 *
 * Un menú es una lista: no dice qué acciones van juntas ni cuáles importan más. Aquí las acciones son estrellas
 * agrupadas en asterismos (las secciones astronómicas del Voynich están llenas de ellos). La magnitud de la estrella
 * es la frecuencia de uso; al acercarse a una, se encienden las líneas de su asterismo y se leen sus compañeras.
 * Con el teclado, las flechas llevan a la estrella más cercana en esa dirección: se recorre un cielo, no una lista.
 */
export interface Star {
  id: string;
  label: string;
  x: number;
  y: number;
  /** Asterismo al que pertenece. */
  group: string;
  /** Magnitud: 1 (frecuente, grande) a 3 (rara, pequeña). @default 2 */
  mag?: 1 | 2 | 3;
}

export interface ConstellationProps {
  stars: Star[];
  /** Nombre de cada asterismo. */
  groups: Record<string, string>;
  onSelect: (star: Star) => void;
  label: string;
  width: number;
  height: number;
}

/** Estrella de ocho puntas dibujada a pluma. */
const starPath = (r: number) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.38 : r * (i % 4 ? 0.7 : 1);
    return `${i ? "L" : "M"}${(Math.cos(a) * rr).toFixed(2)} ${(Math.sin(a) * rr).toFixed(2)}`;
  }).join(" ") + "Z";

/** Une las estrellas de un grupo en el orden en que se dan (un trazo continuo, como un asterismo). */
const asterism = (stars: Star[]) => stars.map((s, i) => `${i ? "L" : "M"}${s.x} ${s.y}`).join(" ");

export function Constellation({ stars, groups, onSelect, label, width, height }: ConstellationProps) {
  const id = useInkId();
  const [focus, setFocus] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const refs = useRef<Record<string, SVGGElement | null>>({});
  const active = stars.find((s) => s.id === focus)?.group ?? null;
  const groupIds = [...new Set(stars.map((s) => s.group))];

  // Navegación espacial: la estrella más cercana en la dirección de la flecha (cono de ±60°).
  const nearest = (from: Star, dx: number, dy: number) => {
    let best: Star | null = null, bestD = Infinity;
    for (const s of stars) {
      if (s === from) continue;
      const vx = s.x - from.x, vy = s.y - from.y, d = Math.hypot(vx, vy);
      const cos = (vx * dx + vy * dy) / d;
      if (cos < 0.5) continue;
      const score = d * (2 - cos); // más cerca y más alineada, mejor
      if (score < bestD) (bestD = score), (best = s);
    }
    return best;
  };

  const onKey = (s: Star) => (e: React.KeyboardEvent) => {
    const dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (dir) {
      e.preventDefault();
      const n = nearest(s, dir[0]!, dir[1]!);
      if (n) refs.current[n.id]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setChosen(s.id);
      onSelect(s);
    }
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="lab-sky" role="group" aria-label={label} data-active={active ?? undefined}>
      <InkFilters id={id} />
      {/* Asterismos: trazos finos que se encienden al acercarse a una de sus estrellas. */}
      <g filter={`url(#${id}-pen)`}>
        {groupIds.map((g) => {
          const members = stars.filter((s) => s.group === g);
          const cx = members.reduce((a, s) => a + s.x, 0) / members.length;
          const cy = Math.min(...members.map((s) => s.y)) - 22;
          return (
            <g key={g} className="lab-sky__asterism" data-on={active === g || undefined}>
              <path d={asterism(members)} />
              <text x={cx} y={cy} className="lab-sky__group">{groups[g]}</text>
            </g>
          );
        })}
      </g>
      {stars.map((s) => {
        const r = { 1: 9, 2: 6.5, 3: 4.5 }[s.mag ?? 2];
        const inGroup = active === s.group;
        return (
          <g
            key={s.id}
            ref={(el) => void (refs.current[s.id] = el)}
            role="button"
            tabIndex={0}
            aria-label={`${s.label}, ${groups[s.group]}`}
            aria-pressed={chosen === s.id}
            className="lab-sky__star"
            data-near={inGroup || undefined}
            data-focus={focus === s.id || undefined}
            data-chosen={chosen === s.id || undefined}
            transform={`translate(${s.x} ${s.y})`}
            onPointerEnter={() => setFocus(s.id)}
            onPointerLeave={() => setFocus((f) => (f === s.id ? null : f))}
            onFocus={() => setFocus(s.id)}
            onBlur={() => setFocus((f) => (f === s.id ? null : f))}
            onClick={() => {
              setChosen(s.id);
              onSelect(s);
            }}
            onKeyDown={onKey(s)}
          >
            <circle r={r + 12} className="lab-sky__hit" />
            {chosen === s.id && <circle r={r + 6} className="lab-sky__ring" filter={`url(#${id}-pen)`} />}
            <path d={starPath(r)} className="lab-sky__shape" filter={`url(#${id}-pen)`} />
            <text y={r + 15} className="lab-sky__label">{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
