import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface InvisibleInkBlockProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Texto oculto a revelar. */
  text: string;
  /** Color de la tinta revelada. @default "#8b0000" */
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

export const InvisibleInkBlock = React.forwardRef<HTMLSpanElement, InvisibleInkBlockProps>(
  (
    {
      className,
      text,
      revealColor = "#8b0000",
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
            color: revealColor,
            textShadow: `0 0 8px ${revealColor}60`,
            duration: revealDuration,
            ease: "power3.out",
          });
        } else {
          gsap.to(el, {
            opacity: 0.05,
            filter: `blur(${blurAmount}px)`,
            color: "transparent",
            textShadow: "0 0 0px transparent",
            duration: hideDuration,
            ease: "power2.in",
          });
        }
      },
      [isRevealed, revealColor, revealDuration, hideDuration, blurAmount],
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
        ref={containerRef}
        className={cn("relative cursor-help inline-flex items-center", className)}
        onMouseEnter={interaction === "hover" ? triggerReveal : undefined}
        onMouseLeave={interaction === "hover" ? triggerHide : undefined}
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
          className="absolute inset-0 pointer-events-none border-b border-dashed border-[#5c331d]/30"
          style={{ opacity: isRevealed ? 0 : 1, transition: "opacity 1s" }}
        />
        <span
          ref={textRef}
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