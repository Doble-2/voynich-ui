import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface SacrificialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  sacrificedLabel?: string;
}

export const SacrificialButton = React.forwardRef<HTMLButtonElement, SacrificialButtonProps>(
  ({ className, label = "Commit", sacrificedLabel = "Sacrificed", onClick, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const bloodRef = useRef<HTMLDivElement>(null);
    const [isSacrificed, setIsSacrificed] = useState(false);

    useGSAP(() => {
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
          boxShadow: "0px 10px 20px rgba(139, 0, 0, 0.4)",
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
    }, [isSacrificed]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        backgroundColor: "rgba(139, 0, 0, 0.6)",
      });

      // Simple text mutation
      const textNode = textRef.current;
      if (textNode) {
        let iterations = 0;
        const interval = setInterval(() => {
          textNode.innerText = sacrificedLabel
            .split("")
            .map((char, i) => {
              if (i < iterations) return char;
              return String.fromCharCode(33 + Math.random() * 94);
            })
            .join("");

          iterations += 1 / 3;
          if (iterations >= sacrificedLabel.length) {
            clearInterval(interval);
            textNode.innerText = sacrificedLabel;
          }
        }, 30);
      }

      onClick?.(e);
    };

    return (
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden px-6 py-3 font-serif text-[#30180d] bg-[#eadbb6] border border-[#5c331d]/50 rounded-[5px]",
          "transition-colors outline-none",
          className
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
  }
);
SacrificialButton.displayName = "SacrificialButton";