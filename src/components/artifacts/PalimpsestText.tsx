import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

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
  ({ className, ancientText, translatedText, ancientColor = "#5c331d", translatedColor = "#eadbb6", transitionSpeed = 1.5, interaction = "click", onTranslate, onRevert, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ancientRef = useRef<HTMLDivElement>(null);
    const modernRef = useRef<HTMLDivElement>(null);
    const [isTranslated, setIsTranslated] = useState(false);

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
          duration: 1.5,
          ease: "power2.inOut",
        });
        
        // Bring translated text forward with a glowing ink effect
        gsap.to(modern, {
          opacity: 1,
          filter: "blur(0px) brightness(1.2)",
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: "back.out(1.5)",
          delay: 0.2, // Offset translation delay
        });
      } else {
        // Revert to ancient
        gsap.to(ancient, {
          opacity: 0.8,
          filter: "blur(0px) sepia(0.5)",
          scale: 1,
          duration: 1.2,
          ease: "power2.inOut",
        });
        
        gsap.to(modern, {
          opacity: 0,
          filter: "blur(10px) brightness(0.5)",
          scale: 1.05,
          y: -10,
          duration: 1.2,
          ease: "power2.in",
        });
      }
    }, [isTranslated]);

    const toggleTranslation = () => setIsTranslated((prev) => !prev);

    return (
      <div 
        ref={containerRef} 
        className={cn("relative cursor-pointer min-h-[4rem] group", className)} 
        onClick={toggleTranslation}
        {...props}
      >
        <div 
          ref={ancientRef}
          className="absolute inset-0 transition-none font-serif text-[#5c331d] text-lg tracking-widest leading-relaxed pointer-events-none"
          style={{ opacity: 0.8, filter: "sepia(0.5)" }}
        >
          {ancientText}
        </div>
        <div 
          ref={modernRef}
          className="relative transition-none font-sans text-[#eadbb6] text-lg leading-relaxed pointer-events-none drop-shadow-[0_0_8px_rgba(234,219,182,0.4)]"
          style={{ opacity: 0, filter: "blur(10px)", transform: "translateY(-10px) scale(1.05)" }}
        >
          {translatedText}
        </div>
        
        {/* Subtle helper text on hover */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity font-mono text-[10px] text-[#eadbb6] tracking-tighter">
          {isTranslated ? "[Deshacer traducción]" : "[Traducir palimpsesto]"}
        </div>
      </div>
    );
  }
);
PalimpsestText.displayName = "PalimpsestText";