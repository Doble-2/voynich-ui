import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface IncantationInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Mostrar estado de error. @default false */
  error?: boolean;
  /** Color del resplandor al focus. @default "#eadbb6" */
  glowColor?: string;
  /** Color del borde de error. @default "#991b1b" */
  errorColor?: string;
  /** Color de las chispas. @default "rgba(255, 215, 0, 0.4)" */
  sparkColor?: string;
  /** Color del texto. @default "#dfcda2" */
  textColor?: string;
  /** Color de fondo. @default "#18110b" */
  bgColor?: string;
  /** Etiqueta superior. */
  label?: string;
}

export const IncantationInput = React.forwardRef<HTMLInputElement, IncantationInputProps>(
  ({ className, error, onChange, glowColor = "#eadbb6", errorColor = "#991b1b", sparkColor = "rgba(255, 215, 0, 0.4)", textColor = "#dfcda2", bgColor = "#18110b", label, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState("");

    useGSAP(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setValue(target.value);

        gsap.to(container, {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "rough({ template: power0.none, strength: 1, points: 20, taper: none, randomize: true, clamp: false })"
        });

        // Simular humo o chispa (simplificado)
        const spark = document.createElement("div");
        spark.className = "absolute rounded-full pointer-events-none";
        spark.style.backgroundColor = "rgba(255, 215, 0, 0.4)";
        spark.style.width = "4px";
        spark.style.height = "4px";
        spark.style.left = `${Math.random() * 100}%`;
        spark.style.bottom = "0";
        container.appendChild(spark);

        gsap.to(spark, {
          y: -40 - Math.random() * 20,
          x: (Math.random() - 0.5) * 20,
          opacity: 0,
          scale: 3,
          duration: 1 + Math.random(),
          ease: "power2.out",
          onComplete: () => {
            if (spark.parentNode) {
              spark.parentNode.removeChild(spark);
            }
          }
        });
      };

      inputRef.current?.addEventListener("input", handleInput);

      return () => {
        inputRef.current?.removeEventListener("input", handleInput);
      };
    }, []);

    return (
      <div ref={containerRef} className="relative inline-block w-full">
        <input
          ref={inputRef}
          className={cn(
            "w-full bg-[#18110b] text-[#dfcda2] border-b-2 border-[#5c331d] px-4 py-2 font-mono focus:outline-none focus:border-[#eadbb6] transition-colors",
            "shadow-inner placeholder:opacity-40",
            error ? "border-red-900 focus:border-red-500" : "",
            className
          )}
          onChange={onChange}
          {...props}
        />
      </div>
    );
  }
);
IncantationInput.displayName = "IncantationInput";