import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface AuraLanternProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  revealContent?: React.ReactNode;
  /** Diámetro del halo (px). @default 150 */
  size?: number;
  /** Color del resplandor de la linterna. @default "rgba(234,219,182,1)" */
  glowColor?: string;
  /** Velocidad de seguimiento del mouse (seg). @default 0.1 */
  followSpeed?: number;
  /** Intensidad del brillo (0–1). @default 0.8 */
  intensity?: number;
  /** Color de fondo del contenedor. @default "#0d0905" */
  bgColor?: string;
  /** Callback cuando se revela contenido con la posición actual. */
  onReveal?: (position: { x: number; y: number }) => void;
}

export const AuraLantern = React.forwardRef<HTMLDivElement, AuraLanternProps>(
  ({ className, children, revealContent, size = 150, glowColor = "rgba(234,219,182,1)", followSpeed = 0.1, intensity = 0.8, bgColor = "#0d0905", onReveal, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lanternRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
      const container = containerRef.current;
      const lantern = lanternRef.current;
      const reveal = revealRef.current;
      if (!container || !lantern || !reveal) return;

      // Initialize CSS custom properties for clip-path binding
      container.style.setProperty("--lantern-x", "0px");
      container.style.setProperty("--lantern-y", "0px");

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update lantern glow position via GSAP transforms
        gsap.to(lantern, {
          x: x - size / 2,
          y: y - size / 2,
          duration: followSpeed,
          ease: "power2.out",
        });

        // Update CSS custom properties for the reveal clip-path
        container.style.setProperty("--lantern-x", `${x}px`);
        container.style.setProperty("--lantern-y", `${y}px`);
      };

      const handleMouseEnter = () => {
        gsap.to(lantern, {
          opacity: intensity,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(reveal, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(lantern, {
          opacity: 0,
          scale: 0.5,
          duration: 0.6,
          ease: "power2.in",
        });
        gsap.to(reveal, {
          opacity: 0,
          duration: 0.4,
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
    }, [size, followSpeed, intensity, onReveal]);

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden cursor-crosshair text-[#30180d]", className)}
        style={{ backgroundColor: bgColor }}
        {...props}
      >
        <div className="relative z-10 p-8 h-full pointer-events-none opacity-50 mix-blend-multiply">
          {children}
        </div>

        {/* Revealed Layer — clip-path driven by CSS custom properties */}
        <div
          ref={lanternRef}
          className="absolute inset-0 z-20 pointer-events-none rounded-full"
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle at center, ${glowColor} 0%, ${glowColor.replace(/[\d.]+\)$/, `${intensity * 0.8})`)} 40%, rgba(13, 9, 5, 0) 70%)`,
            mixBlendMode: "screen",
            opacity: 0,
          }}
        />
        <div
          ref={revealRef}
          className="absolute inset-0 z-10 p-8 h-full pointer-events-none text-[#eadbb6]"
          style={{
            clipPath: `circle(${size / 2}px at var(--lantern-x, 0px) var(--lantern-y, 0px))`,
            opacity: 0,
          }}
        >
          {revealContent}
        </div>
      </div>
    );
  }
);
AuraLantern.displayName = "AuraLantern";