import React, { useRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface TypewriterStutterRef {
  /** Reinicia la animación desde el principio. */
  restart: () => void;
  /** Pausa la animación. */
  pause: () => void;
  /** Reanuda la animación pausada. */
  resume: () => void;
}

export interface TypewriterStutterProps extends React.HTMLAttributes<HTMLDivElement> {
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

export const TypewriterStutter = React.forwardRef<TypewriterStutterRef, TypewriterStutterProps>(
  (
    {
      className,
      text,
      speed = 50,
      startDelay = 0,
      textColor = "#eadbb6",
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
        if (cursor && showCursor) {
          gsap.to(cursor, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true, ease: "steps(1)" });
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
              const glitchChar = String.fromCharCode(33 + Math.floor(Math.random() * 60));
              node.textContent = text.slice(0, pos - 1) + glitchChar;

              gsap.to(containerRef.current, {
                x: (Math.random() - 0.5) * 4,
                duration: 0.05,
                yoyo: true,
                repeat: 3,
                ease: "none",
              });

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
      [text, speed, startDelay, showCursor, loop, glitchRate],
    );

    const resolvedCursorColor = cursorColor || textColor;

    return (
      <div
        ref={containerRef}
        className={cn("font-mono text-sm leading-relaxed tracking-wider", className)}
        style={{ color: textColor }}
        {...props}
      >
        <span ref={textRef} />
        {showCursor && (
          <span
            ref={cursorRef}
            className="inline-block w-[0.5em] h-[1em] ml-1 align-middle"
            style={{ backgroundColor: resolvedCursorColor }}
          />
        )}
      </div>
    );
  },
);
TypewriterStutter.displayName = "TypewriterStutter";