import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "../../lib/useReducedMotion";

/**
 * PROTOTIPO — Mapa de rosetas.
 *
 * Una interfaz sin botones. Lo que hay es un mapa de estados, como la hoja de las rosetas del Voynich (nueve
 * círculos unidos por calzadas): estás en un lugar, marcado con una ficha, y las acciones posibles son los
 * caminos que salen de él, con su nombre escrito a lo largo.
 *
 * - Calzada (doble línea): se puede volver.  Río (una línea que corre): no hay vuelta atrás.
 * - Lo que no se puede hacer desde aquí no está «desactivado»: simplemente no hay camino.
 * - Actuar es viajar: la ficha recorre el camino. Los caminos recorridos quedan más entintados (memoria).
 */
export interface Place {
  id: string;
  label: string;
  x: number;
  y: number;
}
export interface Way {
  from: string;
  to: string;
  /** El verbo: se escribe a lo largo del camino. */
  label: string;
  /** Río: solo de `from` a `to`. */
  oneWay?: boolean;
  /** Curvatura del camino (fracción de su largo; negativa = hacia el otro lado). @default 0.12 */
  bend?: number;
}
export interface RosetteMapProps {
  places: Place[];
  ways: Way[];
  /** Lugar actual (controlado). */
  at: string;
  /** Se llama al terminar el viaje. */
  onMove: (to: string, way: Way) => void;
  width: number;
  height: number;
  label: string;
  className?: string;
}

type Geo = { d: string; mid: { x: number; y: number }; labelD: string };

/** Camino curvo entre dos rosetas, recortado para que empiece y acabe en su borde. */
function geometry(a: Place, b: Place, bend = 0.12, r = 26): Geo {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const s = { x: a.x + ux * r, y: a.y + uy * r }, e = { x: b.x - ux * r, y: b.y - uy * r };
  const c = { x: (a.x + b.x) / 2 + nx * len * bend, y: (a.y + b.y) / 2 + ny * len * bend };
  const d = `M ${s.x} ${s.y} Q ${c.x} ${c.y} ${e.x} ${e.y}`;
  // El rótulo siempre se lee de izquierda a derecha.
  const labelD = s.x <= e.x ? d : `M ${e.x} ${e.y} Q ${c.x} ${c.y} ${s.x} ${s.y}`;
  return { d, mid: { x: (s.x + 2 * c.x + e.x) / 4, y: (s.y + 2 * c.y + e.y) / 4 }, labelD };
}

const wayKey = (w: Way) => `${w.from}>${w.to}`;

