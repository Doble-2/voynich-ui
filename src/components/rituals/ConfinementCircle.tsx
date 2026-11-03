import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { cn } from "../../lib/utils";
import { composeHandlers, composeRefs } from "../../lib/compose";
import { createPartsContext } from "../../lib/context";
import { Button } from "./Button";
import { useConfinementCircle, type UseConfinementCircleOptions } from "./useConfinementCircle";

export { useConfinementCircle };
export type { UseConfinementCircleOptions };

/** Generador pseudoaleatorio determinista: mismas runas en servidor y cliente (sin errores de hidratación). */
const seeded = (seed: number) => {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

interface CircleContext {
  api: ReturnType<typeof useConfinementCircle>;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (() => void) | undefined;
}
const [CircleProvider, useCircle] = createPartsContext<CircleContext>("ConfinementCircle");

/* ───────────────────────── props ───────────────────────── */

export interface ConfinementCircleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Si el diálogo está abierto. */
  isOpen: boolean;
  /** Se llama al rechazar, pulsar Escape o hacer clic fuera del disco. */
  onClose: () => void;
  /** Se llama al confirmar. */
  onConfirm?: () => void;
  /**
   * Título del diálogo (nombre accesible).
   * @default "Aviso Crucial"
   */
  title?: string;
  /** @default "Rechazar" */
  dismissLabel?: string;
  /** @default "Asimilar" */
  confirmLabel?: string;
  /** `auto` respeta `prefers-reduced-motion`. @default "auto" */
  motion?: "auto" | "none";
  /** Contenido del diálogo (el cuerpo). Para recomponer el diálogo entero usa `ConfinementCircle.Root`. */
  children?: React.ReactNode;
}

/* ───────────────────────── Overlay ───────────────────────── */

