import React from "react";
import { cn } from "../../lib/utils";
import { Slot } from "../../lib/Slot";
import { composeHandlers } from "../../lib/compose";

export type ButtonVariant = "primary" | "secondary" | "outline" | "unstyled";

export interface ButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Material del botón.
   * - `primary`: cuero oscuro con filete de oro estampado.
   * - `secondary`: rúbrica terracota, la tinta de los copistas.
   * - `outline`: encuadernación en pergamino con filete de tinta.
   * - `unstyled`: solo estructura y comportamiento; el aspecto es tuyo.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /** Tamaño predefinido. @default "md" */
  size?: "sm" | "md" | "lg";
  /**
   * `auto` respeta `prefers-reduced-motion`; `none` fuerza un botón estático.
   * @default "auto"
   */
  motion?: "auto" | "none";
  /** @deprecated Usa `motion="none"`. */
  noAnimation?: boolean;
  /** Override del `border-radius`. Por defecto, esquinas casi rectas, como un taco de imprenta. */
  borderRadius?: string;
  /**
   * Aplica el botón a tu propio elemento en lugar de renderizar un `<button>`:
   * `<Button asChild><a href="/codex">Leer</a></Button>`. Debe haber un único hijo.
   * @default false
   */
  asChild?: boolean;
}

const SIZE_CLASSES = {
  sm: "h-9 px-6 text-[13px]",
  md: "h-11 px-8 text-[15px]",
  lg: "h-14 px-11 text-[18px]",
} as const;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "voy-btn--primary",
  secondary: "voy-btn--secondary",
  outline: "voy-btn--outline",
  unstyled: "voy-btn--unstyled",
};

const DEFAULT_RADIUS: Record<ButtonVariant, string> = {
  primary: "2px",
  secondary: "2px",
  outline: "2px",
  unstyled: "0",
};

/**
 * `Button.Root`
 *
 * El elemento interactivo, sin contenido por defecto. Compón tú las partes que quieras dentro:
 * `Button.Frame` (filete), `Button.Icon` y `Button.Label`.
 *
 * Variables CSS que puedes sobrescribir desde `style` o desde tu hoja de estilos:
 * `--voy-bg`, `--voy-bg-hover`, `--voy-surface`, `--voy-shade`, `--voy-edge`, `--voy-rule`,
 * `--voy-rule-hot` y `--voy-lit`.
 */
const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonRootProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      motion = "auto",
      noAnimation = false,
      borderRadius,
      asChild = false,
      style,
      type,
      onPointerMove,
      ...props
    },
    ref,
  ) => {
    const Comp = (asChild ? Slot : "button") as React.ElementType;
    const radius = borderRadius === "none" ? "0" : (borderRadius ?? DEFAULT_RADIUS[variant]);
    const isStatic = motion === "none" || noAnimation;

    return (
      <Comp
        ref={ref}
        // `type` solo existe en <button>; con asChild el hijo decide.
        {...(asChild ? {} : { type: type ?? "button" })}
        data-part="root"
        data-variant={variant}
        data-size={size}
        data-motion={isStatic ? "none" : undefined}
        className={cn("voy-btn", VARIANT_CLASSES[variant], variant !== "unstyled" && SIZE_CLASSES[size], className)}
        style={{ borderRadius: radius, ...style }}
        onPointerMove={composeHandlers(onPointerMove, (e: React.PointerEvent<HTMLElement>) => {
          // La luz del filete sigue al cursor sin re-renderizar React.
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--lx", `${e.clientX - r.left - 4}px`);
          e.currentTarget.style.setProperty("--ly", `${e.clientY - r.top - 4}px`);
        })}
        {...props}
      />
    );
  },
);
ButtonRoot.displayName = "Button.Root";

/** `Button.Frame`: el filete estampado que recorre el borde. Decorativo. Quítalo o sustitúyelo a voluntad. */
const ButtonFrame = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} data-part="frame" aria-hidden="true" className={cn("voy-btn__frame", className)} {...props} />
  ),
);
ButtonFrame.displayName = "Button.Frame";

/** `Button.Label`: el texto del botón. Úsalo para dar estilo propio al rótulo. */
const ButtonLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} data-part="label" className={cn("voy-btn__label", className)} {...props} />
  ),
);
ButtonLabel.displayName = "Button.Label";

/** `Button.Icon`: un icono o adorno junto al rótulo. Decorativo por defecto; pasa `aria-hidden={false}` si aporta significado. */
const ButtonIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} data-part="icon" aria-hidden="true" className={cn("voy-btn__icon", className)} {...props} />
  ),
);
ButtonIcon.displayName = "Button.Icon";

/** Props del botón completo: las de `Button.Root`. */
export type ButtonProps = ButtonRootProps;

/**
 * `Button`
 *
 * La composición por defecto: `Button.Root` + `Button.Frame` + tu contenido. Si necesitas más control,
 * usa las partes (`Button.Root`, `Button.Frame`, `Button.Icon`, `Button.Label`) y compón tú el interior.
 *
 * @example Por defecto
 * <Button>Firmar tratado</Button>
 *
 * @example Partes: icono a la izquierda y sin filete
 * <Button.Root variant="secondary">
 *   <Button.Icon>✦</Button.Icon>
 *   <Button.Label>Sellar</Button.Label>
 * </Button.Root>
 *
 * @example Tu propio elemento
 * <Button asChild><a href="/codex">Leer el códice</a></Button>
 */
const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    // El filete se inyecta como primer hijo del elemento del consumidor.
    const child = children as React.ReactElement<{ children?: React.ReactNode }>;
    return (
      <ButtonRoot ref={ref} asChild {...props}>
        {React.cloneElement(child, undefined, <ButtonFrame />, child.props.children)}
      </ButtonRoot>
    );
  }
  return (
    <ButtonRoot ref={ref} asChild={asChild ?? false} {...props}>
      {props.variant === "unstyled" ? null : <ButtonFrame />}
      {children}
    </ButtonRoot>
  );
});
ButtonBase.displayName = "Button";

export const Button = Object.assign(ButtonBase, {
  Root: ButtonRoot,
  Frame: ButtonFrame,
  Label: ButtonLabel,
  Icon: ButtonIcon,
});
