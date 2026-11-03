import React, { useMemo } from "react";
import { cn } from "../../lib/utils";

export interface AstrolabeReteProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Radio total del disco que contiene el adorno (el lienzo SVG mide `radius * 2`).
   * Si lo usas como `bgContent` de un anillo, pasa el `radius` de ese anillo.
   */
  radius: number;
  /**
   * Radio del área ornamentada (el centro libre del anillo). Por defecto, el 45% de `radius`.
   */
  innerRadius?: number;
  /**
   * Número de pares de volutas alrededor del centro.
   * @default 8
   */
  petals?: number;
}

type Pt = [number, number];

/** Volutas en coordenadas locales: eje "arriba" (+y) hacia fuera, lado `side` (+1 | -1). */
function voluteCenterline(R: number, side: 1 | -1): Pt[] {
  const d = 0.17 * R; // radio de enrollamiento
  const rc = 0.58 * R; // altura del centro del rizo
  const rIn = 0.17 * R;
  const pts: Pt[] = [];
  // Tallo: sube por el eje hasta donde empieza el rizo.
  const stemSteps = 10;
  for (let i = 0; i <= stemSteps; i++) pts.push([0, rIn + ((rc - rIn) * i) / stemSteps]);
  // Rizo: espiral logarítmica que se cierra sobre sí misma, alejándose del eje.
  const turns = 2.35 * Math.PI;
  const steps = 46;
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * turns;
    const r = d * Math.exp(-0.2 * t);
    const phi = Math.PI - t; // arranca a la izquierda del centro y gira por arriba
    pts.push([side * (d + r * Math.cos(phi)), rc + r * Math.sin(phi)]);
  }
  return pts;
}

/** Convierte una línea central en un polígono con grosor decreciente (como un trazo de buril). */
function taperedOutline(center: Pt[], w0: number, w1: number): Pt[] {
  const n = center.length;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = center[Math.max(0, i - 1)]!;
    const b = center[Math.min(n - 1, i + 1)]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const t = i / (n - 1);
    const w = (w0 * Math.pow(1 - t, 0.85) + w1) / 2;
    const [x, y] = center[i]!;
    left.push([x + nx * w, y + ny * w]);
    right.push([x - nx * w, y - ny * w]);
  }
  return [...left, ...right.reverse()];
}

const toPath = (pts: Pt[]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${(-y).toFixed(2)}`).join("") + "Z";

/**
 * `AstrolabeRete`
 *
 * La "araña" calada de un astrolabio: pares de volutas con trazo de buril alrededor de un centro,
 * sobre una placa rehundida. Es decorativo (`aria-hidden`). Pensado como `bgContent` de un anillo
 * de `RingPuzzle`, pero funciona solo.
 */
export const AstrolabeRete: React.FC<AstrolabeReteProps> = ({
  radius,
  innerRadius,
  petals = 8,
  className,
  ...props
}) => {
  const R = innerRadius ?? radius * 0.45;

  const { scrolls, star } = useMemo(() => {
    const w0 = Math.max(1.6, R * 0.075);
    const outlines = (["+", "-"] as const).map((s) =>
      toPath(taperedOutline(voluteCenterline(R * 0.94, s === "+" ? 1 : -1), w0, 0.5)),
    );
    // Estrella de ocho puntas en el centro.
    const pts: Pt[] = [];
    for (let i = 0; i < 16; i++) {
      const rr = i % 2 ? R * 0.1 : R * 0.2;
      const a = (i * Math.PI) / 8;
      pts.push([rr * Math.sin(a), rr * Math.cos(a)]);
    }
    return { scrolls: outlines, star: toPath(pts) };
  }, [R]);

  const size = radius * 2;
  return (
    <svg
      viewBox={`${-radius} ${-radius} ${size} ${size}`}
      width="100%"
      height="100%"
      aria-hidden="true"
      className={cn("voy-rete", className)}
      {...props}
    >
      {/* Placa rehundida: lo que se ve "por debajo" de la filigrana calada. */}
      <circle r={R} className="voy-rete__recess" />
      <g className="voy-rete__metal">
        {Array.from({ length: petals }, (_, k) => (
          <g key={k} transform={`rotate(${(360 / petals) * k})`}>
            {scrolls.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        ))}
        <path d={star} />
        <circle r={R * 0.985} fill="none" strokeWidth={Math.max(1, R * 0.02)} />
      </g>
    </svg>
  );
};
AstrolabeRete.displayName = "AstrolabeRete";
