import React, { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface VellumTornSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Color del pergamino. @default "#eaddc5" */
  color?: string;
  /** Mostrar borde rasgado superior. @default true */
  topTorn?: boolean;
  /** Mostrar borde rasgado inferior. @default true */
  bottomTorn?: boolean;
  /** Intensidad de la distorsión del rasgado. @default 15 */
  tearIntensity?: number;
  /** Color del texto interior. @default "#30180d" */
  textColor?: string;
  /** Opacidad del ruido de textura (0–1). @default 0.15 */
  noiseOpacity?: number;
  /** Velocidad de la animación orgánica del borde (seg). @default 8 */
  animationSpeed?: number;
}

export const VellumTornSection = React.forwardRef<HTMLDivElement, VellumTornSectionProps>(
  ({ className, children, color = "#eaddc5", topTorn = true, bottomTorn = true, tearIntensity = 15, textColor = "#30180d", noiseOpacity = 0.15, animationSpeed = 8, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const uniqueId = useId();
    const filterId = `tornEdgeFilter_${uniqueId.replace(/:/g, "")}`;

    // Optional animation: very slow, subtle organic shifting of the torn edge
    useGSAP(() => {
      const turbulence = document.getElementById(`${filterId}_turbulence`);
      if (!turbulence) return;

      gsap.to(turbulence, {
        attr: { baseFrequency: "0.1 0.4" }, // subtle freq changing
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }, []);

    // Helper SVG for torn edges
    const TornEdge = ({ isTop }: { isTop: boolean }) => (
      <svg
        className={`absolute left-0 w-full h-[30px] z-10 pointer-events-none drop-shadow-[0_${isTop ? '4' : '-4'}px_8px_rgba(48,24,13,0.3)]`}
        style={{
          top: isTop ? "-15px" : "auto",
          bottom: !isTop ? "-15px" : "auto",
          transform: isTop ? "rotate(0deg)" : "rotate(180deg) scaleX(-1)", // Flip for bottom naturally
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1000 30"
      >
        <defs>
          <filter id={filterId} x="-5%" y="-20%" width="110%" height="140%">
            <feTurbulence id={`${filterId}_turbulence`} type="fractalNoise" baseFrequency="0.08 0.2" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
        {/* Draw a hard path through the displacement filter map */}
        <polygon points="0,30 1000,30 1000,10 0,10" fill={color} filter={`url(#${filterId})`} />
      </svg>
    );

    return (
      <div 
        ref={containerRef} 
        className={cn("relative w-full my-12", className)} 
        style={{ backgroundColor: color }}
        {...props}
      >
        {topTorn && <TornEdge isTop={true} />}
        
        <div className="relative z-20 py-8 px-12 md:px-24 font-serif text-[#30180d] text-lg leading-relaxed mix-blend-multiply">
          {children}
        </div>
        
        {/* Subtle noise over the paper body itself */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

        {bottomTorn && <TornEdge isTop={false} />}
      </div>
    );
  }
);
VellumTornSection.displayName = "VellumTornSection";