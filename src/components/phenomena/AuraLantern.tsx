import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { composeRefs } from "../../lib/compose";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface AuraLanternProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lo que se ve en la penumbra. */
  children?: React.ReactNode;
  /** Lo que solo aparece bajo la luz. Siempre está en el DOM, así que los lectores de pantalla lo leen. */
  revealContent?: React.ReactNode;
  /** Diámetro de la luz (px). @default 150 */
  size?: number;
  /** Color de la luz (`--voy-lantern`). @default pan de oro claro */
  glowColor?: string;
  /** Retraso con que la luz sigue al puntero (s). @default 0.1 */
  followSpeed?: number;
  /** Intensidad de la luz (0–1). @default 0.8 */
  intensity?: number;
  /** Color de la penumbra (`--voy-lantern-bg`). @default negro de humo */
  bgColor?: string;
  /** `auto` respeta `prefers-reduced-motion`; `none` mueve la luz sin retraso ni fundidos. @default "auto" */
  motion?: "auto" | "full" | "none";
  /** Se llama al encender la luz, con la posición dentro del componente. */
  onReveal?: (position: { x: number; y: number }) => void;
}

/**
 * `AuraLantern`
 *
 * Una luz que sigue al puntero (ratón, dedo o lápiz) y deja leer lo que está en la penumbra. Con teclado,
 * al enfocar el componente se ilumina todo el contenido.
 */
export const AuraLantern = React.forwardRef<HTMLDivElement, AuraLanternProps>(
  (
    {
      className,
      children,
      revealContent,
      size = 150,
      glowColor,
      followSpeed = 0.1,
      intensity = 0.8,
      bgColor,
      motion = "auto",
      onReveal,
      style,
      tabIndex,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lanternRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);
    const systemReduced = useReducedMotion();
    const reduced = motion === "none" || (motion === "auto" && systemReduced);
    // El callback cambia en cada render del padre; leerlo por ref evita re-suscribir los listeners.
    const onRevealRef = useRef(onReveal);
    onRevealRef.current = onReveal;

    useGSAP(
      () => {
        const container = containerRef.current;
        const lantern = lanternRef.current;
        const reveal = revealRef.current;
        if (!container || !lantern || !reveal) return;
        const t = (d: number) => (reduced ? 0 : d);
        let lit = false;

        const moveTo = (x: number, y: number) => {
          gsap.to(lantern, { x: x - size / 2, y: y - size / 2, duration: t(followSpeed), ease: "power2.out" });
          container.style.setProperty("--lantern-x", `${x}px`);
          container.style.setProperty("--lantern-y", `${y}px`);
        };
        const light = (x: number, y: number) => {
          if (!lit) {
            lit = true;
            gsap.to(lantern, { opacity: intensity, scale: 1, duration: t(0.4), ease: "power3.out" });
            gsap.to(reveal, { opacity: 1, duration: t(0.3), ease: "power2.out" });
            onRevealRef.current?.({ x, y });
          }
          moveTo(x, y);
        };
        const dim = () => {
          lit = false;
          container.removeAttribute("data-lit");
          gsap.to(lantern, { opacity: 0, scale: 0.5, duration: t(0.6), ease: "power2.in" });
          gsap.to(reveal, { opacity: 0, duration: t(0.4), ease: "power2.in" });
        };
        const onPointer = (e: PointerEvent) => {
          const r = container.getBoundingClientRect();
          light(e.clientX - r.left, e.clientY - r.top);
        };
        // Teclado: no hay puntero que seguir, así que se ilumina todo.
        const onFocus = (e: FocusEvent) => {
          if (e.target !== container) return;
          container.setAttribute("data-lit", "all");
          light(container.clientWidth / 2, container.clientHeight / 2);
        };

        container.addEventListener("pointermove", onPointer);
        container.addEventListener("pointerdown", onPointer);
        container.addEventListener("pointerleave", dim);
        container.addEventListener("focus", onFocus);
        container.addEventListener("blur", dim);
        return () => {
          container.removeEventListener("pointermove", onPointer);
          container.removeEventListener("pointerdown", onPointer);
          container.removeEventListener("pointerleave", dim);
          container.removeEventListener("focus", onFocus);
          container.removeEventListener("blur", dim);
        };
      },
      { dependencies: [size, followSpeed, intensity, reduced], scope: containerRef },
    );

    const glow = "var(--voy-lantern, rgb(var(--voynich-gold-light)))";

    return (
      <div
        ref={composeRefs(ref, containerRef)}
        data-part="root"
        tabIndex={tabIndex ?? 0}
        className={cn(
          "voy-lantern relative overflow-hidden cursor-crosshair touch-none",
          "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4",
          className,
        )}
        style={{
          backgroundColor: "var(--voy-lantern-bg, rgb(var(--voynich-void)))",
          fontFamily: "var(--voynich-font-body)",
          ...(glowColor && { "--voy-lantern": glowColor }),
          ...(bgColor && { "--voy-lantern-bg": bgColor }),
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {/* La capa base apenas se distingue en la penumbra: la luz revela el resto. */}
        <div data-part="shadow" className="relative z-10 p-8 h-full pointer-events-none" style={{ color: "rgb(var(--voynich-ink-medium))", opacity: 0.7 }}>
          {children}
        </div>
        <div
          ref={lanternRef}
          data-part="light"
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-none rounded-full"
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle at center, ${glow} 0%, color-mix(in srgb, ${glow} ${Math.round(intensity * 80)}%, transparent) 40%, transparent 70%)`,
            mixBlendMode: "screen",
            opacity: 0,
          }}
        />
        <div
          ref={revealRef}
          data-part="revealed"
          className="voy-lantern__revealed absolute inset-0 z-10 p-8 h-full pointer-events-none"
          style={{
            color: "rgb(var(--voynich-vellum))",
            clipPath: `circle(${size / 2}px at var(--lantern-x, 0px) var(--lantern-y, 0px))`,
            opacity: 0,
          }}
        >
          {revealContent}
        </div>
      </div>
    );
  },
);
AuraLantern.displayName = "AuraLantern";
