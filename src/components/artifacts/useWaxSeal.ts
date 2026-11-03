import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface WaxSealShatterRef {
  /** Rompe el sello programáticamente. */
  shatter: () => void;
  /** Restaura el sello al estado original. */
  seal: () => void;
}

export interface UseWaxSealOptions {
  /** Duración de la presión para romper (seg). @default 1.5 */
  holdDuration?: number | undefined;
  /** Número de esquirlas en la ruptura. @default 20 */
  particleCount?: number | undefined;
  /** Intensidad de la explosión de esquirlas (px). @default 150 */
  shatterIntensity?: number | undefined;
  /** Color de las esquirlas. @default "rgb(172, 80, 56)" */
  sealColor?: string | undefined;
  /** Nombre accesible del sello (lo que anuncia el lector de pantalla). */
  label?: string | undefined;
  /** Se llama cuando el sello se rompe. */
  onShatter?: (() => void) | undefined;
  /** Se llama cuando el sello se restaura. */
  onSeal?: (() => void) | undefined;
}

/**
 * `useWaxSeal`
 *
 * La mecánica de un sello que se rompe al mantener pulsado: cuenta la presión, lanza las esquirlas, revela el
 * contenido y ofrece una alternativa de teclado (Intro / Espacio rompe sin mantener). **No dibuja nada**:
 * conecta `containerRef`, `sealRef`, `particlesRef` y `contentRef` a tus elementos y usa `getTriggerProps()`
 * en el que se pulsa.
 */
export function useWaxSeal({
  holdDuration = 1.5,
  particleCount = 20,
  shatterIntensity = 150,
  sealColor = "rgb(172, 80, 56)",
  label = "Romper el sello",
  onShatter,
  onSeal,
}: UseWaxSealOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSealed, setIsSealed] = useState(true);
  const reduced = useReducedMotion();
  const shakeRef = useRef<gsap.core.Tween | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const performShatter = () => {
    setIsSealed(false);
    const seal = sealRef.current;
    const particlesContainer = particlesRef.current;
    const content = contentRef.current;
    if (!seal || !particlesContainer || !content) return;

    gsap.set(seal, { display: "none" });

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      // Esquirla de cera: forma irregular, no una bolita.
      particle.className = "absolute";
      const size = 6 + Math.random() * 9;
      particle.style.width = `${size}px`;
      particle.style.height = `${size * (0.6 + Math.random() * 0.6)}px`;
      particle.style.backgroundColor = sealColor;
      particle.style.clipPath = `polygon(${Array.from({ length: 5 }, (_, k) => {
        const a = (k / 5) * Math.PI * 2;
        const r = 38 + Math.random() * 12;
        return `${(50 + Math.cos(a) * r).toFixed(0)}% ${(50 + Math.sin(a) * r).toFixed(0)}%`;
      }).join(",")})`;
      particle.style.boxShadow = "inset 1px 1px 0 rgb(255 200 170 / 0.4)";
      particlesContainer.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * shatterIntensity;
      gsap.to(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity + 100,
        rotation: Math.random() * 360,
        scale: 0.4 + Math.random() * 1.2,
        opacity: 0,
        duration: reduced ? 0 : 0.8 + Math.random() * 0.5,
        ease: "circ.out",
        onComplete: () => particle.remove(),
      });
    }

    gsap.fromTo(
      content,
      { height: 0, opacity: 0, scaleY: 0.9, transformOrigin: "top" },
      { height: "auto", opacity: 1, scaleY: 1, duration: reduced ? 0 : 0.9, ease: "power3.out" },
    );
    onShatter?.();
  };

  const performSeal = () => {
    setIsSealed(true);
    const seal = sealRef.current;
    const content = contentRef.current;
    if (seal) {
      gsap.set(seal, { display: "flex", scale: 0 });
      gsap.to(seal, { scale: 1, duration: reduced ? 0 : 0.6, ease: "back.out(1.4)" });
    }
    if (content) gsap.to(content, { height: 0, opacity: 0, duration: reduced ? 0 : 0.4, ease: "power2.in" });
    onSeal?.();
  };

  // El temporizador de "mantener pulsado". Se recrea al volver a sellar: el nodo del sello es otro.
  useGSAP(
    () => {
      if (!isSealed || !sealRef.current || !particlesRef.current || !contentRef.current) return;
      tl.current = gsap.timeline({ paused: true, onComplete: performShatter });
      tl.current.to(sealRef.current, {
        scale: 0.85,
        rotation: (Math.random() - 0.5) * 10,
        filter: "contrast(1.3) brightness(0.85)",
        duration: holdDuration,
        ease: "power2.in",
      });
    },
    { scope: containerRef, dependencies: [holdDuration, sealColor, particleCount, shatterIntensity, isSealed] },
  );

  const pressStart = () => {
    if (!isSealed) return;
    tl.current?.play();
    // La tensión de la cera al ceder: un temblor mínimo (nunca con movimiento reducido).
    if (!reduced) {
      shakeRef.current = gsap.to(containerRef.current, {
        x: () => (Math.random() - 0.5) * 3,
        y: () => (Math.random() - 0.5) * 3,
        duration: 0.05,
        repeat: -1,
        yoyo: true,
      });
    }
  };

  const pressEnd = () => {
    if (!isSealed) return;
    tl.current?.reverse();
    shakeRef.current?.kill();
    gsap.killTweensOf(containerRef.current);
    gsap.to(containerRef.current, { x: 0, y: 0, duration: 0.1 });
  };

  return {
    /** `true` mientras el sello está intacto. */
    isSealed,
    containerRef,
    sealRef,
    particlesRef,
    contentRef,
    /** Rompe el sello (si está intacto). */
    shatter: () => {
      if (isSealed) performShatter();
    },
    /** Vuelve a sellar (si está roto). */
    seal: () => {
      if (!isSealed) performSeal();
    },
    /** Props de comportamiento para el elemento que se pulsa: rol, teclado y presión sostenida. */
    getTriggerProps: () => ({
      role: "button" as const,
      tabIndex: 0,
      "aria-label": `${label}. Mantén presionado, o pulsa Intro para romper el sello.`,
      onKeyDown: (e: ReactKeyboardEvent) => {
        // Alternativa de teclado: no exige mantener pulsado.
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          performShatter();
        }
      },
      onMouseDown: pressStart,
      onMouseUp: pressEnd,
      onMouseLeave: pressEnd,
      onTouchStart: pressStart,
      onTouchEnd: pressEnd,
    }),
  };
}
