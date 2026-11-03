import React, { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../rituals/Button";
import { useReducedMotion } from "../../lib/useReducedMotion";

/** Foliación de los manuscritos: cada hoja tiene recto (r) y verso (v). 0 → 1r, 1 → 1v, 2 → 2r… */
export const folioOf = (index: number) => `${Math.floor(index / 2) + 1}${index % 2 ? "v" : "r"}`;

export interface CodexProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Cada hijo es una página. */
  children: React.ReactNode;
  /** Página visible (controlado), desde 0. */
  page?: number;
  /** Página inicial si no lo controlas. @default 0 */
  defaultPage?: number;
  /** Se llama con el índice de la nueva página. */
  onPageChange?: (page: number) => void;
  /** Cómo se numera cada página. @default recto/verso: 1r, 1v, 2r… */
  foliation?: (index: number) => string;
  /** Nombre del códice para lectores de pantalla. @default "Códice" */
  label?: string;
  /** `auto` respeta `prefers-reduced-motion`; `none` cambia de página sin girar la hoja. @default "auto" */
  motion?: "auto" | "none";
}

type Turn = { from: number; dir: "next" | "prev"; key: number };

/**
 * `Codex`
 *
 * Un lector de páginas: la hoja gira sobre el lomo al pasar de folio. El borde de las hojas crece o mengua
 * según lo leído y lo que falta, como en un libro. Se maneja con los botones, con las flechas ← → (cuando el
 * foco está dentro) y deslizando el dedo.
 *
 * Anatomía: `data-part="root" | "book" | "page" | "turning" | "nav" | "prev" | "folio" | "next"`.
 */
export const Codex = React.forwardRef<HTMLElement, CodexProps>(
  (
    { children, page, defaultPage = 0, onPageChange, foliation = folioOf, label = "Códice", motion = "auto", className, onKeyDown, ...props },
    ref,
  ) => {
    const pages = React.Children.toArray(children);
    const last = Math.max(0, pages.length - 1);
    const [internal, setInternal] = useState(defaultPage);
    const isControlled = page !== undefined;
    const index = Math.min(last, Math.max(0, isControlled ? page : internal));
    const systemReduced = useReducedMotion();
    const reduced = motion === "none" || systemReduced;
    const [turn, setTurn] = useState<Turn | null>(null);
    const swipeX = useRef<number | null>(null);
    const seq = useRef(0);

    const go = (next: number) => {
      const target = Math.min(last, Math.max(0, next));
      if (target === index) return;
      if (!reduced) setTurn({ from: index, dir: target > index ? "next" : "prev", key: ++seq.current });
      if (!isControlled) setInternal(target);
      onPageChange?.(target);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      // No robar las flechas a un campo de texto dentro de la página.
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else return;
      e.preventDefault();
    };

    // Borde de hojas a cada lado: más grueso cuantas más hojas quedan (máx. 8 px).
    const leaves = (n: number) => `${Math.min(8, Math.ceil(n / 2))}px`;

    return (
      <section
        ref={ref}
        aria-roledescription="códice"
        aria-label={label}
        data-part="root"
        className={cn("voy-codex", className)}
        onKeyDown={handleKeyDown}
        onPointerDown={(e) => {
          if (e.pointerType === "touch") swipeX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipeX.current === null) return;
          const dx = e.clientX - swipeX.current;
          swipeX.current = null;
          if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
        }}
        {...props}
      >
        <div
          data-part="book"
          className="voy-codex__book"
          style={{ "--voy-leaves-read": leaves(index), "--voy-leaves-left": leaves(last - index) } as React.CSSProperties}
        >
          <div key={index} data-part="page" className="voy-codex__page voy-surface" data-material="paper" data-elevation="1">
            {pages[index]}
          </div>
          {turn && (
            <div
              key={turn.key}
              data-part="turning"
              data-dir={turn.dir}
              aria-hidden="true"
              className="voy-codex__page voy-codex__turning voy-surface"
              data-material="paper"
              onAnimationEnd={() => setTurn((t) => (t?.key === turn.key ? null : t))}
            >
              {pages[turn.from]}
            </div>
          )}
        </div>

        <nav data-part="nav" className="voy-codex__nav" aria-label={`${label}: páginas`}>
          <Button data-part="prev" variant="outline" size="sm" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Folio anterior">
            ‹ anterior
          </Button>
          <span data-part="folio" className="voy-codex__folio" aria-live="polite">
            <span className="voy-codex__folio-mark">f.</span> {foliation(index)}
            <span className="sr-only">
              , página {index + 1} de {pages.length}
            </span>
          </span>
          <Button data-part="next" variant="outline" size="sm" onClick={() => go(index + 1)} disabled={index === last} aria-label="Folio siguiente">
            siguiente ›
          </Button>
        </nav>
      </section>
    );
  },
);
Codex.displayName = "Codex";
