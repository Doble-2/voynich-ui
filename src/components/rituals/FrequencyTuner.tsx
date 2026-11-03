import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export interface FrequencyTunerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Valor mínimo de la escala. @default 0 */
  min?: number;
  /** Valor máximo de la escala. @default 100 */
  max?: number;
  /** Paso entre valores. @default 1 */
  step?: number;
  /** Valor inicial (o valor controlado). @default 50 */
  value?: number;
  /**
   * Valor en el que el instrumento queda "sintonizado". Por defecto, el punto medio de la escala.
   * @default (min + max) / 2
   */
  tunedValue?: number;
  /** Unidad que se muestra junto al valor. @default "°" (grados, como la alidada de un astrolabio) */
  unit?: string;
  /** Se llama cada vez que cambia el valor. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Se llama al entrar en la sintonía (no al montar, aunque el valor inicial ya esté sintonizado). */
  onTuned?: (value: number) => void;
}

/**
 * `FrequencyTuner`
 *
 * Una escala graduada de latón con una ventanilla deslizante: el sintonizador de un instrumento,
 * no un slider de interfaz. Bajo el latón hay un `<input type="range">` real, de modo que el teclado,
 * los lectores de pantalla y las props nativas (`aria-label`, `id`, `name`…) funcionan.
 * Al llegar al valor de sintonía, la lectura se tiñe de rúbrica.
 */
export const FrequencyTuner = React.forwardRef<HTMLInputElement, FrequencyTunerProps>(
  (
    { className, min = 0, max = 100, step = 1, value = 50, tunedValue, unit = "°", onChange, onTuned, ...props },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const readoutId = useId();

    // Si el valor llega de fuera (componente controlado), la escala lo sigue.
    useEffect(() => setInternalValue(value), [value]);

    const target = tunedValue ?? (min + max) / 2;
    const isTuned = Math.abs(internalValue - target) <= step / 2;
    const percentage = max === min ? 0 : ((internalValue - min) / (max - min)) * 100;

    // Solo la transición a "sintonizado" cuenta: el estado inicial no es un logro del usuario.
    const wasTuned = useRef(isTuned);
    useEffect(() => {
      if (isTuned && !wasTuned.current) onTuned?.(internalValue);
      wasTuned.current = isTuned;
    }, [isTuned, internalValue, onTuned]);

    return (
      <div className={cn("voy-tuner w-full", className)} data-part="root" data-tuned={isTuned}>
        <output
          id={readoutId}
          aria-live="polite"
          data-part="readout"
          className="voy-tuner__readout"
          style={{ left: `${percentage}%` }}
        >
          {isTuned ? "◆ " : ""}
          {internalValue.toFixed(1)}
          {unit}
        </output>
        <div className="voy-tuner__scale" data-part="scale" aria-hidden="true" />
        <div className="voy-tuner__thumb" data-part="thumb" aria-hidden="true" style={{ left: `${percentage}%` }} />
        <input
          ref={ref}
          data-part="input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          aria-valuetext={`${internalValue.toFixed(1)} ${unit}${isTuned ? ", sintonizado" : ""}`}
          className="voy-tuner__input"
          {...props}
          onChange={(e) => {
            setInternalValue(Number(e.target.value));
            onChange?.(e);
          }}
        />
      </div>
    );
  },
);
FrequencyTuner.displayName = "FrequencyTuner";
