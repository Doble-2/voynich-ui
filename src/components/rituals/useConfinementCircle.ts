import { useEffect, useId, useRef, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../lib/useReducedMotion";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export interface UseConfinementCircleOptions {
  /** Si el diálogo está abierto. */
  isOpen: boolean;
  /** Se llama al pulsar Escape o hacer clic fuera del disco. */
  onClose: () => void;
  /** `auto` respeta `prefers-reduced-motion`. @default "auto" */
  motion?: "auto" | "none" | undefined;
}

/**
 * `useConfinementCircle`
 *
 * La mecánica de un diálogo modal accesible, sin dibujar nada: aparición animada, foco que entra
 * al abrir y queda atrapado dentro, Escape para cerrar, clic en el fondo para cerrar y foco que vuelve
 * al disparador. Pinta el diálogo con lo que quieras y pon `getOverlayProps()` / `getDialogProps()`.
 */
export function useConfinementCircle({ isOpen, onClose, motion = "auto" }: UseConfinementCircleOptions) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const systemReduced = useReducedMotion();
  const reduced = motion === "none" || systemReduced;

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      const dialog = dialogRef.current;
      if (!overlay || !dialog) return;
      const d = (n: number) => (reduced ? 0 : n);
      const content = dialog.querySelector('[data-part="content"]');

      if (isOpen) {
        gsap.set(overlay, { display: "flex" });
        gsap.to(overlay, { opacity: 1, duration: d(0.4) });
        gsap.fromTo(dialog, { scale: 0.92, rotation: -6, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: d(0.9), ease: "power3.out" });
        if (content) gsap.fromTo(content, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: d(0.6), delay: d(0.25), ease: "power2.out" });
      } else {
        gsap.to(dialog, { scale: 1.04, opacity: 0, duration: d(0.4), ease: "power2.in" });
        gsap.to(overlay, { opacity: 0, duration: d(0.4), delay: d(0.1), onComplete: () => void gsap.set(overlay, { display: "none" }) });
      }
    },
    { dependencies: [isOpen, reduced] },
  );

  // Foco: entra al abrir, queda atrapado dentro y vuelve al disparador al cerrar.
  useEffect(() => {
    if (!isOpen) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => {
      const first = overlayRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? dialogRef.current)?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = Array.from(overlayRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      if (!nodes.length) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey, true);
      lastFocused.current?.focus?.();
    };
    // onClose se omite a propósito: no queremos re-enfocar si el padre cambia de función.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return {
    /** Id del título: enlaza `aria-labelledby` del diálogo con tu título. */
    titleId,
    /** `true` si el movimiento está reducido (por el sistema o por `motion="none"`). */
    reduced,
    overlayRef,
    dialogRef,
    /** Props del fondo que cubre la pantalla (ref, estilo inicial y clic-fuera-para-cerrar). */
    getOverlayProps: () => ({
      ref: overlayRef,
      "data-state": isOpen ? "open" : "closed",
      style: { display: "none", opacity: 0 } as CSSProperties,
      onMouseDown: (e: ReactMouseEvent) => {
        if (e.target === overlayRef.current) onClose();
      },
    }),
    /** Props del diálogo: ref, rol, modal y nombre accesible. */
    getDialogProps: () => ({
      ref: dialogRef,
      role: "dialog" as const,
      "aria-modal": true as const,
      "aria-labelledby": titleId,
      tabIndex: -1,
    }),
  };
}
