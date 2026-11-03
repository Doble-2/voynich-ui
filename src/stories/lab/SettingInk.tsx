import React, { useEffect, useId, useState } from "react";

/**
 * PROTOTIPO — Tinta que fragua (saber si un valor es válido).
 *
 * Hoy, un campo inválido se pone rojo y suelta un mensaje. Aquí el estado es el material de lo escrito: mientras
 * escribes, la tinta está fresca (brilla); al detenerte, si el valor es bueno, fragua (se asienta, mate y más
 * oscura). Si no, no llega a secar: se corre en una mancha bajo la palabra y aparece la corrección al margen,
 * en rúbrica, como la haría un corrector del scriptorium.
 */
export interface SettingInkProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Devuelve el motivo si el valor no vale, o `null` si vale. */
  validate: (value: string) => string | null;
  /** Cuánto esperar sin teclear para juzgar (ms). @default 700 */
  settle?: number;
}

export function SettingInk({ label, value, onChange, validate, settle = 700, ...props }: SettingInkProps) {
  const id = useId();
  const [phase, setPhase] = useState<"empty" | "wet" | "set" | "blot">(value ? "wet" : "empty");
  const [why, setWhy] = useState<string | null>(null);

  useEffect(() => {
    if (!value) return setPhase("empty");
    setPhase("wet");
    const t = setTimeout(() => {
      const problem = validate(value);
      setWhy(problem);
      setPhase(problem ? "blot" : "set");
    }, settle);
    return () => clearTimeout(t);
  }, [value, validate, settle]);

  return (
    <div className="lab-ink" data-phase={phase}>
      <label htmlFor={id} className="lab-ink__label">{label}</label>
      <div className="lab-ink__line" style={{ "--len": value.length } as React.CSSProperties}>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={phase === "blot" || undefined}
          aria-describedby={`${id}-note`}
          className="lab-ink__input"
          autoComplete="off"
          spellCheck={false}
          {...props}
        />
        <span className="lab-ink__blot" aria-hidden="true" />
      </div>
      {/* La corrección al margen; también es lo que oyen los lectores de pantalla. */}
      <p id={`${id}-note`} className="lab-ink__note" aria-live="polite">
        {phase === "blot" ? <><span className="lab-ink__mark" aria-hidden="true">¶</span> {why}</> : phase === "set" ? <span className="sr-only">Válido.</span> : null}
      </p>
    </div>
  );
}
