import React, { useRef, useCallback, useImperativeHandle } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface HomunculusVesselRef {
  /** Llena el recipiente hasta el nivel indicado, con animación opcional. */
  fill: (value: number, duration?: number) => void;
  /** Vacía el recipiente a 0. */
  reset: () => void;
  /** Dispara un efecto visual de pulso en el líquido. */
  pulse: () => void;
}

export interface HomunculusVesselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onProgress'> {
  /** Nivel del líquido (0–100). @default 0 */
  progress?: number;
  /** Etiqueta inferior del recipiente. @default "Transmuting..." */
  label?: string;
  /** Color principal del líquido alquímico. @default "#00d2ff" */
  loadingColor?: string;
  /** Color del contorno del frasco. @default "#5c331d" */
  glassColor?: string;
  /** Color del tapón. @default "#3a2a1a" */
  corkColor?: string;
  /** Color del fondo interior del frasco. @default "#0a0704" */
  bgColor?: string;
  /** Tamaño del recipiente: preset o px custom. @default "md" */
  size?: "sm" | "md" | "lg" | number;
  /** Mostrar/ocultar el tapón de corcho. @default true */
  showCork?: boolean;
  /** Activar/desactivar burbujas. @default true */
  showBubbles?: boolean;
  /** Amplitud de la onda en la superficie. @default 2.5 */
  waveAmplitude?: number;
  /** Duración de un ciclo de onda completo (segundos). @default 8 */
  waveSpeed?: number;
  /** className adicional para la etiqueta. */
  labelClassName?: string;
  /** Mostrar/ocultar la etiqueta. @default true */
  showLabel?: boolean;
  /** Mostrar el porcentaje junto a la etiqueta. @default true */
  showPercent?: boolean;
  /** Frecuencia de generación de burbujas (ms entre cada intento). @default 150 */
  bubbleRate?: number;
  /** Intensidad del resplandor (0–1). @default 0.27 */
  glowIntensity?: number;
  /** Callback en cada cambio de progreso animado. */
  onProgress?: (value: number) => void;
  /** Callback cuando el líquido llega a 100%. */
  onComplete?: () => void;
  /** Callback cuando el líquido llega a 0%. */
  onEmpty?: () => void;
}

const SIZE_MAP = { sm: { w: "w-20", h: "h-24" }, md: { w: "w-28", h: "h-32" }, lg: { w: "w-40", h: "h-44" } };

