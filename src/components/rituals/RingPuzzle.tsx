import React, { createContext, forwardRef, useContext, useEffect, useId, useImperativeHandle, useState } from "react";
import { cn } from "../../lib/utils";
import { composeHandlers, composeRefs } from "../../lib/compose";
import {
  useRingPuzzle,
  type Ring,
  type RingBehaviorProps,
  type RingPuzzleRef,
  type RingPuzzleResult,
  type UseRingPuzzleOptions,
  type UseRingPuzzleReturn,
} from "./useRingPuzzle";

export type { Ring, RingPuzzleRef, RingPuzzleResult, UseRingPuzzleOptions, UseRingPuzzleReturn, RingBehaviorProps };
export { useRingPuzzle };

/* ───────────────────────── contexto ───────────────────────── */

interface PuzzleContextValue {
  puzzle: UseRingPuzzleReturn;
  size: number;
  solvedLabel: string;
  showCenterPivot: boolean;
  renderItem?: RingPuzzleProps["renderItem"];
}
const PuzzleContext = createContext<PuzzleContextValue | null>(null);

interface RingContextValue {
  ring: Ring;
  isLocked: boolean;
}
const RingContext = createContext<RingContextValue | null>(null);

function usePuzzleContext(part: string) {
  const ctx = useContext(PuzzleContext);
  if (!ctx) throw new Error(`<RingPuzzle.${part}> debe estar dentro de <RingPuzzle.Root>.`);
  return ctx;
}
function useRingContext(part: string) {
  const ctx = useContext(RingContext);
  if (!ctx) throw new Error(`<RingPuzzle.${part}> debe estar dentro de <RingPuzzle.Ring>.`);
  return ctx;
}

/* ───────────────────────── props ───────────────────────── */

/** Propiedades del puzzle. Además de estas, acepta cualquier atributo HTML de `div` (`id`, `style`, `data-*`…). */
export interface RingPuzzleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    UseRingPuzzleOptions {
  /** Nombre accesible del puzzle. @default "Puzzle de anillos" */
  label?: string;
  /** Mensaje anunciado a lectores de pantalla al resolver. @default "Puzzle resuelto" */
  solvedLabel?: string;
  /** Render prop opcional para controlar cómo se dibuja cada elemento (tooltips, 3D, condicionales extras). */
  renderItem?: (item: React.ReactNode, index: number, ring: Ring, isLocked: boolean) => React.ReactNode;
  /** Diámetro del puzzle en píxeles. @default 400 */
  size?: number;
  /** Muestra el pivote central. @default true */
  showCenterPivot?: boolean;
  /**
   * Si lo pasas, **sustituye la composición por defecto**: tú eliges qué partes van y en qué orden
   * (`RingPuzzle.Ring`, `RingPuzzle.Pivot`, `RingPuzzle.Glare`, `RingPuzzle.Status`).
   */
  children?: React.ReactNode;
}

/* ───────────────────────── Engraving ───────────────────────── */

/**
 * `RingPuzzle.Engraving`
 *
 * Grabado de precisión de un anillo: reglas concéntricas y graduación (una marca cada 2,5° y una larga
 * cada 15°), más texto diminuto opcional. Va dentro de un `RingPuzzle.Ring` y rota con él.
 * Toma sus medidas del anillo, pero puedes forzarlas con `radius`, `thickness` y `text`.
 */
