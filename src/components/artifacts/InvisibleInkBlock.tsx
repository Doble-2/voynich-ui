import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { composeRefs } from "../../lib/compose";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface InvisibleInkBlockProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Texto oculto a revelar. */
  text: string;
  /** Color de la tinta revelada. @default el bermellón del tema (`--voynich-vermilion`) */
  revealColor?: string;
  /** Modo de interacción para revelar. @default "hover" */
  interaction?: "hover" | "click";
  /**
   * Control externo del estado revelado. Si se provee, el componente es "controlled".
   * @default undefined (uncontrolled)
   */
  revealed?: boolean;
  /** Duración de la animación de revelación (seg). @default 2 */
  revealDuration?: number;
  /** Duración de la animación de ocultamiento (seg). @default 1 */
  hideDuration?: number;
  /** Intensidad del desenfoque oculto (px). @default 6 */
  blurAmount?: number;
  /** Callback cuando el texto se revela. */
  onReveal?: () => void;
  /** Callback cuando el texto se oculta. */
  onHide?: () => void;
}

/** GSAP no interpola `var()`: lee el token del tema (canales «r g b») y lo da como `rgb(r, g, b)`. */
const tokenColor = (el: Element, name: string) =>
  `rgb(${getComputedStyle(el).getPropertyValue(name).trim().split(/\s+/).join(", ")})`;

export const InvisibleInkBlock = React.forwardRef<HTMLSpanElement, InvisibleInkBlockProps>(
  (
    {
      className,
      text,
      revealColor,
      interaction = "hover",
      revealed: controlledRevealed,
      revealDuration = 2,
      hideDuration = 1,
      blurAmount = 6,
      onReveal,
      onHide,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const isControlled = controlledRevealed !== undefined;
    const [internalRevealed, setInternalRevealed] = useState(false);
    const isRevealed = isControlled ? controlledRevealed : internalRevealed;
    const reduced = useReducedMotion();

    // Sync controlled state
    useEffect(() => {
      if (isControlled && controlledRevealed !== internalRevealed) {
        setInternalRevealed(controlledRevealed);
      }
    }, [controlledRevealed]);

    useGSAP(
      () => {
        const el = textRef.current;
        if (!el) return;

        if (isRevealed) {
          gsap.to(el, {
            opacity: 1,
            filter: "blur(0px)",
            color: revealColor ?? tokenColor(el, "--voynich-vermilion"),
            duration: reduced ? 0 : revealDuration,
            ease: "power3.out",
          });
        } else {
          gsap.to(el, {
            opacity: 0.05,
            filter: `blur(${blurAmount}px)`,
            color: "transparent",
            duration: reduced ? 0 : hideDuration,
            ease: "power2.in",
          });
        }
      },
      [isRevealed, revealColor, revealDuration, hideDuration, blurAmount, reduced],
    );

    const triggerReveal = () => {
      if (!isControlled) setInternalRevealed(true);
      onReveal?.();
    };

    const triggerHide = () => {
      if (!isControlled) setInternalRevealed(false);
      onHide?.();
    };

    return (
      <span
        ref={composeRefs(ref, containerRef)}
        data-part="root"
        data-revealed={isRevealed}
        tabIndex={0}
        role={interaction === "click" ? "button" : undefined}
        aria-pressed={interaction === "click" ? isRevealed : undefined}
        className={cn("relative cursor-help inline-flex items-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4", className)}
        onMouseEnter={interaction === "hover" ? triggerReveal : undefined}
        onMouseLeave={interaction === "hover" ? triggerHide : undefined}
        onFocus={interaction === "hover" ? triggerReveal : undefined}
        onBlur={interaction === "hover" ? triggerHide : undefined}
        // En táctil no hay hover: un toque alterna.
        onPointerDown={
          interaction === "hover"
            ? (e) => { if (e.pointerType === "touch") (isRevealed ? triggerHide : triggerReveal)(); }
            : undefined
        }
        onKeyDown={
          interaction === "click"
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  isRevealed ? triggerHide() : triggerReveal();
                }
              }
            : undefined
        }
        onClick={
          interaction === "click"
            ? () => {
                if (isRevealed) {
                  triggerHide();
                } else {
                  triggerReveal();
                }
              }
            : undefined
        }
        {...props}
      >
        <span
          data-part="underline"
          className="absolute inset-0 pointer-events-none border-b border-dotted border-current opacity-40"
          style={{ opacity: isRevealed ? 0 : 1, transition: "opacity 1s" }}
        />
        <span
          ref={textRef}
          data-part="text"
          className="relative inline-block transition-none"
          style={{
            opacity: 0.05,
            filter: `blur(${blurAmount}px)`,
            color: "transparent",
          }}
        >
          {text}
        </span>
      </span>
    );
  },
);
InvisibleInkBlock.displayName = "InvisibleInkBlock";