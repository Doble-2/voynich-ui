import React, { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface ScribeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Marca el campo como inválido (rúbrica, `aria-invalid`). */
  error?: boolean;
  /** Rótulo en versalitas sobre la línea. Se asocia al campo para lectores de pantalla. */
  label?: string;
  /** Color de las motas de pan de oro al escribir. Por defecto, oro claro. */
  sparkColor?: string;
  /** Color del texto. Por defecto hereda del contexto. */
  textColor?: string;
  /** Color de la línea en estado de error. */
  errorColor?: string;
  /** @deprecated Ya no hay resplandor: la línea de escriba no brilla. Se ignora. */
  glowColor?: string;
  /** @deprecated El campo es transparente sobre cualquier superficie. Se ignora. */
  bgColor?: string;
}

/**
 * `ScribeInput`
 *
 * La línea sobre la que escribe un escriba: texto sobre una regla de tinta que se engrosa al enfocar.
 * Cada pulsación desprende una mota de pan de oro que asciende y se apaga (sin sacudir el campo).
 */
export const ScribeInput = React.forwardRef<HTMLInputElement, ScribeInputProps>(
  (
    {
      className,
      error,
      label,
      sparkColor,
      textColor,
      errorColor,
      glowColor: _glow,
      bgColor: _bg,
      onChange,
      id,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const containerRef = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    const emitFleck = () => {
      const container = containerRef.current;
      if (!container || reduced) return;
      const fleck = document.createElement("span");
      fleck.className = "voy-scribe__fleck";
      if (sparkColor) fleck.style.background = sparkColor;
      fleck.style.left = `${8 + Math.random() * 84}%`;
      container.appendChild(fleck);
      gsap.to(fleck, {
        y: -26 - Math.random() * 18,
        x: (Math.random() - 0.5) * 14,
        opacity: 0,
        scale: 0.4,
        duration: 0.9 + Math.random() * 0.6,
        ease: "power2.out",
        onComplete: () => fleck.remove(),
      });
    };

    // Limpieza si el componente se desmonta con motas en vuelo.
    useGSAP(() => () => {
      containerRef.current?.querySelectorAll(".voy-scribe__fleck").forEach((n) => n.remove());
    }, { scope: containerRef });

    return (
      <div ref={containerRef} className="voy-scribe">
        {label && (
          <label htmlFor={inputId} className="voy-scribe__label">
            {label}
          </label>
        )}
        <input
          ref={forwardedRef}
          id={inputId}
          aria-invalid={error || undefined}
          className={cn("voy-scribe__input", className)}
          style={{
            ...(textColor ? { color: textColor } : {}),
            ...(error && errorColor ? { backgroundImage: `linear-gradient(${errorColor}, ${errorColor})` } : {}),
            ...style,
          }}
          onChange={(e) => {
            emitFleck();
            onChange?.(e);
          }}
          {...props}
        />
      </div>
    );
  },
);
ScribeInput.displayName = "ScribeInput";