const Engraving: React.FC<{ radius?: number; thickness?: number; text?: string | undefined; className?: string }> = ({
  radius: radiusProp,
  thickness: thicknessProp,
  text: textProp,
  className,
}) => {
  const ctx = useContext(RingContext);
  const radius = radiusProp ?? ctx?.ring.radius;
  const thickness = thicknessProp ?? ctx?.ring.thickness;
  const text = textProp ?? ctx?.ring.engraveText;
  const pathId = useId();
  if (radius === undefined || thickness === undefined) {
    throw new Error("<RingPuzzle.Engraving> necesita estar dentro de <RingPuzzle.Ring> o recibir `radius` y `thickness`.");
  }

  const size = radius * 2;
  const dashes = (r: number, count: number, w: number) => ({
    strokeDasharray: `${w} ${(2 * Math.PI * r) / count - w}`,
    strokeDashoffset: w / 2,
  });
  const showScale = thickness >= 26;
  const minorLen = 4;
  const majorLen = 8;
  const bandOuter = radius - 5;
  const rMinor = bandOuter - minorLen / 2;
  const rMajor = bandOuter - majorLen / 2;
  const innerScaleRule = bandOuter - majorLen - 2;
  const hasInnerEdge = thickness < radius - 2;

  return (
    <svg
      data-part="engraving"
      className={cn("voy-ring__engraving", className)}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      <circle cx={radius} cy={radius} r={radius - 2.5} strokeWidth={1.4} />
      {showScale && (
        <>
          <circle cx={radius} cy={radius} r={rMinor} strokeWidth={minorLen} {...dashes(rMinor, 144, 0.7)} opacity={0.85} />
          <circle cx={radius} cy={radius} r={rMajor} strokeWidth={majorLen} {...dashes(rMajor, 24, 1.3)} />
          <circle cx={radius} cy={radius} r={innerScaleRule} strokeWidth={0.8} opacity={0.9} />
        </>
      )}
      {hasInnerEdge && <circle cx={radius} cy={radius} r={radius - thickness + 2} strokeWidth={1.4} />}
      {text && thickness >= 40 && (() => {
        // El texto va pegado al borde interior, leyéndose en sentido horario.
        const tr = radius - thickness + 9;
        const circ = 2 * Math.PI * tr;
        const unit = `${text.trim()}  ·  `;
        const reps = Math.max(1, Math.round(circ / (unit.length * 5.6)));
        return (
          <>
            <path
              id={pathId}
              fill="none"
              stroke="none"
              d={`M ${radius} ${radius + tr} a ${tr} ${tr} 0 1 0 0 ${-2 * tr} a ${tr} ${tr} 0 1 0 0 ${2 * tr}`}
            />
            <text fill="currentColor" stroke="none" fontSize="6.2" letterSpacing="1.4" style={{ fontFamily: "var(--voynich-font-sc)" }} opacity={0.82}>
              <textPath href={`#${pathId}`} textLength={circ - 2} lengthAdjust="spacing">
                {unit.repeat(reps)}
              </textPath>
            </text>
          </>
        );
      })()}
    </svg>
  );
};
Engraving.displayName = "RingPuzzle.Engraving";

/* ───────────────────────── Dividers / Items ───────────────────────── */

/** `RingPuzzle.Dividers`: las rayas que separan los elementos de un anillo. */
const Dividers: React.FC<{ className?: string }> = ({ className }) => {
  const { ring } = useRingContext("Dividers");
  const items = ring.items ?? [];
  if (ring.hideDividers || items.length === 0) return null;
  const itemAngle = 360 / items.length;
  return (
    <>
      {items.map((_, i) => (
        <div
          key={`line-${i}`}
          data-part="divider"
          className={cn("voy-ring__divider absolute left-1/2 top-0 w-[2px] origin-bottom pointer-events-none", className)}
          style={{
            height: ring.thickness,
            transform: `translateX(-50%) rotate(${i * itemAngle}deg)`,
            transformOrigin: `50% ${ring.radius}px`,
          }}
        />
      ))}
    </>
  );
};
Dividers.displayName = "RingPuzzle.Dividers";

/** `RingPuzzle.Items`: los símbolos del anillo, repartidos por la circunferencia. */
const Items: React.FC<{ className?: string; renderItem?: RingPuzzleProps["renderItem"] }> = ({ className, renderItem }) => {
  const { ring, isLocked } = useRingContext("Items");
  const puzzleCtx = useContext(PuzzleContext);
  const render = renderItem ?? puzzleCtx?.renderItem;
  const items = ring.items ?? [];
  if (items.length === 0) return null;
  const itemAngle = 360 / items.length;
  return (
    <>
      {items.map((item, i) => (
        <div
          key={`item-${i}`}
          data-part="item"
          className={cn("absolute left-1/2 top-1/2 flex items-center justify-center pointer-events-none", className)}
          style={{
            transform: `translate(-50%, -50%) rotate(${i * itemAngle}deg) translateY(-${ring.radius - ring.thickness / 2}px)`,
            width: ring.thickness * 1.5,
            height: ring.thickness,
            textAlign: "center",
          }}
        >
          <div
            style={{
              transform: ring.itemOrientation === "upright" ? "rotate(0deg)" : "rotate(90deg)",
              opacity: isLocked ? 1 : 0.85,
              fontWeight: isLocked ? "bold" : "normal",
              fontSize: `${Math.min(ring.thickness * 0.48, 38)}px`,
            }}
          >
            {render ? render(item, i, ring, isLocked) : item}
          </div>
        </div>
      ))}
    </>
  );
};
Items.displayName = "RingPuzzle.Items";

