import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface ConfinementCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const ConfinementCircle = React.forwardRef<HTMLDivElement, ConfinementCircleProps>(
  ({ className, isOpen, onClose, onConfirm, title = "Aviso Crucial", children, ...props }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const runesRef = useRef<SVGGElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
      const overlay = overlayRef.current;
      const circle = circleRef.current;
      const runes = runesRef.current;
      if (!overlay || !circle || !runes) return;

      if (isOpen) {
        gsap.to(overlay, { opacity: 1, duration: 0.5, display: "flex" });
        gsap.fromTo(circle, 
          { scale: 0.5, rotation: -180, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "back.out(1.5)" }
        );
        gsap.fromTo(contentRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
        );
        // Spin runes eternally
        gsap.to(runes, {
          rotation: 360,
          transformOrigin: "center center",
          duration: 30,
          repeat: -1,
          ease: "none",
        });
      } else {
        gsap.to(circle, { scale: 1.2, rotation: 45, opacity: 0, duration: 0.6, ease: "power2.in" });
        gsap.to(overlay, { opacity: 0, duration: 0.5, delay: 0.2, onComplete: () => {
          gsap.set(overlay, { display: "none" });
        }});
      }
    }, [isOpen]);

    return (
      <div 
        ref={overlayRef} 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        style={{ display: "none", opacity: 0 }}
      >
        <div 
          ref={circleRef}
          className={cn("relative w-full max-w-[500px] aspect-square flex items-center justify-center", className)}
          {...props}
        >
          {/* Summoning Circle SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
            <circle cx="250" cy="250" r="230" fill="none" stroke="#5c331d" strokeWidth="2" opacity="0.3" />
            <circle cx="250" cy="250" r="215" fill="none" stroke="#5eead4" strokeWidth="1" strokeDasharray="5,10" opacity="0.6" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="#5c331d" strokeWidth="4" opacity="0.8" />
            
            <g ref={runesRef}>
              <polygon points="250,50 423,150 423,350 250,450 77,350 77,150" fill="none" stroke="#8b4a2a" strokeWidth="1" opacity="0.5" />
              <polygon points="250,90 388,170 388,330 250,410 112,330 112,170" fill="none" stroke="#8b4a2a" strokeWidth="1" opacity="0.5" />
              {/* Fake runes */}
              {[...Array(12)].map((_, i) => (
                <text 
                  key={i} 
                  x="250" y="70" 
                  fontSize="24" 
                  fill="#eaddc5" 
                  opacity="0.6"
                  transform={`rotate(${i * 30} 250 250)`}
                  textAnchor="middle"
                  fontFamily="serif"
                >
                  {String.fromCharCode(0x03b1 + Math.floor(Math.random() * 24))}
                </text>
              ))}
            </g>
          </svg>

          {/* Modal Content */}
          <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center w-[280px] h-[280px] text-center">
            <h3 className="text-xl font-serif text-[#eadbb6] border-b border-[#5c331d]/50 pb-2 mb-4 w-full">
              {title}
            </h3>
            <div className="flex-1 overflow-y-auto text-sm font-mono text-[#eadbb6]/70 w-full px-4 scrollbar-thin">
              {children}
            </div>
            <div className="flex gap-8 mt-4">
              <button 
                onClick={onClose}
                className="text-[#eadbb6]/50 hover:text-red-400 hover:scale-110 font-bold uppercase tracking-widest text-xs transition-all"
              >
                Rechazar
              </button>
              <button 
                onClick={onConfirm}
                className="text-[#5eead4] hover:text-white hover:scale-110 font-bold uppercase tracking-widest text-xs transition-all drop-shadow-[0_0_5px_#5eead4]"
              >
                Asimilar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ConfinementCircle.displayName = "ConfinementCircle";