import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/useReducedMotion";

// Register ScrollTrigger inside the component or globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface LeyLineScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  glowColor?: string;
  strokeWidth?: number;
  height?: number | string;
}

export const LeyLineScroll = React.forwardRef<HTMLDivElement, LeyLineScrollProps>(
  ({ className, color = "#5a4b30", glowColor = "#dcc482", strokeWidth = 2, height = "100vh", ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const reduced = useReducedMotion();

    useGSAP(() => {
      const path = pathRef.current;
      const container = containerRef.current;
      if (!path || !container) return;

      // Movimiento reducido: la línea aparece ya trazada, sin depender del scroll.
      if (reduced) {
        gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0, opacity: 1 });
        return;
      }

      const pathLength = path.getTotalLength();

      // Configure initial state of the path to be completely hidden
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 0.1,
      });

      // ScrollTrigger animation
      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top center", // Starts when top of container hits center of screen
          end: "bottom center", // Ends when bottom of container hits center of screen
          scrub: 1, // Smooth scrubbing taking 1 second to catch up
          onUpdate: (self) => {
            // Pulse the glow thickness based on velocity
            // Un trazo de pluma: al ir más rápido, se carga más tinta y la línea engrosa.
            const velocity = Math.abs(self.getVelocity() / 100);
            gsap.to(path, {
              strokeWidth: strokeWidth + Math.min(velocity, 3),
              duration: 0.2,
              overwrite: "auto"
            });
          },
          onScrubComplete: () => {
             // Revert pulse
             gsap.to(path, {
              strokeWidth: strokeWidth,
              duration: 0.5,
              overwrite: "auto"
            });
          }
        },
      });

      // Capture the specific ScrollTrigger for scoped cleanup
      const trigger = tween.scrollTrigger;

      return () => {
        trigger?.kill();
        tween.kill();
      };
    }, { scope: containerRef, dependencies: [reduced] });

    return (
      <div 
        ref={containerRef} 
        className={cn("relative overflow-hidden pointer-events-none", className)} 
        style={{ height }}
        {...props}
      >
        <svg
          viewBox="0 0 100 1000"
          preserveAspectRatio="xMidYMin slice"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base dim line */}
          <path
            d="M50 0 C 80 150, 20 250, 50 400 S 10 650, 50 800 T 50 1000"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            opacity="0.2"
          />
          {/* Active drawing line */}
          <path
            ref={pathRef}
            d="M50 0 C 80 150, 20 250, 50 400 S 10 650, 50 800 T 50 1000"
            fill="none"
            stroke={glowColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all"
            style={{ filter: "drop-shadow(1px 2px 1px rgb(0 0 0 / 0.5))" }}
          />

          {/* Decorative Nods/Nodes */}
          <circle cx="50" cy="400" r="4" fill={color} />
          <circle cx="50" cy="800" r="6" fill="transparent" stroke={color} strokeWidth="1" />
          <circle cx="50" cy="800" r="2" fill={glowColor} />
        </svg>
      </div>
    );
  }
);
LeyLineScroll.displayName = "LeyLineScroll";