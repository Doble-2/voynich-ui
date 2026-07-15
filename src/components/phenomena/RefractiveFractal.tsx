import React, { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

/**
 * Propiedades del componente RefractiveFractal.
 * Extiende las propiedades nativas de HTML para permitir el paso
 * de eventos (onClick, onMouseEnter, etc) y atributos estándar.
 */
export interface RefractiveFractalProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Permite inyectar un nodo subyacente personalizado.
   * Útil para accesibilidad o integración con librerías de enrutamiento/animación.
   * @default 'div'
   * @example as="button" // Renderiza una etiqueta boton
   * @example as={motion.div} // Framer motion wrap
   */
  as?: React.ElementType;
  /**
   * Determina la resolución y el nivel de detalle matemático del ruido de perlin generado.
   * @default 5
   * @range Rango recomendado: 1 (Formas suaves/blandas) a 10 (Texturas rugosas/Mandelbrot pesado)
   */
  complexity?: number;
  /**
   * La escala de la distorsión, fuerza con la que la onda "rompe" la silueta del hijo.
   * Valores altos causan derrames de color y formas abstractas extremas.
   * @default 30
   * @range Valores útiles: 0 a 300+
   */
  refractionFactor?: number;
  /**
   * Escala de acercamiento a la ecuación generadora fractal.
   * Un valor bajo crea manchas gigantes; un valor alto crea un granulado apretado o rasguños.
   * Puedes pasar dos valores en string como "X Y" para crear vetas horizontales/verticales asimétricas.
   * @default 0.02
   * @example 0.005 // Distorsión a macro-escala fluida.
   * @example "0.2 0.001" // Ruido tipo fallo analógico (glitch o madera).
   */
  frequency?: string | number;
  /**
   * Semilla lógica del random mathizer. Garantiza que obtendrás exactamente
   * el mismo patrón visual para los mismos valores. O te permite cambiar la identidad si se repite.
   * @default 0
   */
  seed?: number;
  /**
   * Define si el fractal debe mutar con el tiempo.
   * Al habilitarse, inyecta un loop infinito mediado por GSAP.
   * @default false
   */
  animate?: boolean;
  /**
   * Si `animate` está activo, establece la duración (en segundos) de un ciclo respiratorio completo.
   * @default 10
   */
  speed?: number;
  /**
   * Fuerza el estado de caos visual sin interacción directa del cursor.
   * Ideal para ser orquestado externamente por ScrollTrigger u otros eventos abstractos.
   * @default false
   */
  isDisturbed?: boolean;
}

/**
 * `RefractiveFractal`
 *
 * Un componente envoltura polimórfico que inyecta filtros nativos SVG avanzados (feTurbulence y feDisplacementMap)
 * a cualquier contenido que le pongas dentro (textos, degradados o imágenes).
 * Animado 100% mediante GSAP mutando parámetros en requestAnimationFrame.
 */
export const RefractiveFractal = React.forwardRef<
  HTMLElement,
  RefractiveFractalProps
