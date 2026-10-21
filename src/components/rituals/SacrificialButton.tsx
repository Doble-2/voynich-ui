import React, { useRef, useState, useImperativeHandle } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

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
      bloodColor = "rgba(139, 0, 0, 0.6)",
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

    const doReset = () => {
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
      if (isSacrificed) return;
      setIsSacrificed(true);

      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });

      gsap.to(bloodRef.current, {
        opacity: 1,
        scale: 1.5,
        duration,
        ease: "elastic.out(1, 0.3)",
        backgroundColor: bloodColor,
      });

      // Text scramble mutation
      const textNode = textRef.current;
      if (textNode) {
        const dict = scrambleDictionary || null;
        let iterations = 0;
        const interval = setInterval(() => {
          textNode.innerText = sacrificedLabel
            .split("")
            .map((char, i) => {
              if (i < iterations) return char;
              if (dict) return dict[Math.floor(Math.random() * dict.length)];
              return String.fromCharCode(33 + Math.random() * 94);
            })
            .join("");

          iterations += 1 / 3;
          if (iterations >= sacrificedLabel.length) {
            clearInterval(interval);
            textNode.innerText = sacrificedLabel;
          }
        }, scrambleSpeed);
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
            opacity: 1,
            scale: 1.1,
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(button, {
            y: -2,
            boxShadow: `0px 10px 20px ${bloodColor.replace(/[\d.]+\)$/, "0.4)")}`,
            duration: 0.4,
          });
        };

        const handleLeave = () => {
          if (isSacrificed) return;
          gsap.to(bloodRef.current, {
            opacity: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          });
          gsap.to(button, {
            y: 0,
            boxShadow: "0px 0px 0px rgba(139, 0, 0, 0)",
            duration: 0.4,
          });
        };

        button.addEventListener("mouseenter", handleHover);
        button.addEventListener("mouseleave", handleLeave);

        return () => {
          button.removeEventListener("mouseenter", handleHover);
          button.removeEventListener("mouseleave", handleLeave);
        };
      },
      [isSacrificed, bloodColor],
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isSacrificed) {
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
        className={cn(
          "relative overflow-hidden px-6 py-3 font-serif text-[#30180d] bg-[#eadbb6] border border-[#5c331d]/50 rounded-[5px]",
          "transition-colors outline-none",
          isSacrificed && resetable ? "cursor-pointer" : isSacrificed ? "cursor-default" : "",
          className,
        )}
        {...props}
      >
        <div
          ref={bloodRef}
          className="absolute inset-0 z-0 bg-red-900/0 opacity-0 blur-md pointer-events-none"
          style={{ mixBlendMode: "multiply" }}
        />
        <span ref={textRef} className="relative z-10 font-bold uppercase tracking-widest text-[#30180d]">
          {label}
        </span>
      </button>
    );
  },
);
SacrificialButton.displayName = "SacrificialButton";