export const HomunculusVessel = React.forwardRef<HomunculusVesselRef, HomunculusVesselProps>(
  (
    {
      className,
      progress = 0,
      label = "Transmuting...",
      loadingColor = "#00d2ff",
      glassColor = "#5c331d",
      corkColor = "#3a2a1a",
      bgColor = "#0a0704",
      size = "md",
      showCork = true,
      showBubbles = true,
      waveAmplitude = 2.5,
      waveSpeed = 8,
      labelClassName,
      showLabel = true,
      showPercent = true,
      bubbleRate = 150,
      glowIntensity = 0.27,
      onProgress,
      onComplete,
      onEmpty,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const liquidRef = useRef<SVGPathElement>(null);
    const bubblesRef = useRef<SVGGElement>(null);
    const waveRef = useRef<SVGPathElement>(null);
    const progressRef = useRef(progress);
    const prevProgressRef = useRef(progress);

    // Resolve size
    const sizeClasses = typeof size === "string" ? SIZE_MAP[size] : null;
    const customSizeStyle = typeof size === "number" ? { width: size, height: size * (32 / 28) } : undefined;

    /*
     * Flask interior geometry:
     *   Neck:   x ∈ [40, 60]   at y = 10
     *   Flare:  x ∈ [40, 60]   at y = 30  (neck meets body)
     *   Base:   x ∈ [10, 90]   at y = 90  (widest point)
     *   Bottom: curved via Q 50,95
     *
     * For a given Y between 30..90, the left wall X is:
     *   leftX(y) = 40 - (y - 30) * (30 / 60)  =  40 - (y-30)*0.5
     *   rightX(y) = 60 + (y - 30) * (30 / 60)  = 60 + (y-30)*0.5
     *
     * For Y between 10..30 (neck), walls are vertical: leftX=40, rightX=60
     */
    const getWallX = useCallback((y: number) => {
      if (y <= 30) return { left: 40, right: 60 };
      if (y >= 90) return { left: 10, right: 90 };
      const t = (y - 30) / 60;
      return { left: 40 - t * 30, right: 60 + t * 30 };
    }, []);

    const buildLiquidPath = useCallback(
      (level: number, amp: number = 0, phase: number = 0) => {
        const { left: lx, right: rx } = getWallX(level);
        const midX = (lx + rx) / 2;
        const quarterX = (lx + midX) / 2;
        const threeQuarterX = (midX + rx) / 2;

        const w1 = Math.sin(phase) * amp;
        const w2 = Math.sin(phase + 2) * amp;
        const w3 = Math.sin(phase + 4) * amp;

        return [
          `M ${lx},${level + w1}`,
          `Q ${quarterX},${level + w2 - amp * 0.5} ${midX},${level + w3}`,
          `Q ${threeQuarterX},${level + w2 + amp * 0.5} ${rx},${level + w1}`,
          `L 90,90`,
          `Q 50,96 10,90`,
          `L ${lx},${level + w1}`,
          `Z`,
        ].join(" ");
      },
      [getWallX],
    );

    // Imperative handle
    useImperativeHandle(ref, () => ({
      fill: (value: number, duration = 0.8) => {
        const clamped = Math.max(0, Math.min(100, value));
        const level = 88 - (clamped / 100) * 68;
        progressRef.current = clamped;
        if (liquidRef.current) {
          gsap.to(liquidRef.current, {
            attr: { d: buildLiquidPath(level, 0) },
            duration,
            ease: "power2.out",
          });
        }
        onProgress?.(clamped);
        if (clamped >= 100) onComplete?.();
        if (clamped <= 0) onEmpty?.();
      },
      reset: () => {
        progressRef.current = 0;
        if (liquidRef.current) {
          gsap.to(liquidRef.current, {
            attr: { d: buildLiquidPath(88, 0) },
            duration: 0.6,
            ease: "power2.out",
          });
        }
        onEmpty?.();
      },
      pulse: () => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            scale: 1.08,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          });
        }
      },
    }));

    useGSAP(
      () => {
        const liquid = liquidRef.current;
        const wave = waveRef.current;
        const bubbles = bubblesRef.current;
        if (!liquid || !wave) return;

        const safeProgress = Math.max(0, Math.min(100, progress));
        const level = 88 - (safeProgress / 100) * 68;
        progressRef.current = safeProgress;

        // Fire callbacks on progress change
        if (safeProgress !== prevProgressRef.current) {
          onProgress?.(safeProgress);
          if (safeProgress >= 100 && prevProgressRef.current < 100) onComplete?.();
          if (safeProgress <= 0 && prevProgressRef.current > 0) onEmpty?.();
          prevProgressRef.current = safeProgress;
        }

        // Set liquid level with smooth transition
        gsap.to(liquid, {
          attr: { d: buildLiquidPath(level, 0) },
          duration: 0.8,
          ease: "power2.out",
        });

        // Continuous wave animation on the surface
        const waveAnim = { phase: 0 };
        gsap.to(waveAnim, {
          phase: Math.PI * 20,
          duration: waveSpeed,
          ease: "none",
          repeat: -1,
          onUpdate: () => {
            if (wave) {
              wave.setAttribute("d", buildLiquidPath(level, waveAmplitude, waveAnim.phase));
            }
          },
        });

        // Generate bubbles
        const intervals: ReturnType<typeof setInterval>[] = [];
        if (showBubbles && bubbles && safeProgress > 0 && safeProgress < 100) {
          const createBubble = () => {
            if (!bubbles || Math.random() > 0.4) return;
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const r = 0.8 + Math.random() * 2.2;
            circle.setAttribute("r", `${r}`);
            circle.setAttribute("fill", loadingColor);
            circle.setAttribute("opacity", "0.5");
            const startY = 85 + Math.random() * 5;
            const { left, right } = getWallX(startY);
            const startX = left + 5 + Math.random() * (right - left - 10);
            circle.setAttribute("cx", `${startX}`);
            circle.setAttribute("cy", `${startY}`);
            bubbles.appendChild(circle);

            gsap.to(circle, {
              cy: level + Math.random() * 5,
              cx: startX + (Math.random() - 0.5) * 12,
              opacity: 0,
              scale: 0.3,
              duration: 1.2 + Math.random() * 2,
              ease: "power1.out",
              onComplete: () => {
                if (circle.parentNode) circle.parentNode.removeChild(circle);
              },
            });
          };
          const interval = setInterval(createBubble, bubbleRate);
          intervals.push(interval);
        }

        return () => {
          intervals.forEach(clearInterval);
        };
      },
      [progress, loadingColor, showBubbles, waveAmplitude, waveSpeed, bubbleRate, buildLiquidPath, getWallX, onProgress, onComplete, onEmpty],
    );

    const glowAlpha = Math.round(glowIntensity * 255)
      .toString(16)
      .padStart(2, "0");

    return (
      <div
        ref={containerRef}
        className={cn("relative flex flex-col items-center justify-center space-y-4", className)}
        {...props}
      >
        <svg
          viewBox="0 0 100 110"
          className={sizeClasses ? `${sizeClasses.w} ${sizeClasses.h}` : undefined}
          style={{
            filter: `drop-shadow(0 0 12px ${loadingColor}${glowAlpha})`,
            ...(customSizeStyle || {}),
          }}
        >
          <defs>
            {/* Clip path matching the flask interior */}
            <clipPath id="flask-interior">
              <path d="M40,12 L60,12 L60,30 L88,89 Q50,96 12,89 L40,30 Z" />
            </clipPath>
            {/* Gradient for liquid depth */}
            <linearGradient id="liquid-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={loadingColor} stopOpacity="0.5" />
              <stop offset="40%" stopColor={loadingColor} stopOpacity="0.7" />
              <stop offset="100%" stopColor={loadingColor} stopOpacity="0.9" />
            </linearGradient>
            {/* Subtle glass reflection gradient */}
            <linearGradient id="glass-sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0.12" />
              <stop offset="50%" stopColor="white" stopOpacity="0.02" />
              <stop offset="100%" stopColor="white" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          {/* Flask body fill (dark interior) */}
          <path d="M40,12 L60,12 L60,30 L88,89 Q50,96 12,89 L40,30 Z" fill={bgColor} opacity="0.6" />

          {/* Liquid — clipped to flask interior */}
          <g clipPath="url(#flask-interior)">
            {/* Solid liquid body */}
            <path ref={liquidRef} d={buildLiquidPath(88)} fill="url(#liquid-gradient)" />
            {/* Animated wave surface (slightly brighter) */}
            <path ref={waveRef} d={buildLiquidPath(88, 2)} fill={loadingColor} opacity="0.35" />
            {/* Bubbles container */}
            <g ref={bubblesRef} />
          </g>

          {/* Flask outline */}
          <path
            d="M40,10 L60,10 L60,30 L90,90 Q50,96 10,90 L40,30 Z"
            fill="none"
            stroke={glassColor}
            strokeWidth="2.5"
            opacity="0.85"
          />

          {/* Neck ring detail */}
          <line x1="38" y1="10" x2="62" y2="10" stroke={glassColor} strokeWidth="3" opacity="0.7" />
          <line x1="38" y1="12" x2="62" y2="12" stroke={glassColor} strokeWidth="1.5" opacity="0.4" />

          {/* Glass highlight — left edge */}
          <path d="M38,30 L18,85" fill="none" stroke="white" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
          {/* Glass highlight — right subtle */}
          <path d="M62,30 L80,82" fill="none" stroke="white" strokeWidth="0.8" opacity="0.06" strokeLinecap="round" />

          {/* Glass sheen overlay */}
          <path d="M40,12 L60,12 L60,30 L88,89 Q50,96 12,89 L40,30 Z" fill="url(#glass-sheen)" />

          {/* Cork / stopper on top */}
          {showCork && (
            <>
              <rect x="42" y="4" width="16" height="7" rx="2" fill={corkColor} opacity="0.7" />
              <rect
                x="43"
                y="5"
                width="14"
                height="2"
                rx="1"
                fill={corkColor}
                opacity="0.5"
                style={{ filter: "brightness(1.4)" }}
              />
            </>
          )}
        </svg>

        {/* Label */}
        {showLabel && (
          <div className={cn("font-mono text-xs text-[#eadbb6] tracking-widest uppercase opacity-80", labelClassName)}>
            {label} {showPercent && `${Math.round(progress)}%`}
          </div>
        )}
      </div>
    );
  },
);
HomunculusVessel.displayName = "HomunculusVessel";