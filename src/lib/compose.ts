import type * as React from "react";

/** Asigna un valor a una ref, sea función u objeto. */
export function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
}

/** Combina varias refs en una: útil cuando un componente y su consumidor necesitan el mismo nodo. */
export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => refs.forEach((r) => setRef(r, node));
}

/**
 * Compone dos manejadores de evento: primero el del consumidor y, si este no llamó a
 * `preventDefault()`, el del componente. Así el consumidor siempre puede anular el comportamiento base.
 */
export function composeHandlers<E extends { defaultPrevented?: boolean }>(
  theirs: ((e: E) => void) | undefined,
  ours: ((e: E) => void) | undefined,
) {
  return (e: E) => {
    theirs?.(e);
    if (!e.defaultPrevented) ours?.(e);
  };
}

/** Para atributos `data-*` booleanos: presente como "true"/"false", nunca ausente. */
export const dataBool = (v: boolean | undefined) => (v ? "true" : "false");
