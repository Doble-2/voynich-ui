import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

const ITEM_MARGIN = 40;
const FLOAT_EPSILON = 0.001;
const AUTO_ARC_STEP = 2;

const normalizeAngle = (angle: number) => {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

const resolveArcFromAngles = (startAngle: number, endAngle?: number) => {
  if (endAngle === undefined) {
    return undefined;
  }

  const angleDifference = endAngle - startAngle;

  if (angleDifference > 0) {
    return angleDifference;
  }

  if (angleDifference < 0) {
    return angleDifference + 360;
  }

  return 360;
};

const getDistanceLimit = (
  direction: number,
  negativeSpace: number,
  positiveSpace: number,
) => {
  if (direction > FLOAT_EPSILON) {
    return positiveSpace / direction;
  }

  if (direction < -FLOAT_EPSILON) {
    return negativeSpace / Math.abs(direction);
  }

  return Infinity;
};

const fitsInsideContainer = (
  containerWidth: number,
  containerHeight: number,
  centerX: number,
  centerY: number,
  angleInDegrees: number,
  distance: number,
) => {
  const radians = angleInDegrees * (Math.PI / 180);
  const projectedX = centerX + Math.cos(radians) * distance;
  const projectedY = centerY + Math.sin(radians) * distance;

  return (
    projectedX >= ITEM_MARGIN &&
    projectedX <= containerWidth - ITEM_MARGIN &&
    projectedY >= ITEM_MARGIN &&
    projectedY <= containerHeight - ITEM_MARGIN
  );
};

export interface RadialMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface RadialMenuRef {
  /** Abre visualmente el menú disparando la animación matemática hacia el exterior. */
  open: () => void;
  /** Cierra y colapsa los nodos del menú regresándolos a su punto de origen. */
  close: () => void;
  /** Alterna entre abierto/cerrado según el estado anterior. */
  toggle: () => void;
}

export interface RadialMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Lista de elementos del menú con sus respectivos callbacks, íconos y etiquetas de texto.
   */
  icon?: React.ReactNode;

  items: RadialMenuItem[];
  /**
   * Distancia en píxeles hacia la cual se desplazarán los botones hijos desde el centro al florecer.
   * @default 40
   */
  radius?: number;
  /**
   * El nodo visual React central (trigger). Puede ser el avatar de un usuario o un botón nativo.
   * @default Un botón "+" provisto por defecto si no es sustituido.
   */
  centerNode?: React.ReactNode;
  /**
   * Retraso fraccional (en milisegundos) entre la aparición correlativa de cada ítem (Stagger animation).
   * @default 50
   */
  staggerDelay?: number;
  /**
   * Ángulo (en grados polares) desde donde el arco o semicírculo de los botones inicializa.
   * `0` apunta a la derecha, `-90` arriba, `90` abajo, `180` a la izquierda.
   * @default -90
   */
  startAngle?: number;
  /**
   * Ángulo final absoluto del recorrido. Si se define, se transforma internamente en `arc`.
   * Tiene prioridad menor que `arc`.
   */
  endAngle?: number;
  /**
   * El arco total (en grados) donde se distribuirán equitativamente los componentes dentro.
   * Si no se define, se calcula automáticamente en función del espacio disponible del wrapper.
   * @example 180 // Formará un arco de medio círculo.
   */
  arc?: number;
  /**
   * Clases extra para el botón central por defecto.
   */
  buttonClassName?: string;
}

interface RadialMenuLayout {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  autoArc: number;
  autoStartAngle: number;
}

/**
 * `RadialMenu`
 *
 * Un menú contextual esférico que despliega opciones alrededor de un punto central.
 * Utiliza matemáticas euclidianas nativas (Seno y Coseno) para distribuir dinámicamente
 * un Array de ítems según el ángulo inicial y el arco delimitado, garantizando distribución perfecta
 * sin importar el número inyectado.
 */
