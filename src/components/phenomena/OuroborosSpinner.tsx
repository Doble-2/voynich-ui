import React, { useRef, useId, useMemo, useImperativeHandle, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/useReducedMotion";

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
  /** Color de la serpiente (`--voy-snake`). @default pan de oro */
  loadingColor?: string;
  /** Activa/desactiva la animación de rotación. @default true */
  isProcessing?: boolean;
  /** Color de la pista base (`--voy-track`). @default cuero */
  trackColor?: string;
  /** Resplandor (0–1). Va contra el lenguaje de diseño; se mantiene por compatibilidad. @default 0 */
  glowIntensity?: number;
  /** Duración de una rotación completa (seg). @default 3 */
  speed?: number;
  /** Mostrar escamas. @default true */
  showScales?: boolean;
  /** Mostrar el ojo de la serpiente. @default true */
  showEye?: boolean;
  /** Color del ojo (`--voy-eye`). @default negro de humo */
  eyeColor?: string;
  /** Grosor del cuerpo de la serpiente. @default 3.5 */
  strokeWidth?: number;
  /** Texto que anuncian los lectores de pantalla. @default "Cargando…" */
  label?: string;
  /**
   * `auto` respeta `prefers-reduced-motion`; `none` deja la serpiente quieta (el estado sigue anunciándose).
   * @default "auto"
   */
  motion?: "auto" | "full" | "none";
  /** Callback cada vez que completa una rotación. */
  onCycleComplete?: () => void;
}

// Colores por variable CSS (capa 2 del contrato), con tokens de la paleta por defecto.
// En `style`: los atributos de presentación SVG no resuelven `var()` en todos los navegadores.
const SNAKE = "var(--voy-snake, rgb(var(--voynich-gold)))";
const TRACK = "var(--voy-track, rgb(var(--voynich-leather)))";
const EYE = "var(--voy-eye, rgb(var(--voynich-void)))";

export const OuroborosSpinner = React.forwardRef<OuroborosSpinnerRef, OuroborosSpinnerProps>(
  (
    {
      className,
      size = 64,
      loadingColor,
      isProcessing = true,
      trackColor,
      glowIntensity = 0,
      speed = 3,
      showScales = true,
      showEye = true,
      eyeColor,
      strokeWidth = 3.5,
      onCycleComplete,
      label = "Cargando…",
      motion = "auto",
      style,
      ...props
    },
    ref,
  ) => {
    const systemReduced = useReducedMotion();
    const reduced = motion === "none" || (motion === "auto" && systemReduced);
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
            // Determinista: Math.random() en render rompe la hidratación SSR.
            r: 1.2 + ((i * 7) % 10) * 0.08,
          };
        }),
      [],
    );

    const startAnimation = useCallback(() => {
      const snake = snakeRef.current;
      const container = containerRef.current;
      const scalesEl = scalesRef.current;
      if (!snake || !container || reduced) return;

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
    }, [speed, showScales, onCycleComplete, reduced]);

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

    return (
      <div
        ref={containerRef}
        role="status"
        aria-label={label}
        aria-busy={isProcessing}
        data-part="root"
        data-motion={reduced ? "none" : undefined}
        className={cn("relative flex items-center justify-center", className)}
        style={{
          width: size,
          height: size,
          ...(loadingColor && { "--voy-snake": loadingColor }),
          ...(trackColor && { "--voy-track": trackColor }),
          ...(eyeColor && { "--voy-eye": eyeColor }),
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        <svg
          data-part="snake"
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ filter: glowIntensity > 0 ? `drop-shadow(0 0 ${glowPx}px color-mix(in srgb, ${SNAKE} ${Math.round(glowIntensity * 38)}%, transparent))` : "drop-shadow(1px 2px 1.5px rgb(0 0 0 / 0.6))" }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: SNAKE }} stopOpacity="1" />
              <stop offset="50%" style={{ stopColor: SNAKE }} stopOpacity="0.4" />
              <stop offset="100%" style={{ stopColor: SNAKE }} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Outer glow ring */}
          <circle cx="50" cy="50" r="44" fill="none" style={{ stroke: SNAKE }} strokeWidth="0.3" opacity="0.15" />

          {/* Base shadow track */}
          <path d="M50 10 A40 40 0 1 1 49.9 10" fill="none" style={{ stroke: TRACK }} strokeWidth={strokeWidth + 1.5} />

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
                <circle key={`scale-${i}`} cx={s.cx} cy={s.cy} r={s.r} style={{ fill: SNAKE }} opacity="0.2" />
              ))}
            </g>
          )}

          {/* Snake head */}
          <circle cx="50" cy="10" r="5" style={{ fill: SNAKE }} opacity="0.9" />
          {/* Eye */}
          {showEye && <circle cx="50" cy="9" r="1.5" style={{ fill: EYE }} />}
          {/* Jaw/fang */}
          <polygon points="50,5 54,15 46,15" style={{ fill: EYE }} opacity="0.6" />
        </svg>

        {/* Center mystical artifact */}
        <div aria-hidden="true" className="absolute flex items-center justify-center" style={{ width: size * 0.2, height: size * 0.2 }}>
          <div
            className="w-full h-full rounded-full border border-current/20 flex items-center justify-center"
            style={{ background: `radial-gradient(circle, color-mix(in srgb, ${SNAKE} 6%, transparent) 0%, transparent 70%)` }}
          >
            <div className="w-1/3 h-1/3 rounded-full" style={{ backgroundColor: `color-mix(in srgb, ${SNAKE} 19%, transparent)` }} />
          </div>
        </div>
      </div>
    );
  },
);
OuroborosSpinner.displayName = "OuroborosSpinner";