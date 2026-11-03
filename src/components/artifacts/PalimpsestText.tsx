import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { composeRefs } from "../../lib/compose";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface PalimpsestTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Texto o nodo antiguo/original. */
  ancientText: string | React.ReactNode;
  /** Texto o nodo traducido/moderno. */
  translatedText: string | React.ReactNode;
  /** Color del texto antiguo. @default "#5c331d" */
  ancientColor?: string;
  /** Color del texto traducido. @default "#eadbb6" */
  translatedColor?: string;
  /** Duración de la transición (seg). @default 1.5 */
  transitionSpeed?: number;
  /** Modo de interacción. @default "click" */
  interaction?: "click" | "hover";
  /** Callback al traducir. */
  onTranslate?: () => void;
  /** Callback al revertir. */
  onRevert?: () => void;
}

export const PalimpsestText = React.forwardRef<HTMLDivElement, PalimpsestTextProps>(
  ({ className, ancientText, translatedText, ancientColor = "currentColor", translatedColor, transitionSpeed = 1.5, interaction = "click", onTranslate, onRevert, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ancientRef = useRef<HTMLDivElement>(null);
    const modernRef = useRef<HTMLDivElement>(null);
    const [isTranslated, setIsTranslated] = useState(false);
    const reduced = useReducedMotion();
    const t = (d: number) => (reduced ? 0 : d);

    useGSAP(() => {
      const ancient = ancientRef.current;
      const modern = modernRef.current;
      if (!ancient || !modern) return;

      if (isTranslated) {
        // Fade ancient text into background, blur it
        gsap.to(ancient, {
          opacity: 0.1,
          filter: "blur(4px) sepia(0.8)",
          scale: 0.98,
          duration: t(1.5),
          ease: "power2.inOut",
        });
        
        // Bring translated text forward with a glowing ink effect
        gsap.to(modern, {
          opacity: 1,
          filter: "blur(0px) brightness(1.2)",
          scale: 1,
          y: 0,
          duration: t(1.5),
          ease: "power2.out",
          delay: t(0.2), // Offset translation delay
        });
      } else {
        // Revert to ancient
        gsap.to(ancient, {
          opacity: 0.8,
          filter: "blur(0px) sepia(0.5)",
          scale: 1,
          duration: t(1.2),
          ease: "power2.inOut",
        });
        
        gsap.to(modern, {
          opacity: 0,
          filter: "blur(10px) brightness(0.5)",
          scale: 1.05,
          y: -10,
          duration: t(1.2),
          ease: "power2.in",
        });
      }
    }, [isTranslated, reduced]);

    const toggleTranslation = () => setIsTranslated((prev) => !prev);

    return (
      <div 
        ref={composeRefs(ref, containerRef)} 
        role="button"
        tabIndex={0}
        aria-pressed={isTranslated}
        className={cn("relative cursor-pointer min-h-[4rem] group focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4", className)}
        onClick={toggleTranslation}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTranslation();
          }
        }}
        {...props}
      >
        <div 
          ref={ancientRef}
          aria-hidden={isTranslated}
          className="absolute inset-0 transition-none text-lg tracking-[0.14em] leading-relaxed pointer-events-none"
          style={{ opacity: 0.8, filter: "sepia(0.5)", color: ancientColor, fontFamily: "var(--voynich-font-body)", fontStyle: "italic" }}
        >
          {ancientText}
        </div>
        <div 
          ref={modernRef}
          aria-hidden={!isTranslated}
          className="relative transition-none text-lg leading-relaxed pointer-events-none"
          style={{ opacity: 0, filter: "blur(10px)", transform: "translateY(-10px) scale(1.05)", fontFamily: "var(--voynich-font-body)", ...(translatedColor ? { color: translatedColor } : {}) }}
        >
          {translatedText}
        </div>
        
        {/* Subtle helper text on hover */}
        <div className="voy-label absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 transition-opacity text-[11px] whitespace-nowrap">
          {isTranslated ? "[Deshacer traducción]" : "[Traducir palimpsesto]"}
        </div>
      </div>
    );
  }
);
PalimpsestText.displayName = "PalimpsestText";