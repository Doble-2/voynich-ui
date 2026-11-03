import React, { forwardRef, useImperativeHandle } from "react";
import { cn } from "../../lib/utils";
import { Slot } from "../../lib/Slot";
import { composeHandlers, composeRefs } from "../../lib/compose";
import { createPartsContext } from "../../lib/context";
import { useWaxSeal, type UseWaxSealOptions, type WaxSealShatterRef } from "./useWaxSeal";

export { useWaxSeal };
export type { WaxSealShatterRef, UseWaxSealOptions };

interface SealContext {
  seal: ReturnType<typeof useWaxSeal>;
  sealSize: number;
  sealColor: string;
}
const [SealProvider, useSeal] = createPartsContext<SealContext>("WaxSealShatter");

export interface WaxSealShatterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">, UseWaxSealOptions {
  /** Contenido revelado tras romper el sello. */
  children?: React.ReactNode;
  /** Texto descriptivo bajo el sello. @default "Desbloquear Conocimiento" */
  revealText?: string;
  /** Tamaño del sello (px). @default 96 */
  sealSize?: number;
  /** Carácter o texto del emblema central. @default "V" */
  emblem?: string;
}

/* ───────────────────────── Trigger ───────────────────────── */

export interface WaxTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aplica el comportamiento a tu propio elemento. @default false */
  asChild?: boolean;
}

/**
 * `WaxSealShatter.Trigger`
 *
 * El elemento que se mantiene pulsado para romper el sello. Trae el rol de botón, el teclado
 * (Intro / Espacio) y la presión sostenida. Solo existe mientras el sello está intacto.
 */
const Trigger = forwardRef<HTMLDivElement, WaxTriggerProps>(
  ({ asChild = false, className, onKeyDown, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, children, ...props }, ref) => {
    const { seal } = useSeal("Trigger");
    if (!seal.isSealed) return null;
    const b = seal.getTriggerProps();
    const Comp = (asChild ? Slot : "div") as React.ElementType;
    return (
      <Comp
        ref={ref}
        data-part="trigger"
        role={b.role}
        tabIndex={b.tabIndex}
        aria-label={b["aria-label"]}
        className={cn("flex flex-col items-center cursor-pointer select-none rounded-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-8", className)}
        onKeyDown={composeHandlers(onKeyDown, b.onKeyDown)}
        onMouseDown={composeHandlers(onMouseDown, b.onMouseDown)}
        onMouseUp={composeHandlers(onMouseUp, b.onMouseUp)}
        onMouseLeave={composeHandlers(onMouseLeave, b.onMouseLeave)}
        onTouchStart={composeHandlers(onTouchStart, b.onTouchStart)}
        onTouchEnd={composeHandlers(onTouchEnd, b.onTouchEnd)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Trigger.displayName = "WaxSealShatter.Trigger";

/* ───────────────────────── Seal / Emblem / Hint ───────────────────────── */

/** `WaxSealShatter.Seal`: el disco de lacre, con borde irregular, relieve y sombra proyectada. */
const Seal = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, children, ...props }, ref) => {
  const { seal, sealSize, sealColor } = useSeal("Seal");
  return (
    <div
      ref={composeRefs(seal.sealRef, ref)}
      data-part="seal"
      className={cn("relative flex items-center justify-center flex-col z-20", className)}
      style={{
        width: sealSize,
        height: sealSize,
        borderRadius: "52% 48% 55% 45% / 47% 55% 45% 53%",
        backgroundColor: sealColor,
        backgroundImage: "radial-gradient(circle at 32% 28%, rgb(255 190 160 / 0.32) 0%, transparent 52%), var(--voynich-surface-rubric)",
        backgroundSize: "auto, 240px 240px",
        boxShadow:
          "inset 2px 3px 4px rgb(255 200 170 / 0.4), inset -3px -5px 7px rgb(0 0 0 / 0.55), 0 0 0 1px rgb(var(--voynich-vermilion-dark)), 3px 6px 6px rgb(0 0 0 / 0.4), 10px 18px 20px -4px rgb(0 0 0 / 0.55)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
Seal.displayName = "WaxSealShatter.Seal";

/** `WaxSealShatter.Emblem`: el anillo estampado y la letra hundidos en la cera. Los hijos son el emblema. */
const Emblem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, children, ...props }, ref) => {
  const { sealSize } = useSeal("Emblem");
  const size = sealSize * 0.667;
  return (
    <div
      ref={ref}
      data-part="emblem"
      className={cn("rounded-full flex items-center justify-center", className)}
      style={{
        width: size,
        height: size,
        boxShadow: "inset 1.5px 1.5px 2px rgb(0 0 0 / 0.5), inset -1px -1px 1px rgb(255 190 160 / 0.3), 1px 1px 0 rgb(255 190 160 / 0.22), -1px -1px 0 rgb(0 0 0 / 0.35)",
        ...style,
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--voynich-font-display)",
          fontWeight: 600,
          fontSize: size * 0.58,
          lineHeight: 1,
          color: "rgb(var(--voynich-vermilion-dark))",
          textShadow: "1px 1px 0 rgb(255 190 160 / 0.4), -1px -1px 0 rgb(0 0 0 / 0.5)",
        }}
      >
        {children}
      </span>
    </div>
  );
});
Emblem.displayName = "WaxSealShatter.Emblem";

/** `WaxSealShatter.Hint`: el rótulo bajo el sello. */
const Hint = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span ref={ref} data-part="hint" className={cn("voy-label mt-5 text-[13px] opacity-80", className)} {...props} />
));
Hint.displayName = "WaxSealShatter.Hint";