/* ───────────────────────── Ring ───────────────────────── */

export interface RingPartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** El anillo que dibuja esta parte (su configuración y su estado). */
  ring: Ring;
  /**
   * Contenido del anillo. Si lo omites se dibuja lo de siempre (grabado, fondo, rayas y elementos);
   * si lo pasas, dibujas tú lo que quieras dentro de un anillo que ya gira, se arrastra y es accesible.
   */
  children?: React.ReactNode;
}

/**
 * `RingPuzzle.Ring`
 *
 * Un disco que gira. Trae todo el comportamiento (arrastre, inercia, teclado, aria) y deja el contenido
 * en tus manos. Va dentro de `RingPuzzle.Root`.
 */
const RingPart = forwardRef<HTMLDivElement, RingPartProps>(
  ({ ring, children, className, style, onPointerDown, onKeyDown, ...rest }, forwardedRef) => {
    const { puzzle, size } = usePuzzleContext("Ring");
    const { ref: behaviorRef, onPointerDown: bPointerDown, onKeyDown: bKeyDown, style: bStyle, ...behavior } = puzzle.getRingProps(ring);
    const index = puzzle.sortedRings.findIndex((r) => r.id === ring.id);
    const isLocked = Boolean(puzzle.locked[ring.id]);
    const ringSize = ring.radius * 2;

    return (
      <RingContext.Provider value={{ ring, isLocked }}>
        <div
          ref={composeRefs(behaviorRef, forwardedRef)}
          data-part="ring"
          data-ring-id={ring.id}
          {...behavior}
          onPointerDown={composeHandlers(onPointerDown, bPointerDown)}
          onKeyDown={composeHandlers(onKeyDown, bKeyDown)}
          className={cn(
            "absolute rounded-full overflow-hidden box-border voy-ring",
            isLocked ? "cursor-default" : "cursor-grab active:cursor-grabbing",
            ring.ringClassName,
            className,
          )}
          style={{
            ...bStyle,
            width: ringSize,
            height: ringSize,
            left: (size - ringSize) / 2,
            top: (size - ringSize) / 2,
            backgroundColor: ring.bgImage ? "transparent" : undefined,
            backgroundImage: ring.bgImage ? `url(${ring.bgImage})` : undefined,
            backgroundSize: "cover",
            zIndex: 10 + index,
            ...style,
          }}
          {...rest}
        >
          {children ?? (
            <>
              <Engraving />
              {ring.bgContent && <div className="absolute inset-0 w-full h-full pointer-events-none">{ring.bgContent}</div>}
              <Dividers />
              <Items />
            </>
          )}
        </div>
      </RingContext.Provider>
    );
  },
);
RingPart.displayName = "RingPuzzle.Ring";

/* ───────────────────────── Pivot / Glare / Status ───────────────────────── */

/** `RingPuzzle.Pivot`: el pivote central. */
const Pivot = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-part="pivot"
    aria-hidden="true"
    className={cn("voy-astrolabe__pivot absolute left-1/2 top-1/2 w-8 h-8 rounded-full -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none", className)}
    {...props}
  />
));
Pivot.displayName = "RingPuzzle.Pivot";

/** `RingPuzzle.Glare`: el resalte de luz que sigue al cursor sobre el metal. */
const Glare = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-part="glare" aria-hidden="true" className={cn("voy-astrolabe__glare", className)} {...props} />
));
Glare.displayName = "RingPuzzle.Glare";

/** `RingPuzzle.Status`: región en vivo que anuncia la resolución a los lectores de pantalla. */
const Status = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
  const { puzzle, solvedLabel } = usePuzzleContext("Status");
  return (
    <div ref={ref} data-part="status" role="status" aria-live="polite" className={cn("sr-only", className)} {...props}>
      {children ?? (puzzle.solved ? solvedLabel : "")}
    </div>
  );
});
Status.displayName = "RingPuzzle.Status";

/* ───────────────────────── Root ───────────────────────── */

/** Composición por defecto: pivote, todos los anillos, resalte y estado. */
const DefaultParts: React.FC = () => {
  const { puzzle, showCenterPivot } = usePuzzleContext("Root");
  return (
    <>
      {showCenterPivot && <Pivot />}
      {puzzle.sortedRings.map((ring) => (
        <RingPart key={ring.id} ring={ring} />
      ))}
      <Glare />
      <Status />
    </>
  );
};

