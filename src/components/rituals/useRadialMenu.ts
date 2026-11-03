import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../lib/useReducedMotion";

const ITEM_MARGIN = 40;
const FLOAT_EPSILON = 0.001;
const AUTO_ARC_STEP = 2;

const normalizeAngle = (angle: number) => {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

const resolveArcFromAngles = (startAngle: number, endAngle?: number) => {
  if (endAngle === undefined) return undefined;
  const diff = endAngle - startAngle;
  if (diff > 0) return diff;
  if (diff < 0) return diff + 360;
  return 360;
};

const getDistanceLimit = (direction: number, negativeSpace: number, positiveSpace: number) => {
  if (direction > FLOAT_EPSILON) return positiveSpace / direction;
  if (direction < -FLOAT_EPSILON) return negativeSpace / Math.abs(direction);
  return Infinity;
};

const fitsInsideContainer = (w: number, h: number, cx: number, cy: number, angleDeg: number, distance: number) => {
  const rad = angleDeg * (Math.PI / 180);
  const x = cx + Math.cos(rad) * distance;
  const y = cy + Math.sin(rad) * distance;
  return x >= ITEM_MARGIN && x <= w - ITEM_MARGIN && y >= ITEM_MARGIN && y <= h - ITEM_MARGIN;
};

export interface RadialMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface RadialMenuRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface UseRadialMenuOptions {
  /** Los elementos del menú. */
  items: RadialMenuItem[];
  /** Distancia máxima al centro, en píxeles. @default 100 */
  radius?: number | undefined;
  /** Retardo entre la aparición de un elemento y el siguiente (ms). @default 50 */
  staggerDelay?: number | undefined;
  /** Ángulo del primer elemento en grados (0 = derecha, -90 = arriba). @default -90 */
  startAngle?: number | undefined;
  /** Ángulo del último elemento. Si se omite, el arco se calcula para que quepa en el contenedor. */
  endAngle?: number | undefined;
  /** Arco total en grados. Alternativa a `endAngle`. */
  arc?: number | undefined;
  /** `auto` respeta `prefers-reduced-motion`. @default "auto" */
  motion?: "auto" | "none" | undefined;
}

interface Layout {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  autoArc: number;
  autoStartAngle: number;
}

/**
 * `useRadialMenu`
 *
 * La mecánica de un menú que se despliega en abanico alrededor de un punto: abre y cierra, reparte los
 * elementos con trigonometría, **ajusta el arco para que nada se salga del contenedor**, anima con retardo
 * escalonado y gestiona teclado y accesibilidad. No dibuja nada: conecta `wrapperRef`, `getTriggerProps()`
 * y `getItemProps(item, i)` a tus elementos.
 */
export function useRadialMenu({
  items,
  radius = 100,
  staggerDelay = 50,
  startAngle = -90,
  endAngle,
  arc,
  motion = "auto",
}: UseRadialMenuOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState<Layout>({ width: 0, height: 0, centerX: 0, centerY: 0, autoArc: 360, autoStartAngle: startAngle });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const systemReduced = useReducedMotion();
  const reduced = motion === "none" || systemReduced;

  const explicitArc = arc ?? resolveArcFromAngles(startAngle, endAngle);
  const effectiveArc = explicitArc ?? layout.autoArc;
  const effectiveStartAngle = explicitArc === undefined ? layout.autoStartAngle : startAngle;
  const angleStep =
    items.length <= 1 ? 0 : effectiveArc === 360 ? effectiveArc / items.length : effectiveArc / Math.max(1, items.length - 1);

  // Mide el contenedor y calcula el arco máximo que cabe sin salirse.
  useEffect(() => {
    const updateSize = () => {
      if (!wrapperRef.current || !triggerRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const parentRect = wrapperRef.current.parentElement?.getBoundingClientRect();
      const centerRect = triggerRef.current.getBoundingClientRect();
      const useParent = !!parentRect && (wrapperRect.width <= centerRect.width + 1 || wrapperRect.height <= centerRect.height + 1);
      const containerRect = useParent ? parentRect : wrapperRect;
      if (!containerRect) return;

      const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
      const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;

      let autoArc = 360;
      let autoStartAngle = startAngle;
      if (explicitArc === undefined && radius > 0) {
        let backward = 0;
        let forward = 0;
        for (let sweep = 0; sweep <= 180; sweep += AUTO_ARC_STEP) {
          if (!fitsInsideContainer(containerRect.width, containerRect.height, centerX, centerY, normalizeAngle(startAngle - sweep), radius)) break;
          backward = sweep;
        }
        for (let sweep = 0; sweep <= 180; sweep += AUTO_ARC_STEP) {
          if (!fitsInsideContainer(containerRect.width, containerRect.height, centerX, centerY, normalizeAngle(startAngle + sweep), radius)) break;
          forward = sweep;
        }
        autoArc = backward + forward;
        autoStartAngle = startAngle - backward;
        // Si ni el ángulo de partida cabe a este radio, el arco sale 0° y todos los elementos se apilarían.
        // En ese caso se reparten por la circunferencia completa; el recorte por elemento (ver más abajo)
        // los mantiene dentro del contenedor acortando su distancia.
        if (autoArc < AUTO_ARC_STEP * 2) {
          autoArc = 360;
          autoStartAngle = startAngle - 180;
        }
        if (autoArc >= 360 - AUTO_ARC_STEP) {
          autoArc = 360;
          autoStartAngle = startAngle - 180;
        }
      }
      setLayout({ width: containerRect.width, height: containerRect.height, centerX, centerY, autoArc, autoStartAngle });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [explicitArc, items.length, radius, startAngle]);

  useGSAP(
    () => {
      const targets = itemRefs.current.filter(Boolean);
      const trigger = triggerRef.current;
      if (!targets.length) return;
      const k = reduced ? 0 : 1;

      if (isOpen) {
        // Un medallón gira al abrirse; un centro propio (texto, botón) no debe girar de lado.
        const spin = trigger?.getAttribute("data-spin") !== "false";
        gsap.to(trigger, { rotation: spin ? 90 : 0, scale: 1.1, ease: "back.out(3)", duration: 0.6 * k });
        targets.forEach((el, index) => {
          const radians = (effectiveStartAngle + index * angleStep) * (Math.PI / 180);
          let dynamicRadius = radius;
          if (layout.width > 0 && layout.height > 0) {
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            const left = Math.max(0, layout.centerX - ITEM_MARGIN);
            const right = Math.max(0, layout.width - layout.centerX - ITEM_MARGIN);
            const top = Math.max(0, layout.centerY - ITEM_MARGIN);
            const bottom = Math.max(0, layout.height - layout.centerY - ITEM_MARGIN);
            dynamicRadius = Math.min(radius, getDistanceLimit(cos, left, right), getDistanceLimit(sin, top, bottom));
          }
          gsap.fromTo(
            el,
            { x: 0, y: 0, opacity: 0, scale: 0.2, rotation: -45, pointerEvents: "none" },
            {
              x: Math.cos(radians) * dynamicRadius,
              y: Math.sin(radians) * dynamicRadius,
              opacity: 1,
              scale: 1,
              rotation: 0,
              pointerEvents: "auto",
              duration: 0.8 * k,
              ease: "elastic.out(1, 0.6)",
              delay: index * (staggerDelay / 1000) * k,
              overwrite: "auto",
            },
          );
        });
      } else {
        gsap.to(trigger, { rotation: 0, scale: 1, ease: "power3.inOut", duration: 0.4 * k });
        gsap.to(targets, {
          x: 0,
          y: 0,
          opacity: 0,
          scale: 0.2,
          rotation: 45,
          pointerEvents: "none",
          duration: 0.4 * k,
          ease: "back.in(2)",
          stagger: { amount: 0.1 * k, from: "end" },
          overwrite: "auto",
        });
      }
    },
    { dependencies: [isOpen, layout, radius, effectiveStartAngle, angleStep, staggerDelay, reduced] },
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
    /** Pon esta ref en el contenedor: de él se mide el espacio disponible. */
    wrapperRef,
    /** Acciones imperativas. */
    controls: { open, close, toggle } satisfies RadialMenuRef,
    /** Props del contenedor: Escape cierra el menú. */
    getRootProps: () => ({
      ref: wrapperRef,
      "data-state": isOpen ? "open" : "closed",
      onKeyDown: (e: ReactKeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          e.stopPropagation();
          close();
        }
      },
    }),
    /** Props del elemento central que abre y cierra (rol de botón, teclado y estado expandido). */
    getTriggerProps: () => ({
      ref: triggerRef,
      role: "button" as const,
      tabIndex: 0,
      "aria-haspopup": "menu" as const,
      "aria-expanded": isOpen,
      onClick: toggle,
      onKeyDown: (e: ReactKeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      },
    }),
    /** Props de cada elemento: posición animada, rol de menú, foco y que cerrado no se pueda pulsar. */
    getItemProps: (item: RadialMenuItem, index: number) => ({
      ref: (el: HTMLDivElement | null) => {
        itemRefs.current[index] = el;
      },
      role: "menuitem" as const,
      tabIndex: isOpen ? 0 : -1,
      "aria-hidden": !isOpen,
      "aria-label": typeof item.label === "string" ? item.label : undefined,
      onClick: () => {
        if (!isOpen) return;
        item.onClick?.();
        close();
      },
      onKeyDown: (e: ReactKeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          item.onClick?.();
          close();
        }
      },
      // Cerrado, los elementos no deben poder pulsarse aunque sean invisibles.
      style: { pointerEvents: isOpen ? "auto" : "none" } as CSSProperties,
    }),
  };
}
