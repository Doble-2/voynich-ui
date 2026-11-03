import React, { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "../../lib/useReducedMotion";

/**
 * PROTOTIPO — «Vasos comunicantes».
 *
 * En el Voynich hay piscinas unidas por tubos. Aquí una acción es un trasvase: el botón es una pila conectada
 * a un depósito, y mantenerlo pulsado hace correr el líquido por el tubo hasta la marca. Al llegar, la acción
 * ocurre; si se suelta antes, el líquido vuelve al depósito y no pasa nada.
 *
 * El esfuerzo es proporcional a la consecuencia (`weight`): una acción leve se llena en un instante; una grave
 * pide sostener el gesto. Así no hacen falta diálogos de «¿Seguro?».
 */
export interface VesselButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** `leve` ≈ 0,35 s · `media` ≈ 0,9 s · `grave` ≈ 1,8 s de trasvase. @default "media" */
  weight?: "leve" | "media" | "grave";
  /** Se llama cuando el líquido llega a la marca. */
  onCommit?: () => void;
}

const DUR = { leve: 350, media: 900, grave: 1800 } as const;

export function VesselButton({ weight = "media", onCommit, children, disabled, ...props }: VesselButtonProps) {
  const [level, setLevel] = useState(0); // 0..1
  const [done, setDone] = useState(false);
  const holding = useRef(false);
  const raf = useRef(0);
  const last = useRef(0);
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const total = DUR[weight];

  // Un solo bucle: sube mientras se sostiene, baja (más despacio) al soltar. El nivel vive en un ref para
  // que el efecto (onCommit) no dependa de un actualizador de estado, que React puede ejecutar dos veces.
  const levelRef = useRef(0);
  const loop = (t: number) => {
    const dt = last.current ? t - last.current : 16;
    last.current = t;
    const l = levelRef.current;
    const next = holding.current ? Math.min(1, l + dt / total) : Math.max(0, l - dt / (total * 1.4));
    levelRef.current = next;
    setLevel(next);
    if (next >= 1 && holding.current) {
      holding.current = false;
      setDone(true);
      onCommit?.();
      setTimeout(() => setDone(false), 1100);
    }
    if ((holding.current && next < 1) || (!holding.current && next > 0)) raf.current = requestAnimationFrame(loop);
    else last.current = 0;
  };
  const start = () => {
    if (disabled || done) return;
    holding.current = true;
    cancelAnimationFrame(raf.current);
    last.current = 0;
    raf.current = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (!holding.current) return;
    holding.current = false;
    cancelAnimationFrame(raf.current);
    last.current = 0;
    raf.current = requestAnimationFrame(loop);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Geometría fija: depósito redondo a la izquierda, tubo doble, pila alargada con la marca.
  const tube = Math.min(1, level / 0.18); // el tubo se llena en el primer tramo
  const pool = Math.max(0, (level - 0.18) / 0.82);
  const poolTop = 14, poolBot = 76, mark = 22; // poolBot: bajo el fondo, así en reposo la pila está vacía
  const surface = poolBot - (poolBot - mark) * pool;
  const res = 1 - Math.min(1, level); // el depósito baja a medida que se trasvasa

  return (
    <button
      type="button"
      className="lab-vessel"
      data-weight={weight}
      data-done={done || undefined}
      disabled={disabled}
      aria-describedby={`${uid}-how`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        start();
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") stop();
      }}
      {...props}
    >
      <svg className="lab-vessel__svg" viewBox="0 0 260 72" aria-hidden="true">
        <defs>
          <clipPath id={`${uid}-pool`}>
            <path d="M70 16 C70 10 76 8 84 8 L236 8 C246 8 252 12 252 22 L252 50 C252 62 244 66 230 66 L92 66 C78 66 70 60 70 48 Z" />
          </clipPath>
          <clipPath id={`${uid}-res`}>
            <circle cx="26" cy="38" r="15" />
          </clipPath>
          <filter id={`${uid}-bleed`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="3" />
          </filter>
        </defs>

        {/* Depósito */}
        <rect x="8" y={23 + 30 * (1 - res)} width="36" height="30" clipPath={`url(#${uid}-res)`} className="lab-vessel__liquid" filter={`url(#${uid}-bleed)`} />
        <circle cx="26" cy="38" r="15" className="lab-vessel__line" />
        <path d="M18 23 L18 18 M34 23 L34 18" className="lab-vessel__line" />

        {/* Tubo: dos trazos paralelos; el líquido avanza por dentro. */}
        <path d="M41 40 C52 40 56 50 70 50" className="lab-vessel__line" />
        <path d="M41 46 C50 46 54 56 70 56" className="lab-vessel__line" />
        <path d="M41 43 C51 43 55 53 70 53" className="lab-vessel__flow" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - tube} />

        {/* Pila */}
        <rect x="70" y={reduced ? surface : surface - 1.5} width="190" height="70" clipPath={`url(#${uid}-pool)`} className="lab-vessel__liquid" filter={`url(#${uid}-bleed)`} />
        <path d="M70 16 C70 10 76 8 84 8 L236 8 C246 8 252 12 252 22 L252 50 C252 62 244 66 230 66 L92 66 C78 66 70 60 70 48 Z" className="lab-vessel__line" />
        {/* La marca de nivel: rayitas en el borde derecho. */}
        <path d={`M244 ${mark} L252 ${mark} M246 ${mark + 6} L252 ${mark + 6} M246 ${mark - 6} L252 ${mark - 6}`} className="lab-vessel__line lab-vessel__mark" />
        <path d={`M78 ${poolTop + 2} Q 80 ${poolTop - 2} 90 ${poolTop - 1}`} className="lab-vessel__line" opacity="0.4" />
      </svg>
      <span className="lab-vessel__label">{children}</span>
      <span id={`${uid}-how`} className="sr-only">
        Mantén pulsado (o mantén Espacio) hasta que se llene para confirmar.
      </span>
    </button>
  );
}
