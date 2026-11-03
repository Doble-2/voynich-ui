import React, { useRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface ScribeTextRef {
  /** Reinicia la animación desde el principio. */
  restart: () => void;
  /** Pausa la animación. */
  pause: () => void;
  /** Reanuda la animación pausada. */
  resume: () => void;
}

export interface ScribeTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Texto a escribir. */
  text: string;
  /** Velocidad base de escritura (ms por carácter). @default 50 */
  speed?: number;
  /** Retraso antes de empezar a escribir (ms). @default 0 */
  startDelay?: number;
  /** Color del texto y el cursor. @default "#eadbb6" */
  textColor?: string;
  /** Color del cursor (si se desea diferente al texto). */
  cursorColor?: string;
  /** Mostrar/ocultar cursor parpadeante. @default true */
  showCursor?: boolean;
  /** Repetir la escritura en bucle. @default false */
  loop?: boolean;
  /** Probabilidad de glitch por carácter (0–1). @default 0.1 */
  glitchRate?: number;
  /** Callback cuando la escritura termina. */
  onComplete?: () => void;
}

export const ScribeText = React.forwardRef<ScribeTextRef, ScribeTextProps>(
  (
    {
      className,
      text,
      speed = 50,
      startDelay = 0,
      textColor,
      cursorColor,
      showCursor = true,
      loop = false,
      glitchRate = 0.1,
      onComplete,
      ...props
    },
    ref,
  ) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);
    const isPaused = useRef(false);
    const pausedPos = useRef(0);
    const triggerRef = useRef<() => void>(() => {});
    const reduced = useReducedMotion();

    const safeTimeout = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timeoutIds.current.push(id);
      return id;
    };

    const clearAllTimeouts = () => {
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current = [];
    };

    useImperativeHandle(ref, () => ({
      restart: () => {
        isPaused.current = false;
        pausedPos.current = 0;
        triggerRef.current();
      },
      pause: () => {
        isPaused.current = true;
        clearAllTimeouts();
      },
      resume: () => {
        if (isPaused.current) {
          isPaused.current = false;
          triggerRef.current();
        }
      },
    }));

    useGSAP(
      () => {
        const node = textRef.current;
        const cursor = cursorRef.current;
        if (!node) return;

        // Cursor blinking
        // Movimiento reducido: el texto aparece completo, sin tecleo ni parpadeo.
        if (reduced) {
          node.textContent = text;
          triggerRef.current = () => {};
          onComplete?.();
          return;
        }

        if (cursor && showCursor) {
          gsap.to(cursor, { opacity: 0.15, duration: 0.55, repeat: -1, yoyo: true, ease: "sine.inOut" });
        }

        triggerRef.current = () => {
          clearAllTimeouts();
          let pos = isPaused.current ? pausedPos.current : 0;
          let isGlitching = false;
          const totalLen = text.length;
          if (pos === 0 && node) node.textContent = "";

          const animateTyping = () => {
            if (isPaused.current) {
              pausedPos.current = pos;
              return;
            }

            if (pos > totalLen) {
              onComplete?.();
              if (loop) {
                pos = 0;
                if (node) node.textContent = "";
                safeTimeout(animateTyping, startDelay || speed * 10);
              }
              return;
            }

            // Random glitch
            if (Math.random() < glitchRate && pos > 0 && !isGlitching) {
              isGlitching = true;
              // Un error de escriba: una letra equivocada que se corrige al instante.
              const slips = "aeiourstnmlcd";
              const glitchChar = slips[Math.floor(Math.random() * slips.length)]!;
              node.textContent = text.slice(0, pos - 1) + glitchChar;

              safeTimeout(() => {
                isGlitching = false;
                node.textContent = text.slice(0, pos);
                safeTimeout(animateTyping, speed * 2);
              }, speed * 3);
            } else if (Math.random() < 0.05 && pos > 2 && !isGlitching) {
              // Erase back
              isGlitching = true;
              pos -= Math.floor(1 + Math.random() * 3);
              node.textContent = text.slice(0, pos);
              safeTimeout(() => {
                isGlitching = false;
                animateTyping();
              }, speed * 4);
            } else {
              // Normal typing
              node.textContent = text.slice(0, pos);
              pos++;
              const dynamicSpeed = isGlitching ? speed * 0.2 : speed + Math.random() * speed;
              safeTimeout(animateTyping, dynamicSpeed);
            }
          };

          safeTimeout(animateTyping, startDelay);
        };

        triggerRef.current();

        return () => {
          clearAllTimeouts();
        };
      },
      [text, speed, startDelay, showCursor, loop, glitchRate, reduced],
    );

    const resolvedCursorColor = cursorColor || textColor || "currentColor";

    return (
      <div
        ref={containerRef}
        className={cn("text-base leading-relaxed", className)}
        style={{ fontFamily: "var(--voynich-font-body)", letterSpacing: "0.02em", ...(textColor ? { color: textColor } : {}) }}
        {...props}
      >
        {/* El texto completo siempre está disponible para lectores de pantalla. */}
        <span className="sr-only">{text}</span>
        <span ref={textRef} aria-hidden="true" />
        {showCursor && (
          <span
            ref={cursorRef}
            aria-hidden="true"
            className="inline-block w-[2px] h-[1.05em] ml-[3px] align-text-bottom"
            style={{ backgroundColor: resolvedCursorColor }}
          />
        )}
      </div>
    );
  },
);
ScribeText.displayName = "ScribeText";