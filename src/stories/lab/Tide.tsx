import React, { useEffect, useRef, useState } from "react";
import { InkFilters, useInkId } from "./ink";
import { useReducedMotion } from "../../lib/useReducedMotion";

/**
 * PROTOTIPO — Marea (esperar).
 *
 * Un spinner gira sin decir nada; una barra de progreso inventa un porcentaje. La marea es honesta: el agua
 * sube con el tiempo transcurrido, sobre una franja rayada que marca cuánto se esperaba. Si el agua rebasa la
 * franja, desborda por los lados: la espera ya es anómala y se ve sin leer nada. Al terminar, se vacía.
 */
export interface TideProps {
  /** Cuánto se espera que tarde, en segundos: [mínimo, máximo]. */
  expected: [number, number];
  /** Cuando es `true`, la espera ha terminado. */
  done?: boolean;
  /** Qué se está esperando (para lectores de pantalla y el pie). */
  label: string;
}

export function Tide({ expected: [min, max], done = false, label }: TideProps) {
  const id = useInkId();
  const reduced = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const start = useRef(performance.now());
  const final = useRef<number | null>(null);

  useEffect(() => {
    if (done) {
      final.current ??= elapsed;
      return;
    }
    start.current = performance.now() - elapsed * 1000;
    final.current = null;
    const t = setInterval(() => setElapsed((performance.now() - start.current) / 1000), reduced ? 1000 : 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, reduced]);

  // La cisterna cubre hasta 1,4 × el máximo esperado; más allá, desborda.
  const top = 24, bottom = 196, cap = max * 1.4;
  const yOf = (s: number) => bottom - (bottom - top) * Math.min(1, s / cap);
  const level = done ? bottom : yOf(elapsed);
  const over = !done && elapsed > max;
  const state = done ? "done" : over ? "over" : elapsed >= min ? "within" : "early";
  const secs = Math.round(final.current ?? elapsed);
  const marks = Array.from({ length: Math.floor(cap / 5) + 1 }, (_, i) => i * 5);

  const text =
    state === "done" ? `Hecho en ${secs} s` : state === "over" ? `${secs} s · más de lo esperado (${min}–${max} s)` : `${secs} s · se esperaban ${min}–${max} s`;

  return (
    <figure className="lab-tide" data-state={state}>
      <svg viewBox="0 0 150 230" className="lab-tide__svg" aria-hidden="true">
        <InkFilters id={id} />
        <clipPath id={`${id}-in`}>
          <path d={`M30 ${top} L30 ${bottom - 8} Q30 ${bottom} 40 ${bottom} L100 ${bottom} Q110 ${bottom} 110 ${bottom - 8} L110 ${top} Z`} />
        </clipPath>

        {/* Franja de lo esperado: rayado, como una zona marcada en la piedra. */}
        <rect x="30" y={yOf(max)} width="80" height={yOf(min) - yOf(max)} fill={`url(#${id}-hatch)`} opacity="0.7" />

        {/* El agua */}
        <g clipPath={`url(#${id}-in)`}>
          <rect
            x="26"
            width="88"
            y={level}
            height={bottom - level + 4}
            className="lab-tide__water"
            filter={`url(#${id}-wash)`}
            style={{ transition: done && !reduced ? "y 1.4s ease-in, height 1.4s ease-in" : undefined }}
          />
          {!done && !reduced && <path className="lab-tide__surface" d={`M26 ${level} q11 -3 22 0 t22 0 t22 0 t22 0`} />}
        </g>

        {/* Desborde: dos hilos que caen por fuera de la cisterna. */}
        {over && (
          <g className="lab-tide__spill" filter={`url(#${id}-wash)`}>
            <path d={`M30 ${top} q-8 2 -10 20 L19 ${bottom + 20}`} />
            <path d={`M110 ${top} q8 2 10 20 L121 ${bottom + 20}`} />
          </g>
        )}

        {/* Cisterna y escala grabada */}
        <g filter={`url(#${id}-pen)`} className="lab-tide__ink">
          <path d={`M26 ${top - 6} L30 ${top} L30 ${bottom - 8} Q30 ${bottom} 40 ${bottom} L100 ${bottom} Q110 ${bottom} 110 ${bottom - 8} L110 ${top} L114 ${top - 6}`} />
          <path d={`M66 ${bottom} L66 ${bottom + 10} M74 ${bottom} L74 ${bottom + 10}`} opacity="0.7" />
          {marks.map((s) => (
            <g key={s}>
              <path d={`M110 ${yOf(s)} L${s % 10 === 0 ? 120 : 116} ${yOf(s)}`} strokeWidth="0.7" />
              {s % 10 === 0 && (
                <text x="124" y={yOf(s) + 3} className="lab-tide__num">
                  {s}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
      <figcaption className="lab-tide__caption">
        <span className="lab-tide__what">{label}</span>
        <span className="lab-tide__time" aria-hidden="true">{text}</span>
        {/* Solo se anuncia cuando cambia el estado, no cada décima de segundo. */}
        <span className="sr-only" role="status">
          {state === "done" ? `${label}: hecho en ${secs} segundos` : state === "over" ? `${label}: tarda más de lo esperado` : `${label}: en curso`}
        </span>
      </figcaption>
    </figure>
  );
}