/**
 * `RingPuzzle.Root`
 *
 * El contenedor y la mecánica. Sin hijos dibuja la composición por defecto; con hijos, tú decides
 * qué partes van dentro. Expone `ref` con las acciones imperativas (`reset`, `solve`…).
 *
 * En pantallas estrechas se encoge al ancho de su contenedor. Para eso el padre necesita un ancho propio
 * (un bloque, `w-full`…): si se ajusta al contenido, como el hijo de un `flex items-center`, no hay ancho
 * del que encogerse.
 *
 * Atributos de estilo: `data-solved` en la raíz, `data-locked` e `data-interactive` en cada anillo.
 */
const RingPuzzleRoot = forwardRef<RingPuzzleRef, RingPuzzleProps>(
  (
    {
      rings,
      onChange,
      onSolve,
      verify,
      motion = "auto",
      snapTolerance = 8,
      disabled = false,
      label = "Puzzle de anillos",
      solvedLabel = "Puzzle resuelto",
      renderItem,
      size = 400,
      showCenterPivot = true,
      className,
      style,
      children,
      onPointerMove,
      ...rest
    },
    ref,
  ) => {
    const puzzle = useRingPuzzle({ rings, onChange, onSolve, verify, motion, snapTolerance, disabled });
    useImperativeHandle(ref, () => puzzle.controls);

    const ctx: PuzzleContextValue = { puzzle, size, solvedLabel, showCenterPivot, ...(renderItem ? { renderItem } : {}) };

    // En un contenedor más estrecho que `size` (móvil), el astrolabio se encoge entero con `zoom`:
    // las partes siguen midiendo en px de `size` y el ángulo de arrastre no depende de la escala.
    const [fit, setFit] = useState(1);
    useEffect(() => {
      const parent = puzzle.containerRef.current?.parentElement;
      if (!parent || typeof ResizeObserver === "undefined") return;
      const ro = new ResizeObserver(([entry]) => {
        if (entry) setFit(Math.min(1, entry.contentRect.width / size));
      });
      ro.observe(parent);
      return () => ro.disconnect();
    }, [size, puzzle.containerRef]);

    return (
      <PuzzleContext.Provider value={ctx}>
        <div
          ref={puzzle.containerRef}
          data-part="root"
          data-solved={puzzle.solved ? "true" : "false"}
          role="group"
          aria-label={label}
          onPointerMove={composeHandlers(onPointerMove, (e: React.PointerEvent<HTMLDivElement>) => {
            // El resalte del metal sigue al cursor sin re-renderizar React.
            const r = e.currentTarget.getBoundingClientRect();
            const k = r.width ? size / r.width : 1; // de px de pantalla a px internos (con zoom)
            e.currentTarget.style.setProperty("--lx", `${(e.clientX - r.left) * k}px`);
            e.currentTarget.style.setProperty("--ly", `${(e.clientY - r.top) * k}px`);
          })}
          data-fit={fit < 1 ? "scaled" : undefined}
          className={cn("voy-astrolabe relative rounded-full flex items-center justify-center overflow-hidden select-none", className)}
          style={{ width: size, height: size, maxWidth: "100%", ...(fit < 1 && { zoom: fit }), ...style }}
          {...rest}
        >
          {children ?? <DefaultParts />}
        </div>
      </PuzzleContext.Provider>
    );
  },
);
RingPuzzleRoot.displayName = "RingPuzzle.Root";

/**
 * `RingPuzzle`
 *
 * Un puzzle de anillos concéntricos que se hacen girar hasta alinearlos. La composición por defecto es
 * un astrolabio de bronce; con las partes puedes dibujar cualquier otra cosa sobre la misma mecánica.
 *
 * @example Por defecto
 * <RingPuzzle rings={rings} onSolve={({ rotations }) => unlock(rotations)} />
 *
 * @example Tus propias partes
 * <RingPuzzle.Root rings={rings} size={360}>
 *   {rings.map((ring) => (
 *     <RingPuzzle.Ring key={ring.id} ring={ring}>
 *       <RingPuzzle.Engraving />
 *       <MiOrnamento />
 *     </RingPuzzle.Ring>
 *   ))}
 *   <RingPuzzle.Status />
 * </RingPuzzle.Root>
 *
 * @example Solo la mecánica (sin dibujo)
 * const puzzle = useRingPuzzle({ rings });
 */
export const RingPuzzle = Object.assign(RingPuzzleRoot, {
  Root: RingPuzzleRoot,
  Ring: RingPart,
  Engraving,
  Dividers,
  Items,
  Pivot,
  Glare,
  Status,
});
