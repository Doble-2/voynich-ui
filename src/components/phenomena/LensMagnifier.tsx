import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/useReducedMotion";

export type LensShape = "circle" | "square" | "rounded-square";
/**
 * Tinte del cristal. `grayscale`, `invert` y `x-ray` están obsoletos (efectos de pantalla, no de vidrio):
 * se aceptan por compatibilidad pero se dibujan sin tinte y se eliminarán en la próxima versión menor.
 */
export type LensFilter = "none" | "sepia" | "vintage" | "grayscale" | "invert" | "x-ray";

export interface LensMagnifierProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  zoomLevel?: number;
  lensSize?: number;
  lensBorder?: number;
  lensShape?: LensShape;
  lensColor?: string;
  filter?: LensFilter;
  showHandle?: boolean;
  smoothFollowing?: boolean;
}

export interface LensMagnifierRef {
  resetZoom: () => void;
}

export const LensMagnifier = forwardRef<LensMagnifierRef, LensMagnifierProps>(
  (
    {
      src,
      alt = "",
      zoomLevel = 2,
      lensSize = 150,
      lensBorder = 4,
      lensShape = "circle",
      lensColor = "border-voynich-brass",
      filter = "none",
      showHandle = false,
      smoothFollowing = true,
      className,
      onKeyDown,
      tabIndex,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();
    const follow = smoothFollowing && !reduced ? 0.35 : 0;
    const containerRef = useRef<HTMLDivElement>(null);
    const lensRef = useRef<HTMLDivElement>(null);
    const zoomedImgRef = useRef<HTMLImageElement>(null);

    const [isActive, setIsActive] = useState(false);

    // Cinemática centralizada en GSAP en lugar de variables manuales mutables.
    // Guardamos la posición destino dictada por el ratón (Mouse Move)
    const targetPos = useRef({ x: 0, y: 0 });
    // Guardamos las dimensiones del contenedor padre
    const containerSize = useRef({ w: 0, h: 0 });

    useImperativeHandle(ref, () => ({
      resetZoom: () => setIsActive(false),
    }));

    useGSAP(() => {
      const lens = lensRef.current;
      const zoomImg = zoomedImgRef.current;

      if (!isActive || !lens || !zoomImg) return;
      
      // Asegurar que el tamaño inicial de la imagen zoomed está seteado
      if (containerSize.current.w > 0) {
         gsap.set(zoomImg, {
           width: containerSize.current.w * zoomLevel,
           height: containerSize.current.h * zoomLevel
         });
      }

      // Animación de entrada de la lente
      gsap.to(lens, {
         opacity: 1,
         scale: 1,
         duration: reduced ? 0 : 0.4,
         ease: "back.out(1.5)"
      });

      // Creamos un quickTo para optimizar el seguimiento sin disparar renders o múltiples tweens
      // x, y para la Lente (Contenedor Recortado)
      const xToLens = gsap.quickTo(lens, "x", { duration: follow, ease: "power3.out" });
      const yToLens = gsap.quickTo(lens, "y", { duration: follow, ease: "power3.out" });
      
      // x, y para la Imagen ampliada interna (Movimiento opuesto para el recorte)
      const xToImg = gsap.quickTo(zoomImg, "x", { duration: follow, ease: "power3.out" });
      const yToImg = gsap.quickTo(zoomImg, "y", { duration: follow, ease: "power3.out" });

      const syncLoop = () => {
        const { x, y } = targetPos.current;

        // Lente persigue al ratón centralmente
        xToLens(x - lensSize / 2);
        yToLens(y - lensSize / 2);

        // Imagen subyacente se mueve en dirección contraria escalada
        xToImg((x * -zoomLevel) + (lensSize / 2));
        yToImg((y * -zoomLevel) + (lensSize / 2));
      };

      gsap.ticker.add(syncLoop);

      return () => {
         gsap.ticker.remove(syncLoop);
      };
    }, { dependencies: [isActive, follow, reduced, zoomLevel, lensSize], scope: containerRef });

    // Animación de salida de la lente (Independiente del Ticker activo)
    useGSAP(() => {
      const lens = lensRef.current;
      if (!isActive && lens) {
        gsap.to(lens, {
           opacity: 0,
           scale: 0.6,
           duration: reduced ? 0 : 0.3,
           ease: "power2.in"
        });
      }
    }, { dependencies: [isActive], scope: containerRef });

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetPos.current.x = e.clientX - rect.left;
      targetPos.current.y = e.clientY - rect.top;

      if (!isActive) {
        containerSize.current.w = containerRef.current.offsetWidth;
        containerSize.current.h = containerRef.current.offsetHeight;
        setIsActive(true);
      }
    };

    const handleMouseEnter = () => {
      if (containerRef.current) {
        containerSize.current.w = containerRef.current.offsetWidth;
        containerSize.current.h = containerRef.current.offsetHeight;
        // Asignamos una posición base inicial si el componente es enfocado antes de moverse
        targetPos.current.x = containerSize.current.w / 2;
        targetPos.current.y = containerSize.current.h / 2;
      }
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    // Teclado: al enfocar, la lente aparece en el centro; las flechas la mueven y Escape la aparta.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      const step = e.shiftKey ? 60 : 20;
      const delta: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
      };
      if (e.key === "Escape") return setIsActive(false);
      const d = delta[e.key];
      if (!d) return;
      e.preventDefault();
      if (!isActive) handleMouseEnter();
      const { w, h } = containerSize.current;
      targetPos.current.x = Math.max(0, Math.min(w, targetPos.current.x + d[0]));
      targetPos.current.y = Math.max(0, Math.min(h, targetPos.current.y + d[1]));
    };

    const getShapeRadius = (shape: LensShape) => {
      switch (shape) {
        case "square":
          return "0%";
        case "rounded-square":
          return "15%";
        case "circle":
        default:
          return "50%";
      }
    };

    const getFilterStyle = (f: LensFilter) => {
      switch (f) {
        case "sepia":
          return "sepia(80%) contrast(1.2)";
        case "vintage":
          return "sepia(50%) contrast(1.5) brightness(0.9) hue-rotate(-15deg)";
        case "none":
        default:
          return "none";
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          "voy-paper relative overflow-hidden cursor-none select-none touch-none group border border-voynich-inkDark/40",
          "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4",
          className,
        )}
        data-part="root"
        data-active={isActive}
        role="group"
        aria-roledescription="lupa"
        aria-label={alt ? `${alt} (con lupa: usa las flechas para moverla)` : "Imagen con lupa: usa las flechas para moverla"}
        tabIndex={tabIndex ?? 0}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove}
        onPointerLeave={handleMouseLeave}
        onPointerEnter={handleMouseEnter}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover pointer-events-none transition-[filter] duration-300"
          style={{
            filter: isActive ? "brightness(0.9) grayscale(20%)" : "none",
          }}
          draggable={false}
        />

        <div
          ref={lensRef}
          data-part="lens"
          aria-hidden="true"
          className="absolute top-0 left-0 z-10 pointer-events-none overflow-visible will-change-transform opacity-0"
          style={{
            width: lensSize,
            height: lensSize,
          }}
        >
          {showHandle && lensShape === "circle" && (
            <div
              className="absolute left-1/2 top-[95%] w-[12%] h-[80%] rounded-b-md rounded-t-sm origin-top -translate-x-1/2 rotate-[35deg] z-0"
              style={{
                // Mango de madera torneada con abrazaderas de latón.
                backgroundColor: "rgb(74 48 28)",
                backgroundImage: "linear-gradient(90deg, rgb(0 0 0 / 0.4) 0%, transparent 35%, transparent 65%, rgb(0 0 0 / 0.45) 100%), var(--voynich-surface-leather)",
                backgroundSize: "auto, 240px 240px",
                boxShadow: "inset 1px 0 0 rgb(255 236 196 / 0.18), 3px 6px 8px rgb(0 0 0 / 0.45)",
              }}
            >
              <div className="absolute top-[8%] w-full h-[7%]" style={{ backgroundColor: "rgb(var(--voynich-brass))", boxShadow: "inset 0 1px 0 rgb(var(--voynich-gold-light) / 0.6), 0 1px 1px rgb(0 0 0 / 0.5)" }} />
              <div className="absolute top-[78%] w-full h-[7%]" style={{ backgroundColor: "rgb(var(--voynich-brass))", boxShadow: "inset 0 1px 0 rgb(var(--voynich-gold-light) / 0.6), 0 1px 1px rgb(0 0 0 / 0.5)" }} />
            </div>
          )}

          <div
            className={cn(
              "absolute inset-0 overflow-hidden bg-voynich-vellum z-10 border-solid",
              lensColor,
            )}
            style={{
              borderRadius: getShapeRadius(lensShape),
              borderWidth: lensBorder,
              // Bisel de latón con luz arriba-izquierda y sombra proyectada sobre la mesa.
              boxShadow:
                "inset 1.5px 1.5px 1px rgb(var(--voynich-gold-light) / 0.5), inset -1.5px -1.5px 1px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(var(--voynich-brass-deep)), 6px 14px 18px rgb(0 0 0 / 0.5)",
              backgroundImage: "var(--voynich-surface-bronze)",
            }}
          >
            <div className="absolute inset-0 origin-top-left pointer-events-none blur-[0.3px]">
              <img
                ref={zoomedImgRef}
                src={src}
                alt=""
                aria-hidden="true"
                className="absolute max-w-none pointer-events-none will-change-transform object-cover"
                draggable={false}
                style={{
                  filter: getFilterStyle(filter),
                }}
              />
            </div>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: getShapeRadius(lensShape),
                // El cristal es más grueso en el borde: se oscurece hacia fuera. No hay brillo pintado.
                background: "radial-gradient(circle at 50% 50%, transparent 62%, rgb(20 12 4 / 0.28) 100%)",
                boxShadow: "inset 0 0 14px rgb(0 0 0 / 0.35)",
              }}
            />
          </div>
        </div>
      </div>
    );
  },
);

LensMagnifier.displayName = "LensMagnifier";
