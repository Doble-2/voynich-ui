import React, { useRef, useState, useImperativeHandle } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface StrikeButtonRef {
  /** Tacha el rótulo como si se hubiera pulsado. */
  strike: () => void;
  /** Vuelve al estado sin tachar. */
  reset: () => void;
  /** @deprecated Usa `strike()`. */
  sacrifice: () => void;
}

export interface StrikeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Rótulo del botón. @default "Confirmar" */
  label?: string;
  /**
   * Rótulo tras tachar. Si lo omites, el rótulo original queda tachado (como un renglón anulado);
   * si lo das, la pluma tacha y en su lugar se escribe este.
   */
  struckLabel?: string;
  /** Color de la tinta del tachón (`--voy-strike`). @default tinta ferrogálica */
  inkColor?: string;
  /** Duración del trazo de pluma (s). @default 0.45 */
  duration?: number;
  /** Permite deshacer el tachón con otro clic. @default false */
  resetable?: boolean;
  /** Se llama antes de tachar; `e.preventDefault()` lo cancela (p. ej., para pedir confirmación). */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Se llama una vez al tachar. */
  onStrike?: () => void;
  /** Se llama al deshacer (si `resetable`). */
  onReset?: () => void;
  /** @deprecated Usa `struckLabel`. */
  sacrificedLabel?: string;
  /** @deprecated Usa `inkColor`. */
  bloodColor?: string;
  /** @deprecated Usa `onStrike`. */
  onSacrifice?: () => void;
  /** @deprecated Ya no hay letras revueltas; se ignora. */
  scrambleDictionary?: string;
  /** @deprecated Ya no hay letras revueltas; se ignora. */
  scrambleSpeed?: number;
}

/**
 * `StrikeButton`
 *
 * Una acción que no se deshace: al pulsarlo, un trazo de pluma tacha el rótulo, como el escriba anula un
 * renglón. Es un `<button type="button">` real; tras tachar queda `aria-disabled` salvo que sea `resetable`.
 *
 * Anatomía: `data-part="root" | "label" | "stroke"`; estado en `data-struck`.
 */
export const StrikeButton = React.forwardRef<StrikeButtonRef, StrikeButtonProps>(
  (
    {
      className,
      label = "Confirmar",
      struckLabel,
      inkColor,
      duration = 0.45,
      resetable = false,
      onStrike,
      onReset,
      onClick,
      type,
      style,
      sacrificedLabel,
      bloodColor: _blood,
      onSacrifice,
      scrambleDictionary: _dict,
      scrambleSpeed: _speed,
      ...props
    },
    ref,
  ) => {
    const after = struckLabel ?? sacrificedLabel;
    const notify = onStrike ?? onSacrifice;
    const strokeRef = useRef<SVGPathElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [struck, setStruck] = useState(false);
    const [shown, setShown] = useState(label);
    const reduced = useReducedMotion();
    // Guardia síncrona: un doble clic rápido leería `struck` aún en falso y tacharía dos veces.
    const struckRef = useRef(false);
    const { contextSafe } = useGSAP();

    const strike = contextSafe(() => {
      if (struckRef.current) return;
      struckRef.current = true;
      setStruck(true);
      notify?.();
      const stroke = strokeRef.current;
      if (!stroke) return;
      const t = reduced ? 0 : duration;
      const tl = gsap.timeline();
      tl.fromTo(stroke, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: t, ease: "power2.inOut" });
      if (after) {
        // La corrección: el renglón tachado se retira y se escribe el nuevo.
        tl.to([stroke, labelRef.current], { opacity: 0, duration: reduced ? 0 : 0.18 }, `+=${reduced ? 0 : 0.15}`)
          .add(() => setShown(after))
          .to(labelRef.current, { opacity: 1, duration: reduced ? 0 : 0.25 });
      }
    });

    const reset = contextSafe(() => {
      struckRef.current = false;
      setStruck(false);
      setShown(label);
      gsap.set(strokeRef.current, { strokeDashoffset: 1, opacity: 1 });
      gsap.set(labelRef.current, { opacity: 1 });
      onReset?.();
    });

    useImperativeHandle(ref, () => ({ strike, reset, sacrifice: strike }));

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (struckRef.current) {
        if (resetable) reset();
        return;
      }
      onClick?.(e);
      if (e.defaultPrevented) return;
      strike();
    };

    const name = struck && after ? after : label;

    return (
      <button
        // Sin `type`, dentro de un <form> sería submit y tachar enviaría el formulario.
        type={type ?? "button"}
        data-part="root"
        data-struck={struck}
        onClick={handleClick}
        aria-label={name}
        aria-disabled={struck && !resetable ? true : undefined}
        className={cn(
          "voy-slip voy-strike relative px-7 py-3 rounded-[2px]",
          "outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4",
          struck && !resetable ? "cursor-default" : "cursor-pointer",
          className,
        )}
        style={{ ...(inkColor && { "--voy-strike": inkColor }), ...style } as React.CSSProperties}
        {...props}
      >
        <span ref={labelRef} data-part="label" aria-hidden="true" className="voy-label relative inline-block text-[1em]">
          {shown}
          {/* El tachón: un trazo de pluma algo ondulado, más grueso al centro, que cruza el rótulo. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-2 top-1/2 h-[0.6em] w-[calc(100%+1rem)] -translate-y-1/2 overflow-visible"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path
              ref={strokeRef}
              data-part="stroke"
              d="M1 6.2 C 18 4.6, 34 6.8, 52 5.1 S 84 4.2, 99 5.6"
              fill="none"
              stroke="var(--voy-strike, rgb(var(--voynich-ink)))"
              strokeWidth="1.6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          </svg>
        </span>
      </button>
    );
  },
);
StrikeButton.displayName = "StrikeButton";