/** `ConfinementCircle.Overlay`: el fondo que oscurece la pantalla. Se cierra al hacer clic en él. */
const Overlay = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, onMouseDown, children, ...props }, ref) => {
    const { api } = useCircle("Overlay");
    const { ref: overlayRef, onMouseDown: close, style: baseStyle, ...rest } = api.getOverlayProps();
    return (
      <div
        ref={composeRefs(overlayRef, ref)}
        data-part="overlay"
        {...rest}
        onMouseDown={composeHandlers(onMouseDown, close)}
        className={cn("fixed inset-0 z-50 flex items-center justify-center p-4", className)}
        style={{
          background: "radial-gradient(circle at center, rgba(14,9,5,0.72) 0%, rgba(2,3,4,0.94) 100%)",
          backdropFilter: "blur(5px)",
          ...baseStyle,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Overlay.displayName = "ConfinementCircle.Overlay";

/* ───────────────────────── Dialog ───────────────────────── */

/** `ConfinementCircle.Dialog`: el disco de pergamino que es el diálogo. Trae el rol, el foco y la accesibilidad. */
const Dialog = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, children, ...props }, ref) => {
  const { api } = useCircle("Dialog");
  const { ref: dialogRef, ...aria } = api.getDialogProps();
  return (
    <div
      ref={composeRefs(dialogRef, ref)}
      data-part="dialog"
      {...aria}
      className={cn("voy-paper relative w-full max-w-[540px] aspect-square flex items-center justify-center rounded-full outline-none", className)}
      style={{
        boxShadow:
          "inset 0 0 80px rgb(140 96 44 / 0.4), inset 2px 2px 0 rgb(255 250 235 / 0.5), 0 0 0 2px rgb(var(--voynich-ink-deep)), 0 0 0 6px rgb(var(--voynich-void)), 0 0 0 7px rgb(var(--voynich-brass) / 0.7), 14px 30px 50px rgb(0 0 0 / 0.6)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
Dialog.displayName = "ConfinementCircle.Dialog";

/* ───────────────────────── Diagram ───────────────────────── */

/**
 * `ConfinementCircle.Diagram`: el círculo grabado en tinta (reglas, graduación y dos anillos de glifos que
 * giran muy despacio). Decorativo. Quítalo, o dibuja el tuyo.
 */
const Diagram = forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>(({ className, ...props }, ref) => {
  const { api, isOpen } = useCircle("Diagram");
  const runesRef = useRef<SVGGElement>(null);
  const innerRunesRef = useRef<SVGGElement>(null);

  const outerRunes = useMemo(() => {
    const rnd = seeded(11);
    return Array.from({ length: 16 }, () => String.fromCharCode(0x03b1 + Math.floor(rnd() * 24)));
  }, []);
  const innerRunes = useMemo(() => {
    const rnd = seeded(29);
    return Array.from({ length: 8 }, () => String.fromCharCode(0x0400 + Math.floor(rnd() * 40)));
  }, []);

  // Giro lentísimo: un instrumento, no un efecto. Parado con movimiento reducido o con el diálogo cerrado.
  useEffect(() => {
    if (!isOpen || api.reduced) return;
    const a = gsap.to(runesRef.current, { rotation: 360, transformOrigin: "50% 50%", duration: 180, repeat: -1, ease: "none" });
    const b = gsap.to(innerRunesRef.current, { rotation: -360, transformOrigin: "50% 50%", duration: 120, repeat: -1, ease: "none" });
    return () => {
      a.kill();
      b.kill();
    };
  }, [isOpen, api.reduced]);

  return (
    <svg
      ref={ref}
      data-part="diagram"
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      viewBox="0 0 500 500"
      aria-hidden="true"
      style={{ color: "rgb(var(--voynich-ink))" }}
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <circle cx="250" cy="250" r="238" strokeWidth="1.6" />
      <circle cx="250" cy="250" r="231" strokeWidth="0.6" />
      {/* Graduación: una marca cada 3° y una larga cada 15° */}
      <circle cx="250" cy="250" r="226" strokeWidth="6" strokeDasharray="0.7 10.84" strokeDashoffset="0.35" opacity="0.85" />
      <circle cx="250" cy="250" r="224" strokeWidth="10" strokeDasharray="1.3 64.9" strokeDashoffset="0.65" />
      <circle cx="250" cy="250" r="217" strokeWidth="0.7" />

      <g ref={runesRef}>
        <polygon points="250,40 432,145 432,355 250,460 68,355 68,145" strokeWidth="0.6" opacity="0.28" />
        <polygon points="250,40 432,355 68,355" strokeWidth="0.5" opacity="0.18" />
        <polygon points="250,460 432,145 68,145" strokeWidth="0.5" opacity="0.18" />
        {outerRunes.map((char, i) => (
          <text key={i} x="250" y="70" fontSize="19" fill="currentColor" stroke="none" opacity="0.6" transform={`rotate(${i * 22.5} 250 250)`} textAnchor="middle" style={{ fontFamily: "var(--voynich-font-body)" }}>
            {char}
          </text>
        ))}
      </g>

      <circle cx="250" cy="250" r="176" strokeWidth="2" />
      <circle cx="250" cy="250" r="171" strokeWidth="0.6" />

      <g ref={innerRunesRef} style={{ color: "rgb(var(--voynich-vermilion))" }}>
        {innerRunes.map((char, i) => (
          <text key={`inner-${i}`} x="250" y="100" fontSize="15" fill="currentColor" stroke="none" opacity="0.85" transform={`rotate(${i * 45} 250 250)`} textAnchor="middle" style={{ fontFamily: "var(--voynich-font-body)" }}>
            {char}
          </text>
        ))}
      </g>
      <circle cx="250" cy="250" r="146" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
});
Diagram.displayName = "ConfinementCircle.Diagram";

/* ───────────────────────── Content / Title / Body / Actions ───────────────────────── */

/** `ConfinementCircle.Content`: la columna central donde van el título, el cuerpo y las acciones. */
const Content = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-part="content" className={cn("relative z-10 flex flex-col items-center justify-center w-[56%] h-[56%] text-center", className)} {...props} />
));
Content.displayName = "ConfinementCircle.Content";

/** `ConfinementCircle.Title`: el título. Ya lleva el `id` que enlaza con el nombre accesible del diálogo. */
const Title = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, style, ...props }, ref) => {
  const { api } = useCircle("Title");
  return (
    <h3
      ref={ref}
      id={api.titleId}
      data-part="title"
      className={cn("w-full pb-2 mb-3 border-b border-voynich-inkDark/30", className)}
      style={{ fontFamily: "var(--voynich-font-display)", fontWeight: 600, fontSize: "1.35rem", lineHeight: 1.1, color: "rgb(var(--voynich-vermilion))", ...style }}
      {...props}
    />
  );
});
Title.displayName = "ConfinementCircle.Title";

/** `ConfinementCircle.Body`: el texto del diálogo, con desplazamiento si no cabe. */
const Body = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    data-part="body"
    className={cn("flex-1 overflow-y-auto w-full px-2 leading-relaxed", className)}
    style={{ fontFamily: "var(--voynich-font-body)", fontSize: "0.95rem", color: "rgb(var(--voynich-ink))", ...style }}
    {...props}
  />
));
Body.displayName = "ConfinementCircle.Body";