/* ───────────────────────── Particles / Content ───────────────────────── */

/** `WaxSealShatter.Particles`: la capa donde caen las esquirlas al romperse. Colócala donde quieras. */
const Particles = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { seal } = useSeal("Particles");
  return (
    <div
      ref={composeRefs(seal.particlesRef, ref)}
      data-part="particles"
      aria-hidden="true"
      className={cn("absolute top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none", className)}
      {...props}
    />
  );
});
Particles.displayName = "WaxSealShatter.Particles";

/** `WaxSealShatter.Content`: lo que se revela al romper el sello. Hasta entonces está plegado. */
const Content = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, children, ...props }, ref) => {
  const { seal } = useSeal("Content");
  return (
    <div
      ref={composeRefs(seal.contentRef, ref)}
      data-part="content"
      data-state={seal.isSealed ? "sealed" : "open"}
      className={cn("voy-slip relative w-full z-10 overflow-hidden p-8", className)}
      style={{ opacity: 0, height: 0, display: seal.isSealed ? "none" : "block", ...style }}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
});
Content.displayName = "WaxSealShatter.Content";

/* ───────────────────────── Root ───────────────────────── */

/**
 * `WaxSealShatter.Root`
 *
 * El contenedor y la mecánica. Con hijos, compón tú las partes; sin ellos dibuja la composición por defecto.
 * Atributo de estilo: `data-state="sealed" | "open"`. `ref` expone `shatter()` y `seal()`.
 */
const Root = forwardRef<WaxSealShatterRef, WaxSealShatterProps>(
  (
    {
      className,
      children,
      revealText = "Desbloquear Conocimiento",
      sealColor = "rgb(172, 80, 56)",
      sealSize = 96,
      emblem = "V",
      holdDuration,
      particleCount,
      shatterIntensity,
      onShatter,
      onSeal,
      label,
      ...props
    },
    ref,
  ) => {
    const seal = useWaxSeal({ holdDuration, particleCount, shatterIntensity, sealColor, label: label ?? revealText, onShatter, onSeal });
    useImperativeHandle(ref, () => ({ shatter: seal.shatter, seal: seal.seal }));

    return (
      <SealProvider value={{ seal, sealSize, sealColor }}>
        <div ref={seal.containerRef} data-part="root" data-state={seal.isSealed ? "sealed" : "open"} className={cn("relative flex flex-col items-center", className)} {...props}>
          {children}
        </div>
      </SealProvider>
    );
  },
);
Root.displayName = "WaxSealShatter.Root";

/**
 * `WaxSealShatter`
 *
 * Un sello de lacre que se rompe al mantenerlo pulsado y revela su contenido. Accesible de serie:
 * Intro o Espacio lo rompen sin mantener, y el estado se anuncia.
 *
 * @example Por defecto
 * <WaxSealShatter emblem="V" revealText="Romper para leer">El secreto…</WaxSealShatter>
 *
 * @example Tus propias partes
 * <WaxSealShatter.Root sealSize={120}>
 *   <WaxSealShatter.Trigger>
 *     <WaxSealShatter.Seal><WaxSealShatter.Emblem>☉</WaxSealShatter.Emblem></WaxSealShatter.Seal>
 *   </WaxSealShatter.Trigger>
 *   <WaxSealShatter.Particles />
 *   <WaxSealShatter.Content>El secreto…</WaxSealShatter.Content>
 * </WaxSealShatter.Root>
 */
const WaxSealShatterBase = forwardRef<WaxSealShatterRef, WaxSealShatterProps>(({ children, emblem = "V", revealText = "Desbloquear Conocimiento", ...props }, ref) => (
  <Root ref={ref} emblem={emblem} revealText={revealText} {...props}>
    <Trigger>
      <Seal>
        <Emblem>{emblem}</Emblem>
      </Seal>
      <Hint>{revealText} · mantén presionado</Hint>
    </Trigger>
    <Particles />
    <Content>{children}</Content>
  </Root>
));
WaxSealShatterBase.displayName = "WaxSealShatter";

export const WaxSealShatter = Object.assign(WaxSealShatterBase, { Root, Trigger, Seal, Emblem, Hint, Particles, Content });
