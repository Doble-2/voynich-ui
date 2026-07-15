import React, { useId, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

type DissolveMode = "burn" | "evaporate";
type DissolveOrigin = "top" | "right" | "bottom" | "left";
type BurnFlameVariant = "front" | "particles";
type BurnPattern = "center" | "edge";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

const axisMap: Record<
  DissolveOrigin,
  {
    gradientDirection: string;
    driftX: number;
    driftY: number;
  }
> = {
  top: { gradientDirection: "to bottom", driftX: 0, driftY: 22 },
  right: { gradientDirection: "to left", driftX: 22, driftY: -10 },
  bottom: { gradientDirection: "to top", driftX: 0, driftY: -32 },
  left: { gradientDirection: "to right", driftX: -22, driftY: -10 },
};

const getEdgeMaskImage = (
  origin: DissolveOrigin,
  progress: number,
  edgeWidth: number,
) => {
  const direction = axisMap[origin].gradientDirection;
  const edge = clamp(progress * 100, 0, 100);
  const softA = clamp(edge + edgeWidth * 44, 0, 100);
  const softB = clamp(edge + edgeWidth * 88, 0, 100);

  return `linear-gradient(${direction}, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${edge}%, rgba(0,0,0,0.56) ${softA}%, rgba(0,0,0,0.95) ${softB}%, rgba(0,0,0,1) 100%)`;
};

const seededUnit = (seed: number, index: number) => {
  const value = Math.sin((index + 1) * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const buildBurnPath = (
  width: number,
  height: number,
  progress: number,
  seeds: number[],
  jitter: number,
  tick: number,
  animate: boolean,
  paused: boolean,
  origin: DissolveOrigin,
  pattern: BurnPattern,
) => {
  const count = seeds.length;
  let centerX = width / 2;
  let centerY = height / 2;

  if (pattern === "edge") {
    switch (origin) {
      case "top":
        centerY = -height * 0.28;
        break;
      case "right":
        centerX = width * 1.28;
        break;
      case "bottom":
        centerY = height * 1.28;
        break;
      case "left":
        centerX = -width * 0.28;
        break;
    }
  }

  const maxRadius = Math.hypot(width, height) * 0.62;
  const baseRadius = clamp(progress, 0, 1) * maxRadius;

  if (baseRadius <= 0.4 || count < 3) {
    return "";
  }

  const phase = tick * 0.0022;
  const points: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const seed = seeds[i] ?? 0.5;
    const staticNoise = (seed - 0.5) * jitter;
    const dynamicNoise =
      animate && !paused
        ? Math.sin(phase + i * 1.37) * 0.08 +
          Math.cos(phase * 0.73 + i * 0.91) * 0.05
        : 0;

    const radiusFactor = clamp(0.74 + staticNoise + dynamicNoise, 0.45, 1.38);
    const radius = baseRadius * radiusFactor;

    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }

  if (points.length === 0) {
    return "";
  }

  const first = points[0];
  if (!first) {
    return "";
  }

  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  for (let i = 1; i < points.length; i += 1) {
    const point = points[i];
    if (!point) {
      continue;
    }
    d += ` L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }
  d += " Z";

  return d;
};

const buildBurnPoints = (
  width: number,
  height: number,
  progress: number,
  seeds: number[],
  jitter: number,
  tick: number,
  animate: boolean,
  paused: boolean,
  origin: DissolveOrigin,
  pattern: BurnPattern,
) => {
  const count = seeds.length;
  let centerX = width / 2;
  let centerY = height / 2;

  if (pattern === "edge") {
    switch (origin) {
      case "top":
        centerY = -height * 0.28;
        break;
      case "right":
        centerX = width * 1.28;
        break;
      case "bottom":
        centerY = height * 1.28;
        break;
      case "left":
        centerX = -width * 0.28;
        break;
    }
  }

  const maxRadius = Math.hypot(width, height) * 0.62;
  const baseRadius = clamp(progress, 0, 1) * maxRadius;

  if (baseRadius <= 0.4 || count < 3) {
    return [] as Array<{ x: number; y: number }>;
  }

  const phase = tick * 0.0022;
  const points: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const seed = seeds[i] ?? 0.5;
    const staticNoise = (seed - 0.5) * jitter;
    const dynamicNoise =
      animate && !paused
        ? Math.sin(phase + i * 1.37) * 0.08 +
          Math.cos(phase * 0.73 + i * 0.91) * 0.05
        : 0;

    const radiusFactor = clamp(0.74 + staticNoise + dynamicNoise, 0.45, 1.38);
    const radius = baseRadius * radiusFactor;

    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }

  return points;
};

export interface CinderDissolveProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Elemento base para el contenedor. Funciona al igual que el prop 'as' de Framer Motion o Styled Components.
   */
  as?: React.ElementType;
  /**
   * Valor del progreso del efecto de combustión o evaporación (de 0 a 1).
   */
  progress?: number;
  /**
   * Booleano para encender la animación nativa del componente en vez de usar progress.
   */
  animate?: boolean;
  /**
   * Controla la fluidez: congela la animación en tiempo de ejecución.
   */
  paused?: boolean;
  /**
   * Detiene el efecto a un valor específico del progreso, dejando ver información parcialmente descifrada ("hidden in plain sight").
   */
  pauseAt?: number;
  /**
   * Duración total de la animación en segundos. Ocultar o revelar tarda este tiempo.
   */
  duration?: number;
  /**
   * Modo de bucle. Póngalo en false para que el pergamino se destruya o releve permanentemente.
   */
  loop?: boolean;
  /**
   * Orientación origen del efecto. De arriba hacia abajo o desde un extremo opuesto.
   */
  origin?: DissolveOrigin;
  /**
   * Define el arquetipo visual del efecto: combustión lenta ("burn") o evanescencia ("evaporate").
   */
  mode?: DissolveMode;
  /**
   * Borde del avance de la tinta o fuego.
   */
  edgeWidth?: number;
  /**
   * Modifica la geometría asimétrica usando filtros orgánicos.
   */
  distortion?: number;
  /**
   * Ajuste fino de la irregularidad. Valores mayores provocan rasgos más erráticos.
   */
  turbulence?: number;
  /**
   * Cantidad relativa de partículas emitidas. Simulan restos de botánica o vitela carbonizada.
   */
  particleCount?: number;
  /**
   * Variante gráfica que acompaña el borde "burn".
   */
  flameVariant?: BurnFlameVariant;
  /**
   * ¿La combustión aparece por el centro como desgaste radial o por el borde?
   */
  burnPattern?: BurnPattern;
  /**
   * Define el color hexadecimal cálido/brillante del efecto.
   */
  glowColor?: string;
  /**
   * Define el color del interior de partículas encendidas.
   */
  emberColor?: string;
  /**
   * Color humo o rastro sobrante.
   */
  smokeColor?: string;
  /**
   * Densidad paramétrica que dibuja las perforaciones de vitela descompuesta.
   */
  pointAmount?: number;
  /**
   * Semilla ruidosa usada para el aleatorizado orgánico pero consistente (evita saltos al cambiar pausas).
   */
  burnSeed?: number;
}

export const CinderDissolve = React.forwardRef<
  HTMLElement,
  CinderDissolveProps
>(
  (
    {
      as: Tag = "div",
      progress = 0,
      animate = false,
      paused = false,
      pauseAt,
      duration = 6,
      loop = true,
      origin = "bottom",
      mode = "burn",
      edgeWidth = 0.16,
      distortion = 18,
      turbulence = 0.018,
      particleCount = 12,
      flameVariant = "front",
      burnPattern = "center",
      glowColor,
      emberColor,
      smokeColor,
      pointAmount = 30,
      burnSeed = 21,
      className,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLElement | null>(null);
    const progressProxyRef = useRef({ val: progress, phase: 0 });
    const [size, setSize] = useState({ width: 1, height: 1 });
    const [animatedProgress, setAnimatedProgress] = useState(progress);
    const [tick, setTick] = useState(0);

    const id = useId();
    const safeId = id.replace(/:/g, "");
    const filterId = `cinder-distort-${safeId}`;
    const maskId = `cinder-mask-${safeId}`;
    const flameFilterId = `cinder-flame-filter-${safeId}`;
    const emberGradientId = `cinder-ember-grad-${safeId}`;
    const flameGradientId = `cinder-flame-grad-${safeId}`;

    const safeDuration = Math.max(duration, 0.1);
    const clampedPauseAt =
      pauseAt === undefined ? undefined : clamp(pauseAt, 0, 1);

    // Medición de dimensiones
    useGSAP(() => {
      const node = containerRef.current;
      if (!node || typeof ResizeObserver === "undefined") return;

      const observer = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (rect) {
          setSize({ width: Math.max(1, rect.width), height: Math.max(1, rect.height) });
        }
      });
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    // Loop de GSAP para reemplazar RequestAnimationFrame e interpolar progreso
    useGSAP(() => {
      if (!animate) {
        setAnimatedProgress(progress);
        return;
      }

      if (paused) {
        if (clampedPauseAt !== undefined) {
          setAnimatedProgress(clampedPauseAt);
        }
        return;
      }

      const proxy = progressProxyRef.current;
      proxy.val = 0; // reiniciar loop si cambia animate

      const tween = gsap.to(proxy, {
        val: 1,
        duration: safeDuration,
        ease: "power1.inOut",
        repeat: loop ? -1 : 0,
        onUpdate: () => {
          // Fase cíclica controlada por el progreso del tween
          const currentProgress = proxy.val;

          if (clampedPauseAt !== undefined && currentProgress >= clampedPauseAt) {
            setAnimatedProgress(clampedPauseAt);
            setTick(gsap.ticker.time * 1000);
            tween.pause();
            return;
          }

          setAnimatedProgress(currentProgress);
          setTick(gsap.ticker.time * 1000); // Mantenemos el tick global para el SVG path gen
        }
      });

      return () => {
        tween.kill();
      };
    }, {
      dependencies: [animate, clampedPauseAt, loop, paused, progress, safeDuration]
    });

    const resolvedProgress = clamp(animate ? animatedProgress : progress, 0, 1);
    const boundedEdgeWidth = clamp(edgeWidth, 0.05, 0.35);
    const hasFrontier = resolvedProgress > 0.005 && resolvedProgress < 0.998;

    const palette = useMemo(
      () =>
        mode === "burn"
          ? {
              smoke: smokeColor ?? "rgba(46, 33, 27, 0.54)",
              warm: glowColor ?? "rgba(255, 122, 52, 0.92)",
              hot: emberColor ?? "rgba(255, 231, 168, 0.96)",
              emberA: glowColor ?? "#ff7a1a",
              emberB: emberColor ?? "#ffe8a3",
            }
          : {
              smoke: smokeColor ?? "rgba(203, 213, 225, 0.26)",
              warm: glowColor ?? "rgba(148, 163, 184, 0.46)",
              hot: emberColor ?? "rgba(241, 245, 249, 0.86)",
              emberA: glowColor ?? "#cbd5e1",
              emberB: emberColor ?? "#f8fafc",
            },
      [emberColor, glowColor, mode, smokeColor],
    );

    const seeds = useMemo(
      () =>
        Array.from({ length: Math.max(8, pointAmount) }, (_, index) =>
          seededUnit(burnSeed, index),
        ),
      [burnSeed, pointAmount],
    );

    const burnPath = useMemo(
      () =>
        buildBurnPath(
          size.width,
          size.height,
          resolvedProgress,
          seeds,
          0.62,
          tick,
          animate,
          paused,
          origin,
          burnPattern,
        ),
      [
        animate,
        burnPattern,
        origin,
        paused,
        resolvedProgress,
        seeds,
        size.height,
        size.width,
        tick,
      ],
    );

    const burnPoints = useMemo(
      () =>
        buildBurnPoints(
          size.width,
          size.height,
          resolvedProgress,
          seeds,
          0.62,
          tick,
          animate,
          paused,
          origin,
          burnPattern,
        ),
      [
        animate,
        burnPattern,
        origin,
        paused,
        resolvedProgress,
        seeds,
        size.height,
        size.width,
        tick,
      ],
    );

    const smokePlumes = useMemo(() => {
      if (mode !== "burn") {
        return [] as Array<{
          id: string;
          x: number;
          y: number;
          size: number;
          opacity: number;
          duration: number;
          delay: string;
        }>;
      }

      const total = Math.max(5, Math.ceil(particleCount * 0.62));
      return Array.from({ length: total }, (_, index) => {
        const anchor = burnPoints[
          (index * 3) % Math.max(1, burnPoints.length)
        ] ?? {
          x: size.width * 0.5,
          y: size.height * 0.5,
        };

        return {
          id: `${safeId}-smoke-${index}`,
          x: anchor.x,
          y: anchor.y,
          size: 54 + (index % 4) * 18,
          opacity: 0.18 + (index % 3) * 0.08,
          duration: 3.8 + (index % 4) * 0.7,
          delay: `${-index * 0.38}s`,
        };
      });
    }, [burnPoints, mode, particleCount, safeId, size.height, size.width]);

    const ashParticles = useMemo(() => {
      if (mode !== "burn") {
        return [] as Array<{
          id: string;
          x: number;
          y: number;
          size: number;
          opacity: number;
          duration: number;
          delay: string;
          rotate: number;
        }>;
      }

      const total = Math.max(6, Math.ceil(particleCount * 0.7));
      return Array.from({ length: total }, (_, index) => {
        const anchor = burnPoints[
          (index * 2 + 1) % Math.max(1, burnPoints.length)
        ] ?? {
          x: size.width * 0.5,
          y: size.height * 0.5,
        };

        return {
          id: `${safeId}-ash-${index}`,
          x: anchor.x,
          y: anchor.y,
          size: 4 + (index % 4) * 2,
          opacity: 0.18 + (index % 3) * 0.1,
          duration: 2.4 + (index % 4) * 0.45,
          delay: `${-index * 0.31}s`,
          rotate: (index % 2 === 0 ? -1 : 1) * (8 + (index % 3) * 7),
        };
      });
    }, [burnPoints, mode, particleCount, safeId, size.height, size.width]);

    const flameParticles = useMemo(() => {
      if (mode !== "burn" || flameVariant !== "particles") {
        return [] as Array<{
          id: string;
          x: number;
          y: number;
          width: number;
          height: number;
          duration: number;
          delay: number;
          driftX: number;
          driftY: number;
          sway: number;
        }>;
      }

      const total = Math.max(12, Math.ceil(particleCount * 1.5));
      return Array.from({ length: total }, (_, index) => {
        const step = Math.max(1, Math.floor(burnPoints.length / total));
        const anchor = burnPoints[
          (index * step) % Math.max(1, burnPoints.length)
        ] ?? {
          x: size.width * 0.5,
          y: size.height * 0.5,
        };

        return {
          id: `${safeId}-flame-${index}`,
          x: anchor.x,
          y: anchor.y,
          width: 24 + (index % 5) * 8,
          height: 50 + (index % 4) * 16,
          duration: 0.7 + (index % 3) * 0.3,
          delay: -index * 0.15,
          driftX: (index % 2 === 0 ? -1 : 1) * (8 + (index % 3) * 6),
          driftY: -50 - (index % 4) * 15,
          sway: (index % 2 === 0 ? -1 : 1) * (12 + (index % 3) * 8),
        };
      });
    }, [
      burnPoints,
      mode,
      flameVariant,
      particleCount,
      safeId,
      size.height,
      size.width,
    ]);

    const shouldFreezeMotion =
      paused ||
      (animate &&
        clampedPauseAt !== undefined &&
        resolvedProgress >= clampedPauseAt - 0.0005);

    const distortionScale = clamp(
      distortion * (0.26 + resolvedProgress * 1.08),
      0,
      120,
    );

    const baseFrequency =
      mode === "burn"
        ? `${turbulence} ${turbulence * 1.9}`
        : `${turbulence * 0.72} ${turbulence * 1.32}`;

    const edgeMaskImage = useMemo(
      () => getEdgeMaskImage(origin, resolvedProgress, boundedEdgeWidth),
      [origin, resolvedProgress, boundedEdgeWidth],
    );

    const contentStyle =
      mode === "burn"
        ? {
            filter: `url(#${filterId})`,
            WebkitMask: `url(#${maskId})`,
            mask: `url(#${maskId})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }
        : {
            filter: `url(#${filterId})`,
            WebkitMaskImage: edgeMaskImage,
            maskImage: edgeMaskImage,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          };

    const burnOpacity = hasFrontier
      ? clamp(0.35 + resolvedProgress * 0.62, 0.35, 1)
      : 0;

    const outlineWidth = Math.max(3, Math.min(size.width, size.height) * 0.016);
    const charWidth = outlineWidth * 2.6;
    const glowWidth = outlineWidth * 3.8;
    const flameWidth = outlineWidth * 4.6;

    const lineCap = "round";

    return (
      <Tag
        ref={(node: HTMLElement | null) => {
          containerRef.current = node as HTMLElement | null;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          "relative isolate overflow-hidden rounded-[40%_10%_80%_20%/20%_60%_40%_90%] contrast-[1.2] brightness-[0.9] sepia-[0.3]",
          className,
        )}
        style={style}
        {...props}
      >
        <svg
          className="absolute h-0 w-0 pointer-events-none -left-[9999px]"
          aria-hidden="true"
        >
          <defs>
            <filter
              id={filterId}
              x="-35%"
              y="-35%"
              width="170%"
              height="170%"
              colorInterpolationFilters="sRGB"
            >
              {/* GSAP toma el control del filter base */}
              <feTurbulence
                ref={(node) => {
                  if (node && animate && !shouldFreezeMotion) {
                    gsap.to(node, {
                      attr: { baseFrequency: mode === "burn" ? `${turbulence * 1.4} ${turbulence * 2.4}` : `${turbulence * 0.55} ${turbulence * 1.05}` },
                      duration: Math.max(safeDuration * 0.42, 1.7),
                      repeat: -1,
                      yoyo: true,
                      ease: "sine.inOut",
                    });
                  }
                }}
                type="fractalNoise"
                baseFrequency={baseFrequency}
                numOctaves={3}
                seed={mode === "burn" ? 19 : 41}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={distortionScale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={size.width}
              height={size.height}
            >
              <rect
                x="0"
                y="0"
                width={size.width}
                height={size.height}
                fill="white"
              />
              {mode === "burn" && burnPath && (
                <path d={burnPath} fill="black" />
              )}
            </mask>

            <linearGradient
              id={emberGradientId}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={palette.hot} />
              <stop offset="36%" stopColor={palette.warm} />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>

            <linearGradient
              id={flameGradientId}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255,250,226,0.95)" />
              <stop offset="18%" stopColor="rgba(255,221,154,0.92)" />
              <stop offset="45%" stopColor="rgba(255,145,54,0.84)" />
              <stop offset="72%" stopColor="rgba(217,66,10,0.52)" />
              <stop offset="100%" stopColor="rgba(78,20,4,0)" />
            </linearGradient>

            <filter
              id={flameFilterId}
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feTurbulence
                ref={(node) => {
                  if (node && animate && !shouldFreezeMotion) {
                    gsap.to(node, {
                      attr: { baseFrequency: "0.02 0.14" },
                      duration: 0.8,
                      repeat: -1,
                      yoyo: true,
                      ease: "sine.inOut"
                    });
                  }
                }}
                type="fractalNoise"
                baseFrequency="0.012 0.09"
                numOctaves="2"
                seed="31"
                result="flameNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="flameNoise"
                scale={mode === "burn" ? 26 : 8}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        <div className="relative z-10 h-full w-full" style={contentStyle}>
          {children}
        </div>

        {mode === "burn" && burnPath && (
          <svg
            className={cn(
              "pointer-events-none absolute inset-0 z-20",
              shouldFreezeMotion && "voynich-cinder-frozen",
            )}
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width} ${size.height}`}
            style={{ opacity: burnOpacity }}
            aria-hidden="true"
          >
            <path
              d={burnPath}
              fill="none"
              stroke="rgba(7,4,3,0.92)"
              strokeWidth={charWidth * 1.32}
              strokeLinecap={lineCap}
              strokeLinejoin="round"
              className="voynich-cinder-soot"
            />

            <path
              d={burnPath}
              fill="none"
              stroke="rgba(10,7,5,0.72)"
              strokeWidth={charWidth}
              strokeLinecap={lineCap}
              strokeLinejoin="round"
            />

            <path
              d={burnPath}
              fill="none"
              stroke="rgba(0,0,0,0.68)"
              strokeWidth={outlineWidth}
              strokeLinecap={lineCap}
              strokeLinejoin="round"
            />

            <path
              d={burnPath}
              fill="none"
              stroke={`url(#${emberGradientId})`}
              strokeWidth={glowWidth}
              strokeLinecap={lineCap}
              strokeLinejoin="round"
              className="voynich-cinder-glowstroke"
            />

            {flameVariant === "front" && (
              <path
                d={burnPath}
                fill="none"
                stroke={`url(#${flameGradientId})`}
                strokeWidth={flameWidth}
                strokeLinecap={lineCap}
                strokeLinejoin="round"
                className="voynich-paper-flame"
                filter={`url(#${flameFilterId})`}
              />
            )}
          </svg>
        )}

        {mode === "burn" && hasFrontier && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 z-30",
              shouldFreezeMotion && "voynich-cinder-frozen",
            )}
          >
            {smokePlumes.map((smoke, index) => (
              <span
                key={smoke.id}
                className="voynich-paper-smoke"
                style={
                  {
                    left: `${smoke.x}px`,
                    top: `${smoke.y}px`,
                    width: `${smoke.size}px`,
                    height: `${smoke.size * 0.72}px`,
                    opacity: smoke.opacity,
                    animationDuration: `${smoke.duration}s`,
                    animationDelay: smoke.delay,
                    ["--voynich-smoke-drift-x" as string]: `${(index % 2 === 0 ? -1 : 1) * (12 + (index % 4) * 4)}px`,
                    ["--voynich-smoke-drift-y" as string]: `${-40 - (index % 3) * 14}px`,
                  } as React.CSSProperties
                }
              />
            ))}

            {ashParticles.map((ash, index) => (
              <span
                key={ash.id}
                className="voynich-paper-ash"
                style={
                  {
                    left: `${ash.x}px`,
                    top: `${ash.y}px`,
                    width: `${ash.size}px`,
                    height: `${ash.size * 0.78}px`,
                    opacity: ash.opacity,
                    borderRadius: `50% 50% 55% 45% / 60% 60% 40% 40%`,
                    transform: `translate(-50%, -50%) rotate(${ash.rotate}deg)`,
                    animationDuration: `${ash.duration}s`,
                    animationDelay: ash.delay,
                    ["--voynich-ash-drift-x" as string]: `${axisMap[origin].driftX * 0.22 + (index % 2 === 0 ? -10 : 10)}px`,
                    ["--voynich-ash-drift-y" as string]: `${axisMap[origin].driftY * 1.1 - 34}px`,
                  } as React.CSSProperties
                }
              />
            ))}

            {flameVariant === "particles" &&
              flameParticles.map((flame) => (
                <span
                  key={flame.id}
                  className="voynich-cinder-flame absolute"
                  style={
                    {
                      left: `${flame.x}px`,
                      top: `${flame.y}px`,
                      width: `${flame.width}px`,
                      height: `${flame.height}px`,
                      opacity: 1,
                      animationDuration: `${flame.duration}s`,
                      animationDelay: `${flame.delay}s`,
                      ["--voynich-flame-drift-x" as string]: `${flame.driftX}px`,
                      ["--voynich-flame-drift-y" as string]: `${flame.driftY}px`,
                      ["--voynich-flame-sway" as string]: `${flame.sway}px`,
                      mixBlendMode: "screen",
                      background:
                        "radial-gradient(ellipse at 50% 90%, rgba(255,250,214,1) 0%, rgba(255,210,124,0.95) 15%, rgba(255,120,40,0.85) 40%, rgba(220,45,11,0.5) 65%, rgba(72,16,2,0) 100%)",
                      filter: "blur(3px) saturate(1.4) contrast(1.2)",
                    } as React.CSSProperties
                  }
                />
              ))}
          </div>
        )}
      </Tag>
    );
  },
);

CinderDissolve.displayName = "CinderDissolve";
