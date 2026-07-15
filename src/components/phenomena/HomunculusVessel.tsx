import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface HomunculusVesselProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number; // 0 to 100
  label?: string;
  loadingColor?: string;
}

export const HomunculusVessel = React.forwardRef<HTMLDivElement, HomunculusVesselProps>(
  ({ className, progress = 0, label = "Transmuting...", loadingColor = "#00d2ff", ...props }, ref) => {
    const vesselRef = useRef<HTMLDivElement>(null);
    const liquidRef = useRef<SVGSVGElement>(null);
    const bubblesRef = useRef<SVGGElement>(null);

    useGSAP(() => {
      const liquid = liquidRef.current;
      const bubbles = bubblesRef.current;
      if (!liquid || !bubbles) return;

      const safeProgress = Math.max(0, Math.min(100, progress));
      const percentage = safeProgress / 100;
      const height = 100 - (percentage * 80); // Y coordinate goes down

      gsap.to(liquid.querySelector("path"), {
        attr: {
          d: `M10,${height} Q30,${height - 10 + Math.sin(percentage * 10) * 5} 50,${height} T90,${height} L90,90 Q50,95 10,90 Z`
        },
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Update actual height level
      gsap.to(liquid.querySelector("path"), {
        attr: {
          d: `M10,${height} Q30,${height - 5} 50,${height} T90,${height} L90,90 Q50,95 10,90 Z`
        },
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto" // Overrides breathing temporary
      });

      // Generate bubbles
      if (progress > 0 && progress < 100) {
        const createBubble = () => {
          if (!bubbles || Math.random() > 0.5) return;
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("r", `${1 + Math.random() * 3}`);
          circle.setAttribute("fill", loadingColor);
          circle.setAttribute("opacity", "0.6");
          const startX = 20 + Math.random() * 60;
          circle.setAttribute("cx", `${startX}`);
          circle.setAttribute("cy", "90");
          bubbles.appendChild(circle);

          gsap.to(circle, {
            cy: height,
            cx: startX + (Math.random() - 0.5) * 20,
            opacity: 0,
            scale: 0.5,
            duration: 1 + Math.random() * 2,
            ease: "power1.in",
            onComplete: () => {
              if (circle.parentNode) circle.parentNode.removeChild(circle);
            },
          });
        };
        const interval = setInterval(createBubble, 100);
        return () => clearInterval(interval);
      }
    }, [progress, loadingColor]);

    return (
      <div ref={vesselRef} className={cn("relative flex flex-col items-center justify-center space-y-4", className)} {...props}>
        <svg
          viewBox="0 0 100 120"
          className="w-24 h-28 drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 0 10px rgba(0, 210, 255, 0.4))" }}
        >
          {/* Flask Outline */}
          <path
            d="M40,10 L60,10 L60,30 L90,90 Q100,105 80,110 Q50,115 20,110 Q0,105 10,90 L40,30 Z"
            fill="none"
            stroke="#5c331d"
            strokeWidth="3"
            opacity="0.8"
          />
          {/* Liquid content */}
          <svg x="0" y="0" width="100" height="120" ref={liquidRef}>
            <path
              d="M10,90 Q50,95 90,90 L90,90 Q50,95 10,90 Z"
              fill={loadingColor}
              opacity="0.7"
              stroke="none"
            />
            {/* Bubbles container */}
            <g ref={bubblesRef}></g>
          </svg>
          {/* Flask Highlights */}
          <path
            d="M20,90 L45,40"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.3"
            strokeLinecap="round"
          />
        </svg>
        <div className="font-mono text-xs text-[#eadbb6] tracking-widest uppercase">
          {label} {Math.round(progress)}%
        </div>
      </div>
    );
  }
);
HomunculusVessel.displayName = "HomunculusVessel";