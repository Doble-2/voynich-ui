import React, { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../lib/useReducedMotion";

/**
 * PROTOTIPO — «Signo incompleto».
 *
 * El botón es un glifo de un alfabeto desconocido al que le falta un trazo. Lo incompleto invita a cerrarlo
 * (cierre gestáltico): esa es la señal de que se puede accionar, no un relieve. Al pasar por encima aparece
 * el fantasma del trazo, punteado como las guías que el escriba pinchaba; al pulsar se traza y el signo queda
 * cerrado, con una aguada verde dentro. El hueco crece con la gravedad de la acción.
 *
 * El contorno no es un rectángulo: sube a la izquierda en un asta alta con lazo, como los glifos «horca»
 * del Voynich (EVA k, t, p, f).
 */
export interface SignButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Cuánto falta del signo: `leve` (un hueco pequeño) o `grave` (falta casi un lado). @default "leve" */
  weight?: "leve" | "grave";
  /** Si es un interruptor: el signo queda cerrado hasta volver a pulsar. */
  toggle?: boolean;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const INK = "rgb(var(--voynich-ink))";

export function SignButton({ weight = "leve", toggle, pressed, onPressedChange, children, onClick, style, ...props }: SignButtonProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ w: 120, h: 40 });
  const [internal, setInternal] = useState(false);
  const [flash, setFlash] = useState(false);
  const reduced = useReducedMotion();
  const closed = toggle ? (pressed ?? internal) : flash;

  useLayoutEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Geometría: caja del rótulo y, sobre el borde superior, un glifo «horca»: dos astas unidas por un arco
  // con un rizo, como las letras altas del Voynich (EVA k/t). No es un adorno: es lo que hace del contorno un
  // signo de un alfabeto desconocido y no un rectángulo.
  const px = 24, py = 12, stem = 30;
  const W = size.w + px * 2, H = size.h + py * 2;
  const x0 = 6, y0 = stem + 8, x1 = x0 + W, y1 = y0 + H;
  const gap = weight === "grave" ? Math.min(W * 0.55, 120) : Math.min(W * 0.2, 36);
  const gx0 = x1 - 16 - gap, gx1 = x1 - 16;
  const a = x0 + 18, b = x0 + 40; // las dos astas
  const body = [
    `M ${gx1} ${y1}`,
    `C ${x1 - 4} ${y1 + 1} ${x1 + 1} ${y1 - 6} ${x1} ${y1 - 14}`,
    `L ${x1 - 1} ${y0 + 12}`,
    `C ${x1 - 1} ${y0 + 2} ${x1 - 8} ${y0} ${x1 - 16} ${y0 + 1}`,
    `L ${b} ${y0}`,
    // asta derecha, arco con rizo, asta izquierda
    `C ${b + 1} ${y0 - 10} ${b - 1} ${y0 - stem + 8} ${b} ${y0 - stem + 2}`,
    `C ${b} ${y0 - stem - 8} ${a + 2} ${y0 - stem - 9} ${a + 4} ${y0 - stem + 1}`,
    `C ${a + 5} ${y0 - stem + 7} ${a + 14} ${y0 - stem + 6} ${a + 12} ${y0 - stem}`,
    `M ${a + 4} ${y0 - stem + 1}`,
    `C ${a + 2} ${y0 - 16} ${a - 2} ${y0 - 6} ${a} ${y0}`,
    `L ${x0 + 10} ${y0 + 1}`,
    `C ${x0 + 2} ${y0 + 2} ${x0} ${y0 + 8} ${x0 + 1} ${y0 + 14}`,
    `L ${x0 - 1} ${y1 - 12}`,
    `C ${x0 - 1} ${y1 - 2} ${x0 + 6} ${y1 + 1} ${x0 + 16} ${y1}`,
    `L ${gx0} ${y1}`,
  ].join(" ");
  const missing = `M ${gx0} ${y1} C ${gx0 + gap * 0.3} ${y1 + 2.5} ${gx0 + gap * 0.7} ${y1 - 2} ${gx1} ${y1}`;
  // La aguada no rellena el contorno: es una mancha algo menor, que el filtro deja sangrar.
  const fill = `M ${x0 + 8} ${y0 + 7} C ${x0 + W * 0.4} ${y0 + 4} ${x1 - 30} ${y0 + 8} ${x1 - 7} ${y0 + 6} L ${x1 - 8} ${y1 - 7} C ${x1 - W * 0.4} ${y1 - 4} ${x0 + 30} ${y1 - 9} ${x0 + 7} ${y1 - 6} Z`;
  const uid = React.useId().replace(/:/g, "");

  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (toggle) {
      const next = !closed;
      if (pressed === undefined) setInternal(next);
      onPressedChange?.(next);
    } else {
      setFlash(true);
      setTimeout(() => setFlash(false), reduced ? 300 : 900);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={toggle ? closed : undefined}
      data-closed={closed}
      data-weight={weight}
      className="lab-sign"
      style={{ width: x1 + 10, height: y1 + 8, ...style }}
      onClick={handle}
      {...props}
    >
      <svg className="lab-sign__svg" width={x1 + 10} height={y1 + 8} aria-hidden="true">
        <defs>
          <filter id={`${uid}-bleed`} x="-10%" y="-20%" width="120%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed="3" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="6" />
          </filter>
          <filter id={`${uid}-pen`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="7" result="p" />
            <feDisplacementMap in="SourceGraphic" in2="p" scale="1.1" />
          </filter>
        </defs>
        <path d={fill} className="lab-sign__wash" filter={`url(#${uid}-bleed)`} />
        <g filter={`url(#${uid}-pen)`}>
          {/* Dos pasadas desplazadas: el trazo de una pluma, más cargado en un lado. */}
          <path d={body} fill="none" stroke={INK} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          <path d={body} fill="none" stroke={INK} strokeWidth="0.6" strokeLinecap="round" opacity="0.6" transform="translate(0.7 0.5)" />
        </g>
        {/* Guía pinchada: el fantasma del trazo que falta. */}
        <path d={missing} className="lab-sign__ghost" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="1 5" strokeLinecap="round" />
        <path d={missing} className="lab-sign__stroke" pathLength={1} fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span ref={labelRef} className="lab-sign__label" style={{ left: x0 + px, top: y0 + py }}>
        {children}
      </span>
    </button>
  );
}