>(
  (
    {
      as: Tag = "div",
      complexity = 5,
      refractionFactor = 30,
      frequency = 0.02,
      seed = 0,
      animate = false,
      speed = 10,
      isDisturbed = false,
      className,
      children,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    forwardedRef,
  ) => {
    const id = useId();
    // Limpiamos los dos puntos para que el ID sea seguro para CSS
    const filterId = `fractal-${id.replace(/:/g, "")}`;

    // Ref interna de GSAP 
    const containerRef = useRef<HTMLElement>(null);
    const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
    const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

    // Merge directo entre el `forwardedRef` y nuestra `containerRef` interna
    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        // @ts-expect-error Types mismatch but it's safe 
        containerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      [forwardedRef],
    );

    // Parseo seguro de frecuencias asimétricas
    const [parsedFreqX, parsedFreqY] = typeof frequency === "string"
      ? frequency.split(" ").map(Number).concat(Number(frequency.split(" ")[0]))
      : [Number(frequency), Number(frequency)];
    const actFreqY = isNaN(parsedFreqY) ? parsedFreqX : parsedFreqY;

    // Configuración intensiva de GSAP
    useGSAP(() => {
      const feTurbulence = turbulenceRef.current;
      const feDisplacement = displacementRef.current;
      const container = containerRef.current;

      if (!feTurbulence || !feDisplacement || !container) return;

      // Objeto proxy para cambiar numéricamente evitando renders en React
      const proxy = {
        freqX: parsedFreqX,
        freqY: actFreqY,
        scale: refractionFactor,
      };

      const updateAttributes = () => {
        feTurbulence.setAttribute("baseFrequency", `${proxy.freqX} ${proxy.freqY}`);
        feDisplacement.setAttribute("scale", proxy.scale.toString());
      };

      // Establecer valores iniciales correctos en SVG
      updateAttributes();

      // Animación 1: Respiración Orgánica (Base loop)
      let breatheAnimation: gsap.core.Tween | null = null;
      if (animate) {
        breatheAnimation = gsap.to(proxy, {
          freqX: parsedFreqX * 1.5,
          freqY: actFreqY * 1.5,
          duration: speed / 2, // mitad debido al yoyo
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          onUpdate: updateAttributes,
        });
      }

      // Animación 2: Caos Controlado (Latidos/Refracción agresiva)
      const triggerChaos = () => {
        if (breatheAnimation) breatheAnimation.pause();
        
        gsap.killTweensOf(proxy);
        gsap.to(proxy, {
          freqX: parsedFreqX * 2.5,
          freqY: actFreqY * 0.8, // asimetría de ruido rasgado para verse místico
          scale: refractionFactor * 2.5, // "romperá" la tinta o contenedor fuertemente
          duration: 0.4,
          ease: "back.out(2.5)", // Fuerte chasquido o latido errático
          onUpdate: updateAttributes,
        });
      };

      const calmDown = () => {
        gsap.killTweensOf(proxy);
        gsap.to(proxy, {
          freqX: parsedFreqX,
          freqY: actFreqY,
          scale: refractionFactor,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)", // Fricción celular, como una telaraña temblando
          onUpdate: updateAttributes,
          onComplete: () => {
            if (breatheAnimation && animate) {
              breatheAnimation.play();
            }
          }
        });
      };

      // Si muta props directas sin MouseEvent (para ScrollTrigger o Timeline externa global)
      if (isDisturbed) {
        triggerChaos();
      } else if (!isDisturbed && proxy.scale !== refractionFactor) { // Evitamos reset en montajes
        calmDown();
      }

      // Eventos Hover Manuales (Si el componente soporta puntero)
      const handleMouseEnter = () => triggerChaos();
      const handleMouseLeave = () => calmDown();

      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        if (breatheAnimation) breatheAnimation.kill();
        gsap.killTweensOf(proxy);
      };

    }, {
      dependencies: [animate, speed, parsedFreqX, actFreqY, refractionFactor, isDisturbed],
      scope: containerRef,
    });

    return (
      <Tag
        ref={setRefs}
        className={cn("relative overflow-visible", className)}
        style={{ filter: `url(#${filterId})`, ...style }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        <svg
          className="absolute w-[0px] h-[0px] pointer-events-none -left-[9999px]"
          aria-hidden="true"
        >
          <defs>
            <filter
              id={filterId}
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
              colorInterpolationFilters="sRGB"
            >
              {/* GSAP tomará el control total de ref y values numéricos de feTurbulence */}
              <feTurbulence
                ref={turbulenceRef}
                type="fractalNoise"
                baseFrequency={frequency}
                numOctaves={complexity}
                seed={seed}
                result="noise"
              />

              {/* Lente de refracción gráfica controlada por feDisplacementMap */}
              <feDisplacementMap
                ref={displacementRef}
                in="SourceGraphic"
                in2="noise"
                scale={refractionFactor}
                xChannelSelector="R"
                yChannelSelector="G"
                result="displacement"
              />
            </filter>
          </defs>
        </svg>
        {children}
      </Tag>
    );
  },
);

RefractiveFractal.displayName = "RefractiveFractal";
