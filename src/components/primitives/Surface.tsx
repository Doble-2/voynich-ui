import React from "react";
import { cn } from "../../lib/utils";
import { Slot } from "../../lib/Slot";

export type SurfaceMaterial = "paper" | "leather" | "rubric" | "bronze" | "gold" | "none";

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * El material del que está hecha la superficie. Todos están iluminados con la misma luz
   * (arriba-izquierda), así que combinan entre sí.
   * @default "paper"
   */
  material?: SurfaceMaterial;
  /**
   * Distancia a la mesa: cuánta sombra proyecta, siempre hacia abajo-derecha.
   * `0` = pegada al fondo, `3` = muy elevada.
   * @default 1
   */
  elevation?: 0 | 1 | 2 | 3;
  /**
   * Filete estampado que recorre el borde (se dibuja con la variable `--voy-rule`).
   * - `gilt`: oro. - `ink`: tinta. - `none`: sin filete.
   * @default "none"
   */
  frame?: "gilt" | "ink" | "none";
  /** Renderiza tu propio elemento en lugar de un `div`. @default false */
  asChild?: boolean;
  /** Etiqueta HTML a usar cuando no hay `asChild`. @default "div" */
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * `Surface`
 *
 * El material como pieza suelta. Es lo que usan por dentro los botones, paneles y notas; exportado
 * para que construyas tus propios componentes con el mismo lenguaje visual.
 *
 * Se puede retocar con variables CSS: `--voy-surface` (imagen de la textura), `--voy-surface-color`
 * (color base) y `--voy-rule` (color del filete).
 *
 * @example
 * <Surface material="leather" elevation={2} frame="gilt" className="p-6">…</Surface>
 */
export const Surface = React.forwardRef<HTMLElement, SurfaceProps>(
  ({ material = "paper", elevation = 1, frame = "none", asChild = false, as = "div", className, children, ...props }, ref) => {
    const Comp = (asChild ? Slot : as) as React.ElementType;
    return (
      <Comp
        ref={ref}
        data-part="surface"
        data-material={material}
        data-elevation={elevation}
        data-frame={frame}
        className={cn("voy-surface", className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Surface.displayName = "Surface";
