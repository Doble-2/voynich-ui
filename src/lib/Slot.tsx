import React from "react";
import { cn } from "./utils";
import { composeRefs } from "./compose";

type AnyProps = Record<string, unknown>;

/** Lee la ref de un elemento hijo, tanto en React 18 (`element.ref`) como en 19 (`props.ref`). */
const getChildRef = (child: React.ReactElement): React.Ref<unknown> | undefined => {
  const major = parseInt(React.version, 10);
  return major >= 19
    ? ((child.props as AnyProps).ref as React.Ref<unknown> | undefined)
    : ((child as unknown as { ref?: React.Ref<unknown> }).ref);
};

/** Fusiona las props del `Slot` con las del hijo: clases y estilos se suman, los manejadores se encadenan. */
function mergeSlotProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };
  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    if (/^on[A-Z]/.test(key) && typeof slotValue === "function" && typeof childValue === "function") {
      merged[key] = (...args: unknown[]) => {
        (childValue as (...a: unknown[]) => void)(...args);
        (slotValue as (...a: unknown[]) => void)(...args);
      };
    }
  }
  merged.className = cn(slotProps.className as string, childProps.className as string);
  merged.style = { ...(slotProps.style as object), ...(childProps.style as object) };
  return merged;
}

/**
 * `Slot`
 *
 * Aplica sus props al **único hijo** en lugar de renderizar un elemento propio. Es la base de `asChild`:
 * `<Button asChild><a href="/codex">Leer</a></Button>` produce un `<a>` con el aspecto y el comportamiento
 * del botón, sin envoltorios extra.
 */
export const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (!React.isValidElement(children)) {
      const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
      if (env !== "production" && React.Children.count(children) > 0) {
        console.warn("[voynich-ui] `asChild` necesita exactamente un elemento React como hijo.");
      }
      return null;
    }
    const child = children as React.ReactElement;
    return React.cloneElement(child, {
      ...mergeSlotProps(slotProps as AnyProps, child.props as AnyProps),
      ref: forwardedRef ? composeRefs(forwardedRef, getChildRef(child) as React.Ref<HTMLElement>) : getChildRef(child),
    } as AnyProps);
  },
);
Slot.displayName = "Slot";