export const RadialMenu = forwardRef<RadialMenuRef, RadialMenuProps>(
  (
    {
      items,
      radius = 100,
      centerNode,
      staggerDelay = 50,
      startAngle = -90,
      endAngle,
      icon = "+",
      className,
      arc,
      buttonClassName,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [layout, setLayout] = useState<RadialMenuLayout>({
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
      autoArc: 360,
      autoStartAngle: startAngle,
    });
    const WrapperRef = useRef<HTMLDivElement>(null);
    const CenterNodeRef = useRef<HTMLDivElement>(null);

    const explicitArc = arc ?? resolveArcFromAngles(startAngle, endAngle);
    const effectiveArc = explicitArc ?? layout.autoArc;
    const effectiveStartAngle =
      explicitArc === undefined ? layout.autoStartAngle : startAngle;
    const angleStep =
      items.length <= 1
        ? 0
        : effectiveArc === 360
          ? effectiveArc / items.length
          : effectiveArc / Math.max(1, items.length - 1);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }));

    useEffect(() => {
      const updateSize = () => {
        if (!WrapperRef.current || !CenterNodeRef.current) {
          return;
        }

        const wrapperRect = WrapperRef.current.getBoundingClientRect();
        const parentRect =
          WrapperRef.current.parentElement?.getBoundingClientRect();
        const centerRect = CenterNodeRef.current.getBoundingClientRect();

        const shouldUseParentRect =
          !!parentRect &&
          (wrapperRect.width <= centerRect.width + 1 ||
            wrapperRect.height <= centerRect.height + 1);

        const containerRect = shouldUseParentRect ? parentRect : wrapperRect;

        if (!containerRect) {
          return;
        }

        const centerX =
          centerRect.left + centerRect.width / 2 - containerRect.left;
        const centerY =
          centerRect.top + centerRect.height / 2 - containerRect.top;

        let autoArc = 360;
        let autoStartAngle = startAngle;

        if (explicitArc === undefined && radius > 0) {
          let backwardSweep = 0;
          let forwardSweep = 0;

          for (let sweep = 0; sweep <= 180; sweep += AUTO_ARC_STEP) {
            const angle = normalizeAngle(startAngle - sweep);

            if (
              !fitsInsideContainer(
                containerRect.width,
                containerRect.height,
                centerX,
                centerY,
                angle,
                radius,
              )
            ) {
              break;
            }

            backwardSweep = sweep;
          }

          for (let sweep = 0; sweep <= 180; sweep += AUTO_ARC_STEP) {
            const angle = normalizeAngle(startAngle + sweep);

            if (
              !fitsInsideContainer(
                containerRect.width,
                containerRect.height,
                centerX,
                centerY,
                angle,
                radius,
              )
            ) {
              break;
            }

            forwardSweep = sweep;
          }

          autoArc = backwardSweep + forwardSweep;
          autoStartAngle = startAngle - backwardSweep;

          if (autoArc >= 360 - AUTO_ARC_STEP) {
            autoArc = 360;
            autoStartAngle = startAngle - 180;
          }
        }

        setLayout({
          width: containerRect.width,
          height: containerRect.height,
          centerX,
          centerY,
          autoArc,
          autoStartAngle,
        });
      };

      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, [explicitArc, items.length, radius, startAngle]);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
      // Bloom/collapse radial organico
      const targets = itemRefs.current.filter(Boolean);
      const centerTarget = CenterNodeRef.current;
      
      if (!targets.length) return;

      if (isOpen) {
        gsap.to(centerTarget, {
          rotation: 90,
          scale: 1.1,
          ease: "back.out(3)",
          duration: 0.6
        });
        
        targets.forEach((el, index) => {
          const currentAngle = effectiveStartAngle + index * angleStep;
          const radians = currentAngle * (Math.PI / 180);

          let dynamicRadius = radius;
          if (layout.width > 0 && layout.height > 0) {
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            const leftSpace = Math.max(0, layout.centerX - ITEM_MARGIN);
            const rightSpace = Math.max(0, layout.width - layout.centerX - ITEM_MARGIN);
            const topSpace = Math.max(0, layout.centerY - ITEM_MARGIN);
            const bottomSpace = Math.max(0, layout.height - layout.centerY - ITEM_MARGIN);

            const limitX = getDistanceLimit(cos, leftSpace, rightSpace);
            const limitY = getDistanceLimit(sin, topSpace, bottomSpace);
            dynamicRadius = Math.min(radius, limitX, limitY);
          }

          const tx = Math.cos(radians) * dynamicRadius;
          const ty = Math.sin(radians) * dynamicRadius;

          gsap.fromTo(el, 
            { 
              x: 0, 
              y: 0, 
              opacity: 0, 
              scale: 0.2, 
              rotation: -45, 
              pointerEvents: "none" 
            },
            {
              x: tx,
              y: ty,
              opacity: 1,
              scale: 1,
              rotation: 0,
              pointerEvents: "auto",
              duration: 0.8,
              ease: "elastic.out(1, 0.6)",
              delay: index * (staggerDelay / 1000),
              overwrite: "auto"
            }
          );
        });
      } else {
        gsap.to(centerTarget, {
          rotation: 0,
          scale: 1,
          ease: "power3.inOut",
          duration: 0.4
        });
        
        gsap.to(targets, {
          x: 0,
          y: 0,
          opacity: 0,
          scale: 0.2,
          rotation: 45,
          pointerEvents: "none",
          duration: 0.4,
          ease: "back.in(2)",
          stagger: {
            amount: 0.1,
            from: "end" // Recoge desde el ultimo al centro
          },
          overwrite: "auto"
        });
      }
    }, [isOpen, layout, radius, effectiveStartAngle, angleStep, staggerDelay]);

    return (
      <div
        ref={WrapperRef}
        className={cn("relative flex items-center justify-center", className)}
        {...props}
      >
        <div
          ref={CenterNodeRef}
          className="relative z-20 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {centerNode || (
            <div
              className={cn(
                "w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-neutral-700 transition-colors",
                buttonClassName,
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {items.map((item, index) => {
          return (
            <div
              key={item.id}
              ref={(el) => { itemRefs.current[index] = el; }}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              className="absolute z-10 origin-center cursor-pointer opacity-0"
            >
              <div className="flex flex-col items-center justify-center group">
                {item.icon && (
                  <div className="p-2 w-10 h-10 bg-neutral-900 rounded-full border border-neutral-700 flex items-center justify-center shadow-lg group-hover:border-cyan-500 group-hover:text-cyan-400 group-hover:scale-110 transition-all text-neutral-300">
                    {item.icon}
                  </div>
                )}
                {item.label && (
                  <div className="absolute top-12 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded">
                    {item.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
RadialMenu.displayName = "RadialMenu";
