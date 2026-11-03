import React, { useId, useMemo } from "react";
import { InkFilters, useInkId } from "./ink";

/**
 * PROTOTIPO — Tamiz (buscar).
 *
 * Filtrar esconde: lo que no coincide desaparece y no se sabe cuánto se descartó ni qué. Aquí buscar es cribar:
 * lo que coincide queda sobre la malla; lo demás cae al fondo, visible, más pequeño y apagado. Cada letra que se
 * escribe sacude el tamiz. Se ve a la vez lo encontrado y lo descartado, y cuánto de cada cosa.
 */
export interface SieveProps {
  items: { id: string; label: string }[];
  query: string;
  onQuery: (q: string) => void;
  onPick?: (id: string) => void;
  label: string;
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Sieve({ items, query, onQuery, onPick, label }: SieveProps) {
  const id = useInkId();
  const inputId = useId();
  const q = norm(query.trim());
  const [kept, fell] = useMemo(() => {
    const k: SieveProps["items"] = [], f: SieveProps["items"] = [];
    items.forEach((it) => (!q || norm(it.label).includes(q) ? k : f).push(it));
    return [k, f];
  }, [items, q]);

  // Cada cambio de consulta vuelve a montar la malla con otra clave: así se «sacude» (animación CSS).
  return (
    <div className="lab-sieve">
      <label htmlFor={inputId} className="lab-sieve__label">{label}</label>
      <input id={inputId} className="lab-sieve__input" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Escribe para cribar…" autoComplete="off" />

      <ul className="lab-sieve__kept" aria-label={`Retenidos: ${kept.length}`}>
        {kept.map((it) => (
          <li key={it.id}>
            <button type="button" className="lab-sieve__grain" onClick={() => onPick?.(it.id)}>{it.label}</button>
          </li>
        ))}
      </ul>

      <svg key={q} viewBox="0 0 400 22" preserveAspectRatio="none" className="lab-sieve__mesh" aria-hidden="true">
        <InkFilters id={id} />
        <g filter={`url(#${id}-pen)`}>
          <path d="M2 4 Q200 1 398 4 M2 18 Q200 21 398 18" />
          {/* Malla de mimbre: hilos oblicuos espaciados, no una trama apretada. */}
          {Array.from({ length: 22 }, (_, i) => (
            <path key={i} d={`M${8 + i * 18} 4 Q${12 + i * 18} 11 ${17 + i * 18} 18 M${17 + i * 18} 4 Q${12 + i * 18} 11 ${8 + i * 18} 18`} strokeWidth="0.45" opacity="0.45" />
          ))}
        </g>
      </svg>

      <p className="lab-sieve__count" aria-live="polite">
        {kept.length} retenidos · {fell.length} cayeron
      </p>
      {fell.length > 0 && (
        <ul className="lab-sieve__fallen" aria-label={`Descartados: ${fell.length}`}>
          {fell.map((it) => (
            <li key={it.id}>
              <button type="button" className="lab-sieve__grain lab-sieve__grain--fallen" onClick={() => onPick?.(it.id)}>{it.label}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