export function RosetteMap({ places, ways, at, onMove, width, height, label, className }: RosetteMapProps) {
  const uid = useId().replace(/:/g, "");
  const byId = useMemo(() => Object.fromEntries(places.map((p) => [p.id, p])), [places]);
  const reduced = useReducedMotion();
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const [token, setToken] = useState<{ x: number; y: number } | null>(null);
  const [travelling, setTravelling] = useState<string | null>(null);
  const [trodden, setTrodden] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<{ way: string; to: string } | null>(null);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Salidas desde aquí: los ríos solo en su sentido; las calzadas en los dos.
  const exits = ways.flatMap((w) => {
    if (w.from === at) return [{ way: w, to: w.to, reverse: false }];
    if (!w.oneWay && w.to === at) return [{ way: w, to: w.from, reverse: true }];
    return [];
  });
  const reachable = new Set(exits.map((x) => x.to));

  const travel = (exit: (typeof exits)[number]) => {
    if (travelling) return;
    const path = pathRefs.current[wayKey(exit.way)];
    const done = () => {
      setHover(null);
      setTravelling(null);
      setToken(null);
      setTrodden((t) => new Set(t).add(wayKey(exit.way)));
      onMove(exit.to, exit.way);
    };
    if (!path || reduced) return done();
    const total = path.getTotalLength();
    const ms = exit.way.oneWay ? 1100 : 700; // el agua lleva su tiempo
    const t0 = performance.now();
    setTravelling(wayKey(exit.way));
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const p = path.getPointAtLength(total * (exit.reverse ? 1 - e : e));
      setToken({ x: p.x, y: p.y });
      if (k < 1) raf.current = requestAnimationFrame(step);
      else done();
    };
    raf.current = requestAnimationFrame(step);
  };

  const here = byId[at];

  return (
    <figure className={["lab-map", className].filter(Boolean).join(" ")} aria-label={label}>
      <svg viewBox={`0 0 ${width} ${height}`} className="lab-map__svg" role="group" aria-label={label}>
        <defs>
          <filter id={`${uid}-pen`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="5" result="p" />
            <feDisplacementMap in="SourceGraphic" in2="p" scale="1.2" />
          </filter>
          <filter id={`${uid}-wash`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="9" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="7" />
          </filter>
        </defs>

        {/* Caminos */}
        <g filter={`url(#${uid}-pen)`}>
          {ways.map((w) => {
            const g = geometry(byId[w.from]!, byId[w.to]!, w.bend);
            const k = wayKey(w);
            const exit = exits.find((x) => x.way === w);
            return (
              <g
                key={k}
                className="lab-map__way"
                data-kind={w.oneWay ? "river" : "road"}
                data-exit={exit ? "" : undefined}
                data-trodden={trodden.has(k) || undefined}
                data-travelling={travelling === k || undefined}
                data-hover={hover?.way === k || undefined}
              >
                {w.oneWay ? (
                  <>
                    <path ref={(el) => void (pathRefs.current[k] = el)} d={g.d} className="lab-map__river" />
                    <path d={g.d} className="lab-map__current" />
                  </>
                ) : (
                  <>
                    <path ref={(el) => void (pathRefs.current[k] = el)} d={g.d} className="lab-map__road-edge" />
                    <path d={g.d} className="lab-map__road-bed" />
                  </>
                )}
                <path id={`${uid}-${k}`} d={g.labelD} fill="none" stroke="none" />
                <text className="lab-map__verb" dy={w.oneWay ? -7 : -8}>
                  <textPath href={`#${uid}-${k}`} startOffset="50%" textAnchor="middle">
                    {w.label}
                  </textPath>
                </text>
              </g>
            );
          })}
        </g>

        {/* Rosetas */}
        {places.map((p) => {
          const isHere = p.id === at;
          const can = reachable.has(p.id);
          return (
            <g key={p.id} className="lab-map__place" data-here={isHere || undefined} data-reachable={can || undefined} data-hover={hover?.to === p.id || undefined} transform={`translate(${p.x} ${p.y})`}>
              {isHere && <circle r="21" className="lab-map__wash" filter={`url(#${uid}-wash)`} />}
              <g filter={`url(#${uid}-pen)`}>
                <circle r="24" className="lab-map__ring" />
                <circle r="19" className="lab-map__ring lab-map__ring--inner" />
                {Array.from({ length: 8 }, (_, i) => {
                  const a = (i / 8) * Math.PI * 2;
                  return <path key={i} className="lab-map__petal" d={`M ${Math.cos(a) * 5} ${Math.sin(a) * 5} Q ${Math.cos(a + 0.35) * 13} ${Math.sin(a + 0.35) * 13} ${Math.cos(a) * 17} ${Math.sin(a) * 17} Q ${Math.cos(a - 0.35) * 13} ${Math.sin(a - 0.35) * 13} ${Math.cos(a) * 5} ${Math.sin(a) * 5}`} />;
                })}
              </g>
              <text y="42" className="lab-map__name">{p.label}</text>
            </g>
          );
        })}

        {/* La ficha: en el lugar actual, o viajando por un camino. */}
        {(token ?? (here && { x: here.x, y: here.y })) && (
          <g className="lab-map__token" transform={`translate(${(token ?? here!).x} ${(token ?? here!).y})`}>
            <circle r="6.5" />
            <circle r="2" cx="-1.8" cy="-1.8" className="lab-map__token-lit" />
          </g>
        )}

        {/* Zonas de acción: cada salida (camino + destino) es un control de teclado. */}
        {exits.map((x) => {
          const k = wayKey(x.way);
          const to = byId[x.to]!;
          const g = geometry(byId[x.way.from]!, byId[x.way.to]!, x.way.bend);
          const name = `${x.way.label}: ir a ${to.label}${x.way.oneWay ? ", sin vuelta atrás" : ""}`;
          return (
            <g
              key={`hit-${k}-${x.to}`}
              role="button"
              tabIndex={travelling ? -1 : 0}
              aria-label={name}
              className="lab-map__hit"
              data-for={k}
              onClick={() => travel(x)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  travel(x);
                }
              }}
              onPointerEnter={() => setHover({ way: k, to: x.to })}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover({ way: k, to: x.to })}
              onBlur={() => setHover(null)}
            >
              <path d={g.d} className="lab-map__hit-path" />
              <circle cx={to.x} cy={to.y} r="30" className="lab-map__hit-place" />
            </g>
          );
        })}
      </svg>
      <figcaption className="lab-map__caption" aria-live="polite">
        Ahora en <em>{here?.label}</em>
        {exits.length === 0 ? " · no salen caminos de aquí" : ""}
      </figcaption>
    </figure>
  );
}
