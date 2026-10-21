import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface AbyssParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  layers: {
    content: React.ReactNode;
    speed: number;    // Multiplier for Y translation (1 = standard, 0.5 = slow background, 2 = fast foreground)
    scale?: number;   // Visual depth perception via scale down
    blur?: number;    // Water/fog depth effect
    opacity?: number; // Atmospheric reduction
  }[];
}

export const AbyssParallax = React.forwardRef<HTMLDivElement, AbyssParallaxProps>(
  ({ className, layers, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
      const container = containerRef.current;
      const DOMlayers = layerRefs.current.filter(Boolean);

      if (!container || !DOMlayers.length) return;

      const triggers: ScrollTrigger[] = [];

      // Map speeds from props directly into ScrollTrigger
      DOMlayers.forEach((layer, i) => {
        const speed = layers[i]?.speed ?? 1;
        
        // Use gsap.to to animate y from -offset to +offset while container scrolls
        gsap.fromTo(layer, 
          { y: () => -100 * speed },
          {
            y: () => 100 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom", // Animation starts when container top hits screen bottom
              end: "bottom top",   // Animation ends when container bottom hits screen top
              scrub: true,         // Synchronize with scroll position perfectly
            }
          }
        );

        // Capture the ScrollTrigger instance we just created
        const lastTrigger = ScrollTrigger.getAll().pop();
        if (lastTrigger) triggers.push(lastTrigger);
      });

      return () => {
        triggers.forEach(t => t.kill());
      };
    }, { scope: containerRef });

    return (
      <div 
        ref={containerRef} 
        className={cn("relative overflow-hidden min-h-[80vh] flex items-center justify-center bg-[#0d0905] [perspective:1200px]", className)} 
        style={{ backgroundImage: 'radial-gradient(ellipse at center, #1b120c 0%, #0d0905 100%)' }}
        {...props}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay">
          {/* Subtle noise for abyss fog */}
          <div className="w-full h-full opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        </div>

        {layers.map((layer, index) => (
          <div 
            key={index}
            ref={(el) => { layerRefs.current[index] = el; }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              transform: `translateZ(${-(index * 100)}px) scale(${layer.scale ?? 1})`,
              filter: layer.blur ? `blur(${layer.blur}px)` : 'none',
              opacity: layer.opacity ?? 1,
              zIndex: 10 - index, // Layers lower down the array are deeper back
            }}
          >
            {/* Re-enable pointer events for the inner content so children can be interacted with if needed (but currently whole wrapper is pointer-events-none for simpler parallax) */}
            <div className="pointer-events-auto">
              {layer.content}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
AbyssParallax.displayName = "AbyssParallax";