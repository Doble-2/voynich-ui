import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface TarotCard {
  id: string;
  title: string;
  description: string;
  frontImage?: React.ReactNode;
  backImage?: React.ReactNode;
}

export type TarotSpreadType = "fan" | "cross" | "grid";

export interface UseTarotSpreadOptions {
  cards: TarotCard[];
  /** Cómo se reparten las cartas al aparecer. @default "fan" */
  spreadType?: TarotSpreadType | undefined;
  /** `auto` respeta `prefers-reduced-motion`. @default "auto" */
  motion?: "auto" | "none" | undefined;
}

/**
 * `useTarotSpread`
 *
 * La mecánica de una tirada: reparte las cartas (abanico, cruz o rejilla) al aparecer y gestiona el giro de
 * cada una (con elevación, sombra y teclado). **No dibuja nada**: conecta `containerRef` a tu contenedor y
 * pon `getCardProps(card, index)` en el elemento de cada carta (dentro, un elemento con `data-part="card-inner"`
 * es el que gira).
 */
export function useTarotSpread({ cards, spreadType = "fan", motion = "auto" }: UseTarotSpreadOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [spreadLoaded, setSpreadLoaded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const systemReduced = useReducedMotion();
  /** Escala de tiempo: 0 cuando el usuario pidió menos movimiento. */
  const k = motion === "none" || systemReduced ? 0 : 1;

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || !cardRefs.current.length || spreadLoaded) return;
      const targets = cardRefs.current.filter(Boolean);

      if (spreadType === "fan") {
        gsap.fromTo(
          targets,
          { x: 0, y: 0, rotation: 0, opacity: 0, scale: 0.8 },
          {
            x: (i) => (i - targets.length / 2) * 50,
            y: (i) => Math.abs(i - targets.length / 2) * 15,
            rotation: (i) => (i - targets.length / 2) * 10,
            opacity: 1,
            scale: 1,
            duration: 1.5 * k,
            ease: "circ.inOut",
            stagger: 0.1 * k,
            transformOrigin: "center bottom",
          },
        );
      } else if (spreadType === "cross") {
        gsap.fromTo(
          targets,
          { x: 0, y: 0, rotation: 0, opacity: 0, scale: 0.5 },
          {
            x: (i) => (i === 1 ? 20 : i > 1 ? (i - 1) * 80 : 0),
            y: (i) => (i === 1 ? 10 : i % 2 === 0 ? 40 : -40),
            rotation: (i) => (i === 1 ? 90 : (Math.random() - 0.5) * 5),
            opacity: 1,
            scale: 1,
            duration: 1.2 * k,
            stagger: 0.3 * k,
            ease: "power3.inOut",
          },
        );
      } else {
        gsap.fromTo(
          targets,
          { y: 50, opacity: 0, rotationY: 180 },
          { y: 0, opacity: 1, rotationY: 0, duration: 1 * k, stagger: 0.1 * k, ease: "power3.out" },
        );
      }
      setSpreadLoaded(true);
    },
    [spreadType],
  );

  /** Gira la carta (o la devuelve a su posición si ya estaba girada). */
  const toggle = (id: string) => {
    const index = cards.findIndex((c) => c.id === id);
    const card = cardRefs.current[index];
    if (!card) return;

    const isFlipped = activeId === id;
    setActiveId(isFlipped ? null : id);

    gsap.to(card.querySelector('[data-part="card-inner"]'), {
      rotationY: isFlipped ? 0 : 180,
      duration: 0.8 * k,
      ease: "power2.inOut",
      z: isFlipped ? 0 : 50,
    });

    // Levitar = más distancia a la mesa = sombra más larga y difusa (nunca un resplandor).
    gsap.to(card, {
      y: isFlipped ? "-=10" : "-=30",
      scale: isFlipped ? 1.0 : 1.1,
      boxShadow: isFlipped ? "2px 4px 5px rgba(0, 0, 0, 0.4)" : "10px 26px 30px rgba(0, 0, 0, 0.55)",
      duration: 0.4 * k,
      ease: "sine.inOut",
    });
  };

  return {
    containerRef,
    /** Id de la carta girada ahora (o `null`). */
    activeId,
    spreadType,
    /** Gira o devuelve una carta por su id. */
    toggle,
    /** Posición de una carta dentro de `cards` (para `getCardProps`). */
    indexOf: (card: TarotCard) => cards.findIndex((c) => c.id === card.id),
    /** Props de comportamiento para el elemento de una carta: ref, rol de botón, teclado, estado y posición. */
    getCardProps: (card: TarotCard, index: number) => ({
      ref: (el: HTMLDivElement | null) => {
        cardRefs.current[index] = el;
      },
      role: "button" as const,
      tabIndex: 0,
      "aria-label": card.title,
      "aria-pressed": activeId === card.id,
      "data-state": activeId === card.id ? "flipped" : "back",
      style: { position: spreadType === "grid" ? "relative" : "absolute", zIndex: activeId === card.id ? 50 : index + 1 } as CSSProperties,
      onClick: () => toggle(card.id),
      onKeyDown: (e: ReactKeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(card.id);
        }
      },
    }),
  };
}
