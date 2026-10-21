import React, { useRef, useId, useMemo, useImperativeHandle, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface OuroborosSpinnerRef {
  /** Inicia la rotación. */
  start: () => void;
  /** Detiene la rotación. */
  stop: () => void;
  /** Alterna entre iniciar y detener. */
  toggle: () => void;
}

export interface OuroborosSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Diámetro de la serpiente (px). @default 64 */
  size?: number;
  /** Color principal de la serpiente. @default "#5eead4" */
  loadingColor?: string;
  /** Activa/desactiva la animación de rotación. @default true */
  isProcessing?: boolean;
  /** Color de la pista/sombra base. @default "#21120a" */
  trackColor?: string;
  /** Intensidad del resplandor (0–1). @default 0.6 */
  glowIntensity?: number;
  /** Duración de una rotación completa (seg). @default 3 */
  speed?: number;
  /** Mostrar escamas. @default true */
  showScales?: boolean;
  /** Mostrar el ojo de la serpiente. @default true */
  showEye?: boolean;
  /** Color del ojo. @default "#0d0905" */
  eyeColor?: string;
  /** Grosor del cuerpo de la serpiente. @default 3.5 */
  strokeWidth?: number;
  /** Callback cada vez que completa una rotación. */
  onCycleComplete?: () => void;
}

export const OuroborosSpinner = React.forwardRef<OuroborosSpinnerRef, OuroborosSpinnerProps>(
  (
    {
      className,
      size = 64,
      loadingColor = "#5eead4",
      isProcessing = true,
      trackColor = "#21120a",
      glowIntensity = 0.6,
      speed = 3,
      showScales = true,
      showEye = true,
      eyeColor = "#0d0905",
      strokeWidth = 3.5,
      onCycleComplete,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const snakeRef = useRef<SVGPathElement>(null);
    const scalesRef = useRef<SVGGElement>(null);
    const gradientId = `ouroboros-grad-${useId().replace(/:/g, "")}`;
    const processingRef = useRef(isProcessing);
    processingRef.current = isProcessing;

    // Pre-generate scale positions
    const scales = useMemo(
      () =>
        Array.from({ length: 24 }, (_, i) => {
          const angle = (i / 24) * 360;
          const rad = (angle * Math.PI) / 180;
          return {
            cx: 50 + 40 * Math.cos(rad),
            cy: 50 + 40 * Math.sin(rad),
            r: 1.2 + Math.random() * 0.8,
          };
        }),
      [],
    );

    const startAnimation = useCallback(() => {
      const snake = snakeRef.current;
      const container = containerRef.current;
      const scalesEl = scalesRef.current;
      if (!snake || !container) return;

      gsap.to(container, {
        rotation: "+=360",
        duration: speed,
        ease: "none",
        repeat: -1,
        onRepeat: () => onCycleComplete?.(),
      });

      gsap.to(container, {
        scale: 1.05,
        duration: 1.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const len = 251;
      gsap.fromTo(
        snake,
        { strokeDasharray: `${len}, ${len}`, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: "circ.inOut",
          repeat: -1,
          yoyo: true,
        },
      );

      if (showScales && scalesEl) {
        const dots = scalesEl.querySelectorAll("circle");
        dots.forEach((dot, i) => {
          gsap.to(dot, {
            opacity: 0.8,
            duration: 0.3 + Math.random() * 0.5,
            delay: i * 0.08,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        });
      }
    }, [speed, showScales, onCycleComplete]);

    const stopAnimation = useCallback(() => {
      const snake = snakeRef.current;
      const container = containerRef.current;
      if (!snake || !container) return;

      gsap.killTweensOf(container);
      gsap.killTweensOf(snake);
      gsap.to(container, { rotation: 0, scale: 1, duration: 1, ease: "power2.out" });
      gsap.to(snake, { strokeDashoffset: 0, duration: 1, ease: "power2.out" });
    }, []);

    // Imperative handle
    useImperativeHandle(ref, () => ({
      start: () => startAnimation(),
      stop: () => stopAnimation(),
      toggle: () => {
        if (processingRef.current) {
          stopAnimation();
        } else {
          startAnimation();
        }
        processingRef.current = !processingRef.current;
      },
    }));

    useGSAP(
      () => {
        if (isProcessing) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      [isProcessing, startAnimation, stopAnimation],
    );

    const glowPx = size * 0.12 * glowIntensity;
    const glowAlpha = Math.round(glowIntensity * 96)
      .toString(16)
      .padStart(2, "0");

    return (
      <div
        ref={containerRef}
        className={cn("relative flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ filter: `drop-shadow(0 0 ${glowPx}px ${loadingColor}${glowAlpha})` }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={loadingColor} stopOpacity="1" />
              <stop offset="50%" stopColor={loadingColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={loadingColor} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Outer glow ring */}
          <circle cx="50" cy="50" r="44" fill="none" stroke={loadingColor} strokeWidth="0.3" opacity="0.15" />

          {/* Base shadow track */}
          <path d="M50 10 A40 40 0 1 1 49.9 10" fill="none" stroke={trackColor} strokeWidth={strokeWidth + 1.5} />

          {/* The Snake Body */}
          <path
            ref={snakeRef}
            d="M50 10 A40 40 0 1 1 49.9 10"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Scale texture dots */}
          {showScales && (
            <g ref={scalesRef}>
              {scales.map((s, i) => (
                <circle key={`scale-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill={loadingColor} opacity="0.2" />
              ))}
            </g>
          )}

          {/* Snake head */}
          <circle cx="50" cy="10" r="5" fill={loadingColor} opacity="0.9" />
          {/* Eye */}
          {showEye && <circle cx="50" cy="9" r="1.5" fill={eyeColor} />}
          {/* Jaw/fang */}
          <polygon points="50,5 54,15 46,15" fill={eyeColor} opacity="0.6" />
        </svg>

        {/* Center mystical artifact */}
        <div className="absolute flex items-center justify-center" style={{ width: size * 0.2, height: size * 0.2 }}>
          <div
            className="w-full h-full rounded-full border border-[#eadbb6]/20 flex items-center justify-center"
            style={{ background: `radial-gradient(circle, ${loadingColor}10 0%, transparent 70%)` }}
          >
            <div className="w-1/3 h-1/3 rounded-full" style={{ backgroundColor: `${loadingColor}30` }} />
          </div>
        </div>
      </div>
    );
  },
);
OuroborosSpinner.displayName = "OuroborosSpinner";