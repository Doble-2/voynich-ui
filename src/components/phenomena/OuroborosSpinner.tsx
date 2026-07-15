import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface OuroborosSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  loadingColor?: string;
  isProcessing?: boolean;
}

export const OuroborosSpinner = React.forwardRef<HTMLDivElement, OuroborosSpinnerProps>(
  ({ className, size = 64, loadingColor = "#5eead4", isProcessing = true, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const snakeRef = useRef<SVGPathElement>(null);

    useGSAP(() => {
      const snake = snakeRef.current;
      const container = containerRef.current;
      if (!snake || !container) return;

      if (isProcessing) {
        // Organic, spasmodic rotation
        gsap.to(container, {
          rotation: "+=360",
          duration: 3,
          ease: "rough({ template: power0.none, strength: 0.5, points: 15, taper: none, randomize: true, clamp: false })",
          repeat: -1,
        });

        // Simulating the snake swallowing itself using dash offsets
        // Path length is approximate for r=40
        const len = 251;
        gsap.fromTo(snake, 
          { strokeDasharray: `${len}, ${len}`, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: "circ.inOut",
            repeat: -1,
            yoyo: true,
          }
        );
      } else {
        // Settle down
        gsap.killTweensOf(container);
        gsap.killTweensOf(snake);
        gsap.to(container, { rotation: 0, duration: 1, ease: "power2.out" });
        gsap.to(snake, { strokeDashoffset: 0, duration: 1, ease: "power2.out" });
      }
    }, [isProcessing]);

    return (
      <div 
        ref={containerRef} 
        className={cn("relative flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xl"
          style={{ filter: `drop-shadow(0 0 8px ${loadingColor}80)` }}
        >
          {/* Base shadow track */}
          <path
            d="M50 10 A40 40 0 1 1 49.9 10"
            fill="none"
            stroke="#21120a"
            strokeWidth="4"
          />
          
          {/* The Snake Body */}
          <path
            ref={snakeRef}
            d="M50 10 A40 40 0 1 1 49.9 10"
            fill="none"
            stroke={loadingColor}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Scale/Skin texture dots */}
          <circle cx="50" cy="10" r="4" fill={loadingColor} />
          <polygon points="50,6 55,14 45,14" fill="#0d0905" />
        </svg>

        {/* Small center artifact */}
        <div className="absolute w-2 h-2 rounded-full border border-[#eadbb6]/50 bg-transparent flex items-center justify-center">
            <div className="w-0.5 h-0.5 bg-[#eadbb6]" />
        </div>
      </div>
    );
  }
);
OuroborosSpinner.displayName = "OuroborosSpinner";