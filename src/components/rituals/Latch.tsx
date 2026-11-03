import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { composeHandlers } from "../../lib/compose";

export interface LatchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Estado controlado: `true` = pestillo echado. */
  checked?: boolean;
  /** Estado inicial si no lo controlas. @default false */
  defaultChecked?: boolean;
  /** Se llama con el nuevo estado al accionar el pestillo. */
  onCheckedChange?: (checked: boolean) => void;
  /** `none` mueve el cerrojo sin recorrido (también lo hace `prefers-reduced-motion`). @default "auto" */
  motion?: "auto" | "none";
  /** Rótulo junto al pestillo. Es el nombre accesible del interruptor. */
  children?: React.ReactNode;
}

/**
 * `Latch`
 *
 * Un interruptor de sí/no: un pestillo de latón con un cerrojo que corre por su ranura. Echado, el cerrojo
 * cambia de material (latón → pan de oro); no se enciende ninguna luz. Es un `<button role="switch">` real:
 * funciona con Espacio y Enter y anuncia su estado.
 *
 * Anatomía: `data-part="root" | "plate" | "bolt" | "label"`; estado en `data-state="on" | "off"`.
 * Variables: `--voy-latch-plate` y `--voy-latch-bolt` (colores base del latón y del cerrojo echado).
 */
export const Latch = React.forwardRef<HTMLButtonElement, LatchProps>(
  ({ checked, defaultChecked = false, onCheckedChange, motion = "auto", className, children, onClick, type, ...props }, ref) => {
    const [internal, setInternal] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const on = isControlled ? checked : internal;

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        role="switch"
        aria-checked={on}
        data-part="root"
        data-state={on ? "on" : "off"}
        data-motion={motion === "none" ? "none" : undefined}
        className={cn("voy-latch", className)}
        onClick={composeHandlers(onClick, () => {
          if (!isControlled) setInternal(!on);
          onCheckedChange?.(!on);
        })}
        {...props}
      >
        <span data-part="plate" className="voy-latch__plate" aria-hidden="true">
          <span data-part="bolt" className="voy-latch__bolt" />
        </span>
        {children != null && (
          <span data-part="label" className="voy-latch__label">
            {children}
          </span>
        )}
      </button>
    );
  },
);
Latch.displayName = "Latch";
