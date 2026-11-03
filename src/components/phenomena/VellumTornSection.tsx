import React, { useMemo } from "react";
import { cn } from "../../lib/utils";

export interface VellumTornSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Contenido de la sección. */
  children?: React.ReactNode;
  /**
   * Color base del pergamino. Si se omite se usa el papel del sistema (con fibra y relieve).
   */
  color?: string;
  /**
   * Rasga el borde superior.
   * @default true
   */
  topTorn?: boolean;
  /**
   * Rasga el borde inferior.
   * @default true
   */
  bottomTorn?: boolean;
  /**
   * Profundidad máxima del rasgado, en píxeles.
   * @default 15
   */
  tearIntensity?: number;
  /**
   * Color del texto. Por defecto, tinta ferrogálica.
   */
  textColor?: string;
  /** Semilla del rasgado: la misma semilla da siempre el mismo borde (apto para SSR). @default 7 */
  seed?: number;
  /** @deprecated El relieve del papel ya lo aporta la superficie iluminada. Se ignora. */
  noiseOpacity?: number;
  /** @deprecated El borde ya no se anima (un pergamino rasgado no respira). Se ignora. */
  animationSpeed?: number;
}

/** Generador pseudoaleatorio determinista (Park–Miller). */
const makeRng = (seed: number) => {
  let s = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

/**
 * Contorno rasgado como `clip-path`. Cada borde rasgado se desvía entre 0 y `depth` píxeles con
 * dientes irregulares; los bordes sin rasgar son rectos.
 */
const tornPolygon = (rng: () => number, depth: number, top: boolean, bottom: boolean, inset: number) => {
  const steps = 56;
  const jag = (i: number) => {
    // Dientes de dos escalas: una ondulación lenta y una irregularidad fina.
    const slow = Math.sin(i * 0.37 + rng() * 0.6) * 0.5 + 0.5;
    return (slow * 0.65 + rng() * 0.35) * depth + inset;
  };
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) pts.push(`${((i / steps) * 100).toFixed(2)}% ${top ? jag(i).toFixed(1) : inset}px`);
  for (let i = steps; i >= 0; i--) {
    pts.push(`${((i / steps) * 100).toFixed(2)}% calc(100% - ${bottom ? jag(i).toFixed(1) : inset}px)`);
  }
  return `polygon(${pts.join(",")})`;
};

/**
 * `VellumTornSection`
 *
 * Una sección de pergamino con los bordes rasgados a mano. El rasgado deja ver una franja de fibra
 * clara bajo el papel, como en un trozo arrancado de un códice, y proyecta sombra sobre la mesa.
 */
export const VellumTornSection = React.forwardRef<HTMLDivElement, VellumTornSectionProps>(
  (
    {
      className,
      children,
      color,
      topTorn = true,
      bottomTorn = true,
      tearIntensity = 15,
      textColor,
      seed = 7,
      noiseOpacity: _noiseOpacity,
      animationSpeed: _animationSpeed,
      style,
      ...props
    },
    ref,
  ) => {
    const { paper, fibre } = useMemo(
      () => ({
        paper: tornPolygon(makeRng(seed), tearIntensity, topTorn, bottomTorn, tearIntensity * 0.35),
        // Franja de fibra: otro rasgado, algo más adentrado y de otro azar.
        fibre: tornPolygon(makeRng(seed + 101), tearIntensity, topTorn, bottomTorn, tearIntensity * 0.12),
      }),
      [seed, tearIntensity, topTorn, bottomTorn],
    );

    return (
      <div
        ref={ref}
        className={cn("relative w-full my-12", className)}
        style={{
          // La sombra va fuera del recorte: así sigue el contorno rasgado.
          filter: "drop-shadow(2px 4px 3px rgb(0 0 0 / 0.35)) drop-shadow(10px 20px 18px rgb(0 0 0 / 0.35))",
          ...style,
        }}
        {...props}
      >
        {/* Fibra clara del desgarro, asomando bajo el papel. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ clipPath: fibre, backgroundColor: "rgb(244 237 220)" }}
        />
        <div
          className="voy-paper relative"
          style={{
            clipPath: paper,
            ...(color ? { backgroundColor: color } : {}),
            boxShadow: "inset 0 0 60px rgb(140 96 44 / 0.28)",
          }}
        >
          <div
            className="relative z-20 text-lg leading-relaxed"
            style={{
              padding: `${tearIntensity + 28}px 3rem ${tearIntensity + 28}px`,
              fontFamily: "var(--voynich-font-body)",
              color: textColor ?? "rgb(var(--voynich-ink))",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
VellumTornSection.displayName = "VellumTornSection";
