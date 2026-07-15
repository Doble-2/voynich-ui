import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface AuraLanternProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  revealContent?: React.ReactNode;
  size?: number;
}

export const AuraLantern = React.forwardRef<HTMLDivElement, AuraLanternProps>(
  ({ className, children, revealContent, size = 150, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lanternRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useGSAP(() => {
      const container = containerRef.current;
      const lantern = lanternRef.current;
      if (!container || !lantern) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(lantern, {
          x: x - size / 2,
          y: y - size / 2,
          duration: 0.1,
          ease: "power2.out",
        });
      };

      const handleMouseEnter = () => {
        setIsHovered(true);
        gsap.to(lantern, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        });
      };

      const handleMouseLeave = () => {
        setIsHovered(false);
        gsap.to(lantern, {
          opacity: 0,
          scale: 0.5,
          duration: 0.6,
          ease: "power2.in",
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [size]);

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden cursor-crosshair bg-[#0d0905] text-[#30180d]", className)}
        {...props}
      >
        <div className="relative z-10 p-8 h-full pointer-events-none opacity-50 mix-blend-multiply">
          {children}
        </div>

        {/* Revealed Layer */}
        <div
          ref={lanternRef}
          className="absolute inset-0 z-20 pointer-events-none rounded-full"
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle at center, rgba(234, 219, 182, 1) 0%, rgba(234, 219, 182, 0.8) 40%, rgba(13, 9, 5, 0) 70%)`,
            mixBlendMode: "screen",
            opacity: 0,
          }}
        />
        <div
          className="absolute inset-0 z-10 p-8 h-full pointer-events-none text-[#eadbb6] opacity-0"
          style={{ clipPath: isHovered ? `circle(${size / 2}px at ${lanternRef.current?.style.left} ${lanternRef.current?.style.top})` : "none" }} // Simple hack for reveal text
        >
          {revealContent}
        </div>
      </div>
    );
  }
);
AuraLantern.displayName = "AuraLantern";