import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export interface GlossOptions {
  /** Encabezado breve (opcional). */
  title?: React.ReactNode;
  /** El texto de la glosa. */
  text: React.ReactNode;
  /** `ink`: nota corriente. `rubric`: aviso, en la tinta roja de los copistas. @default "ink" */
  tone?: "ink" | "rubric";
  /** Milisegundos antes de retirarse sola; `0` la deja hasta que se retire a mano. @default 6000 */
  duration?: number;
}

interface GlossItem extends GlossOptions {
  id: string;
  closing: boolean;
}

interface GlossApi {
  /** Escribe una glosa y devuelve su id. */
  gloss: (options: GlossOptions) => string;
  /** Retira una glosa por su id. */
  dismiss: (id: string) => void;
}

const GlossContext = createContext<GlossApi | null>(null);

/** Escribe glosas desde cualquier parte de la app. Requiere un `GlossProvider` por encima. */
export function useGloss(): GlossApi {
  const api = useContext(GlossContext);
  if (!api) throw new Error("useGloss() debe usarse dentro de <GlossProvider>.");
  return api;
}

export interface GlossProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  tone?: "ink" | "rubric" | undefined;
  /** Si lo pasas, aparece el enlace «retirar». */
  onDismiss?: () => void;
}

/**
 * `Gloss`
 *
 * Una nota escrita por otra mano en el margen: un trozo de pergamino con el calderón (¶) en rúbrica.
 * Es la pieza visual; para mostrarlas como notificaciones usa `GlossProvider` y `useGloss()`.
 *
 * Anatomía: `data-part="root" | "mark" | "title" | "text" | "dismiss"`; `data-tone`.
 */
export const Gloss = React.forwardRef<HTMLDivElement, GlossProps>(
  ({ title, tone = "ink", onDismiss, className, children, ...props }, ref) => (
    <div ref={ref} data-part="root" data-tone={tone} className={cn("voy-gloss voy-slip", className)} {...props}>
      <span data-part="mark" className="voy-gloss__mark" aria-hidden="true">¶</span>
      <div className="voy-gloss__body">
        {title != null && <p data-part="title" className="voy-gloss__title">{title}</p>}
        <div data-part="text" className="voy-gloss__text">{children}</div>
      </div>
      {onDismiss && (
        <button type="button" data-part="dismiss" className="voy-gloss__dismiss" onClick={onDismiss} aria-label="Retirar la glosa">
          retirar
        </button>
      )}
    </div>
  ),
);
Gloss.displayName = "Gloss";

export interface GlossProviderProps {
  children: React.ReactNode;
  /** Cuántas glosas caben a la vez; la más antigua se retira. @default 3 */
  max?: number;
  /** Margen donde aparecen. @default "right" */
  side?: "right" | "left";
  /** Nombre del margen para lectores de pantalla. @default "Glosas" */
  label?: string;
}

/**
 * `GlossProvider`
 *
 * El margen donde aparecen las glosas. Se anuncian a los lectores de pantalla (`aria-live="polite"`), se
 * quedan quietas mientras el puntero o el foco están encima y se retiran solas al cabo de `duration`.
 */
export function GlossProvider({ children, max = 3, side = "right", label = "Glosas" }: GlossProviderProps) {
  const [items, setItems] = useState<GlossItem[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: string) => {
    // Primero se desvanece (data-closing); se quita del DOM al terminar la transición.
    setItems((list) => list.map((g) => (g.id === id ? { ...g, closing: true } : g)));
  }, []);

  const gloss = useCallback(
    (options: GlossOptions) => {
      const id = `gloss-${++seq.current}`;
      setItems((list) => {
        const open = list.filter((g) => !g.closing);
        const overflow = open.length >= max ? new Set(open.slice(0, open.length - max + 1).map((g) => g.id)) : null;
        return [...list.map((g) => (overflow?.has(g.id) ? { ...g, closing: true } : g)), { ...options, id, closing: false }];
      });
      return id;
    },
    [max],
  );

  const api = useMemo(() => ({ gloss, dismiss }), [gloss, dismiss]);
  const remove = (id: string) => setItems((list) => list.filter((g) => g.id !== id));

  return (
    <GlossContext.Provider value={api}>
      {children}
      <section aria-label={label} className="voy-gloss-margin" data-side={side}>
        <ol aria-live="polite" aria-relevant="additions" className="voy-gloss-margin__list">
          {items.map((g) => (
            <GlossEntry key={g.id} item={g} onDismiss={() => dismiss(g.id)} onGone={() => remove(g.id)} />
          ))}
        </ol>
      </section>
    </GlossContext.Provider>
  );
}

function GlossEntry({ item, onDismiss, onGone }: { item: GlossItem; onDismiss: () => void; onGone: () => void }) {
  const { duration = 6000, closing } = item;
  const [held, setHeld] = useState(false);
  // Los callbacks cambian en cada render del margen; por ref, añadir otra glosa no reinicia este reloj.
  const cb = useRef({ onDismiss, onGone });
  cb.current = { onDismiss, onGone };

  // Se retira sola, salvo mientras alguien la está leyendo (puntero o foco encima).
  useEffect(() => {
    if (closing || held || duration <= 0) return;
    const t = setTimeout(() => cb.current.onDismiss(), duration);
    return () => clearTimeout(t);
  }, [closing, held, duration]);

  // Sin transición (movimiento reducido o pestaña oculta) `transitionend` no llega: se quita igualmente.
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => cb.current.onGone(), 400);
    return () => clearTimeout(t);
  }, [closing]);

  return (
    <li
      className="voy-gloss-margin__item"
      data-closing={closing || undefined}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <Gloss title={item.title} tone={item.tone} onDismiss={onDismiss}>
        {item.text}
      </Gloss>
    </li>
  );
}
