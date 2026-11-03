import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const getSnapshot = () =>
  typeof window !== "undefined" && !!window.matchMedia
    ? window.matchMedia(QUERY).matches
    : false;

/** En SSR asumimos movimiento permitido; el cliente corrige al hidratar. */
const getServerSnapshot = () => false;

/**
 * `true` cuando el usuario pidió reducir el movimiento en su sistema operativo.
 *
 * Los componentes lo usan para sustituir animaciones decorativas (bucles, partículas,
 * parallax) por un estado estático y las revelaciones por un cambio instantáneo.
 * Un componente que reciba la prop `motion` explícita debe respetarla por encima de esto.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Variante no reactiva para código imperativo (handlers, GSAP, etc.). */
export function prefersReducedMotion(): boolean {
  return getSnapshot();
}