/** `ConfinementCircle.Actions`: la fila de botones. */
const Actions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-part="actions" className={cn("flex gap-3 mt-3", className)} {...props} />
));
Actions.displayName = "ConfinementCircle.Actions";

/** `ConfinementCircle.Dismiss`: botón que cierra el diálogo. Acepta todas las props de `Button`. */
const Dismiss = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({ onClick, ...props }, ref) => {
  const { onClose } = useCircle("Dismiss");
  return <Button ref={ref} variant="outline" size="sm" data-part="dismiss" onClick={composeHandlers(onClick, onClose)} {...props} />;
});
Dismiss.displayName = "ConfinementCircle.Dismiss";

/** `ConfinementCircle.Confirm`: botón que confirma. Acepta todas las props de `Button`. */
const Confirm = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({ onClick, ...props }, ref) => {
  const { onConfirm } = useCircle("Confirm");
  return <Button ref={ref} variant="primary" size="sm" data-part="confirm" onClick={composeHandlers(onClick, () => onConfirm?.())} {...props} />;
});
Confirm.displayName = "ConfinementCircle.Confirm";

/* ───────────────────────── Root ───────────────────────── */

export interface ConfinementCircleRootProps extends UseConfinementCircleOptions {
  /** Se llama al confirmar (lo usa `ConfinementCircle.Confirm`). */
  onConfirm?: () => void;
  /** Las partes que componen el diálogo: normalmente `Overlay` > `Dialog` > (`Diagram`, `Content`). */
  children: React.ReactNode;
}

/**
 * `ConfinementCircle.Root`
 *
 * Aporta el estado y la mecánica (foco, Escape, animación) a las partes que pongas dentro. No dibuja
 * nada por sí mismo: compón `Overlay` > `Dialog` > (`Diagram`, `Content` > `Title`, `Body`, `Actions`).
 */
const Root: React.FC<ConfinementCircleRootProps> = ({ isOpen, onClose, onConfirm, motion, children }) => {
  const api = useConfinementCircle({ isOpen, onClose, motion });
  return <CircleProvider value={{ api, isOpen, onClose, onConfirm }}>{children}</CircleProvider>;
};
Root.displayName = "ConfinementCircle.Root";

/**
 * `ConfinementCircle`
 *
 * Un diálogo modal dibujado como un círculo de confinamiento sobre pergamino. Accesible de serie:
 * `role="dialog"`, `aria-modal`, foco atrapado, Escape para cerrar y el foco vuelve a quien lo abrió.
 *
 * @example Por defecto
 * <ConfinementCircle isOpen={open} onClose={close} title="Aviso">El texto…</ConfinementCircle>
 *
 * @example Tus propias partes (sin el diagrama, con un solo botón)
 * <ConfinementCircle.Root isOpen={open} onClose={close}>
 *   <ConfinementCircle.Overlay>
 *     <ConfinementCircle.Dialog>
 *       <ConfinementCircle.Content>
 *         <ConfinementCircle.Title>Aviso</ConfinementCircle.Title>
 *         <ConfinementCircle.Body>…</ConfinementCircle.Body>
 *         <ConfinementCircle.Dismiss>Entendido</ConfinementCircle.Dismiss>
 *       </ConfinementCircle.Content>
 *     </ConfinementCircle.Dialog>
 *   </ConfinementCircle.Overlay>
 * </ConfinementCircle.Root>
 *
 * @example Solo la mecánica
 * const dialog = useConfinementCircle({ isOpen, onClose });
 */
const ConfinementCircleBase = forwardRef<HTMLDivElement, ConfinementCircleProps>(
  ({ isOpen, onClose, onConfirm, title = "Aviso Crucial", dismissLabel = "Rechazar", confirmLabel = "Asimilar", motion, children, ...props }, ref) => (
    <Root isOpen={isOpen} onClose={onClose} {...(onConfirm ? { onConfirm } : {})} motion={motion}>
      <Overlay>
        <Dialog ref={ref} {...props}>
          <Diagram />
          <Content>
            <Title>{title}</Title>
            <Body>{children}</Body>
            <Actions>
              <Dismiss>{dismissLabel}</Dismiss>
              <Confirm>{confirmLabel}</Confirm>
            </Actions>
          </Content>
        </Dialog>
      </Overlay>
    </Root>
  ),
);
ConfinementCircleBase.displayName = "ConfinementCircle";

export const ConfinementCircle = Object.assign(ConfinementCircleBase, {
  Root,
  Overlay,
  Dialog,
  Diagram,
  Content,
  Title,
  Body,
  Actions,
  Dismiss,
  Confirm,
});
