import React, { useRef, useState, useImperativeHandle, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface SacrificialButtonRef {
  /** Vuelve al estado original (no sacrificado). */
  reset: () => void;
  /** Ejecuta el sacrificio programáticamente. */
  sacrifice: () => void;
}

export interface SacrificialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto del botón en estado normal. @default "Commit" */
  label?: string;
  /** Texto revelado después del sacrificio. @default "Sacrificed" */
  sacrificedLabel?: string;
  /** Color del efecto de sangre/sacrificio. @default "rgba(139,0,0,0.6)" */
  bloodColor?: string;
  /** Glifos para el efecto de scramble durante la transición. @default chars 33-126 */
  scrambleDictionary?: string;
  /** Duración del efecto de sangre (seg). @default 1.5 */
  duration?: number;
  /** Velocidad del scramble de texto (ms por iteración). @default 30 */
  scrambleSpeed?: number;
  /** Permitir que el botón vuelva a estado original. @default false */
  resetable?: boolean;
  /** Callback cuando el botón se sacrifica. */
  onSacrifice?: () => void;
  /** Callback cuando el botón se restaura (si resetable=true). */
  onReset?: () => void;
}

export const SacrificialButton = React.forwardRef<SacrificialButtonRef, SacrificialButtonProps>(
  (
    {
      className,
      label = "Commit",
      sacrificedLabel = "Sacrificed",
      bloodColor = "rgba(163, 74, 51, 0.55)", // sintaxis clásica: GSAP no interpola `rgb(r g b / a)`
      scrambleDictionary,
      duration = 1.5,
      scrambleSpeed = 30,
      resetable = false,
      onSacrifice,
      onReset,
      onClick,
      ...props
    },
    ref,
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const bloodRef = useRef<HTMLDivElement>(null);
    const [isSacrificed, setIsSacrificed] = useState(false);
    const reduced = useReducedMotion();
    // Guardia síncrona: el estado de React no se actualiza hasta el siguiente render, y un doble clic
    // rápido leería `isSacrificed` aún en falso y dispararía el sacrificio dos veces.
    const sacrificedRef = useRef(false);
    const scrambleTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    // No dejar intervalos vivos si el botón se desmonta a mitad del efecto.
    useEffect(() => () => { if (scrambleTimer.current) clearInterval(scrambleTimer.current); }, []);

    const doReset = () => {
      if (scrambleTimer.current) clearInterval(scrambleTimer.current);
      sacrificedRef.current = false;
      setIsSacrificed(false);
      if (buttonRef.current) {
        gsap.to(buttonRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
      }
      if (bloodRef.current) {
        gsap.to(bloodRef.current, { opacity: 0, scale: 1, duration: 0.6, ease: "power2.out" });
      }
      if (textRef.current) {
        textRef.current.innerText = label;
      }
      onReset?.();
    };

    const doSacrifice = () => {
      if (sacrificedRef.current) return;
      sacrificedRef.current = true;
      setIsSacrificed(true);

      if (!reduced) {
        gsap.to(buttonRef.current, { y: 2, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" });
      }

      // La tinta de rúbrica sangra en el pergamino.
      gsap.to(bloodRef.current, {
        opacity: 1,
        scale: 1.5,
        duration: reduced ? 0 : duration,
        ease: "power3.out",
        backgroundColor: bloodColor,
      });

      // Text scramble mutation
      const textNode = textRef.current;
      if (textNode && reduced) {
        textNode.innerText = sacrificedLabel;
      } else if (textNode) {
        // Letras de escriba, no símbolos ASCII: es una corrección, no un fallo de sistema.
        const dict = scrambleDictionary || "abcdefghilmnopqrstuvxyz";
        let iterations = 0;
        if (scrambleTimer.current) clearInterval(scrambleTimer.current);
        const interval = setInterval(() => {
          textNode.innerText = sacrificedLabel
            .split("")
            .map((char, i) => {
              if (i < iterations) return char;
              return dict[Math.floor(Math.random() * dict.length)];
            })
            .join("");

          iterations += 1 / 3;
          if (iterations >= sacrificedLabel.length) {
            clearInterval(interval);
            textNode.innerText = sacrificedLabel;
          }
        }, scrambleSpeed);
        scrambleTimer.current = interval;
      }

      onSacrifice?.();
    };

    useImperativeHandle(ref, () => ({
      reset: doReset,
      sacrifice: doSacrifice,
    }));

    useGSAP(
      () => {
        const button = buttonRef.current;
        if (!button) return;

        const handleHover = () => {
          if (isSacrificed) return;
          gsap.to(bloodRef.current, {
            opacity: 0.85,
            scale: 1.1,
            duration: reduced ? 0 : 0.8,
            ease: "power2.out",
          });
          // Se levanta del papel: más sombra, nunca un resplandor.
          gsap.to(button, {
            y: -1,
            boxShadow: "inset 0 0 18px rgba(140,96,44,0.28), inset 1px 1px 0 rgba(255,250,235,0.5), 0 0 0 1px rgba(48,41,33,0.3), 3px 6px 6px rgba(0,0,0,0.3), 12px 20px 24px -8px rgba(0,0,0,0.5)",
            duration: reduced ? 0 : 0.4,
          });
        };

        const handleLeave = () => {
          if (isSacrificed) return;
          gsap.to(bloodRef.current, {
            opacity: 0,
            scale: 1,
            duration: reduced ? 0 : 0.6,
            ease: "power2.out",
          });
          gsap.to(button, { y: 0, clearProps: "boxShadow", duration: reduced ? 0 : 0.4 });
        };

        button.addEventListener("mouseenter", handleHover);
        button.addEventListener("mouseleave", handleLeave);

        return () => {
          button.removeEventListener("mouseenter", handleHover);
          button.removeEventListener("mouseleave", handleLeave);
        };
      },
      [isSacrificed, bloodColor, reduced],
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sacrificedRef.current) {
        if (resetable) doReset();
        return;
      }
      doSacrifice();
      onClick?.(e);
    };

    return (
      <button
        ref={buttonRef}
        onClick={handleClick}
        aria-label={isSacrificed ? sacrificedLabel : label}
        aria-disabled={isSacrificed && !resetable ? true : undefined}
        className={cn(
          "voy-slip relative overflow-hidden px-7 py-3 rounded-[2px]",
          "outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4",
          isSacrificed && resetable ? "cursor-pointer" : isSacrificed ? "cursor-default" : "",
          className,
        )}
        {...props}
      >
        <div
          ref={bloodRef}
          aria-hidden="true"
          className="absolute inset-0 z-0 opacity-0 blur-md pointer-events-none"
          style={{ mixBlendMode: "multiply", backgroundColor: bloodColor }}
        />
        <span ref={textRef} aria-hidden="true" className="voy-label relative z-10 text-[1em]">
          {label}
        </span>
      </button>
    );
  },
);
SacrificialButton.displayName = "SacrificialButton";