import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Estilo visual del botón dentro del Códice (primario/pergamino, entintado, margen).
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "outline";
  /**
   * Tamaño predefinido del botón.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Desactivar micro-animaciones GSAP (útil para contextos estáticos).
   * @default false
   */
  noAnimation?: boolean;
  /**
   * Override del border-radius orgánico. Usa `"none"` para esquinas rectas.
   * @default "40% 10% 80% 20%/20% 60% 40% 90%"
   */
  borderRadius?: string;
}

const SIZE_CLASSES = {
  sm: "h-8 px-3 py-1 text-xs",
  md: "h-10 px-5 py-2 text-sm",
  lg: "h-12 px-8 py-3 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      noAnimation = false,
      borderRadius = "40% 10% 80% 20%/20% 60% 40% 90%",
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);

    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    useGSAP(
      () => {
        const button = internalRef.current;
        if (!button || noAnimation) return;

        // Variables base
        let isHovered = false;

        const handleHover = () => {
          isHovered = true;
          // Inestabilidad orgánica: Tiembla sutilmente y se tensa como gelatina
          gsap.to(button, {
            rotation: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 1.5), // Torsión asimétrica
            scale: 1.02,
            y: -2,
            duration: 0.8,
            ease: "elastic.out(1.2, 0.4)", // Física de bamboleo leve
            overwrite: "auto",
          });
        };

        const handleLeave = () => {
          isHovered = false;
          // Retorno relajado al centro
          gsap.to(button, {
            rotation: 0,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto",
          });
        };

        const handleDown = () => {
          // Aplastamiento visceral (squish manual de vitela)
          gsap.to(button, {
            scaleX: 0.94,
            scaleY: 0.88,
            y: 2,
            duration: 0.15,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        };

        const handleUp = () => {
          // Retorna al estado hover (si todavía está encima) o base
          gsap.to(button, {
            scaleX: isHovered ? 1.02 : 1,
            scaleY: isHovered ? 1.02 : 1,
            y: isHovered ? -2 : 0,
            duration: 0.5,
            ease: "elastic.out(1.5, 0.3)",
            overwrite: "auto",
          });
        };

        button.addEventListener("mouseenter", handleHover);
        button.addEventListener("mouseleave", handleLeave);
        button.addEventListener("mousedown", handleDown);
        button.addEventListener("mouseup", handleUp);

        return () => {
          button.removeEventListener("mouseenter", handleHover);
          button.removeEventListener("mouseleave", handleLeave);
          button.removeEventListener("mousedown", handleDown);
          button.removeEventListener("mouseup", handleUp);
        };
      },
      { scope: internalRef, dependencies: [noAnimation] },
    );

    const resolvedRadius = borderRadius === "none" ? "0" : borderRadius;

    return (
      <button
        ref={setRefs}
        className={cn(
          "inline-flex items-center justify-center font-serif focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-900/50 disabled:pointer-events-none disabled:opacity-40",
          SIZE_CLASSES[size],
          "border border-[#5c331d]/30", // Vellum edges
          "contrast-[1.1] brightness-[0.95] sepia-[0.2]", // Ink filters
          {
            "bg-[#eadbb6] text-[#30180d] hover:bg-[#dfcda2] shadow-[inset_0_0_10px_rgba(97,52,24,0.1),0_4px_12px_rgba(0,0,0,0.1)]":
              variant === "primary",
            "bg-[#21120a] text-[#eadbb6] hover:bg-[#30180d] border-[#5c331d]": variant === "secondary",
            "border border-[#5c331d]/40 bg-transparent text-[#30180d] hover:bg-[#eadbb6]/40": variant === "outline",
          },
          className,
        )}
        style={{ borderRadius: resolvedRadius }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
