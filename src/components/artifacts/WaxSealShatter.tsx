import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface WaxSealShatterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  revealText?: string;
  sealColor?: string;
}

export const WaxSealShatter = React.forwardRef<HTMLDivElement, WaxSealShatterProps>(
  ({ className, children, revealText = "Desbloquear Conocimiento", sealColor = "#8b0000", ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isSealed, setIsSealed] = useState(true);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useGSAP(() => {
      if (!sealRef.current || !particlesRef.current || !contentRef.current) return;

      // Define the breaking timeline (paused by default)
      tl.current = gsap.timeline({ paused: true, onComplete: shatterSeal });

      // Build tension
      tl.current.to(sealRef.current, {
        scale: 0.85,
        rotation: (Math.random() - 0.5) * 10,
        filter: "contrast(1.5) brightness(0.8)",
        duration: 1.5,
        ease: "power2.in",
      });

      function shatterSeal() {
        setIsSealed(false);
        const seal = sealRef.current;
        const particlesContainer = particlesRef.current;
        const content = contentRef.current;
        
        if (!seal || !particlesContainer || !content) return;

        // Hide original seal
        gsap.set(seal, { display: "none" });

        // Generate wax particles
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement("div");
          particle.className = "absolute w-3 h-3 rounded-full bg-red-900 border border-red-950";
          particle.style.backgroundColor = sealColor;
          particlesContainer.appendChild(particle);

          const angle = Math.random() * Math.PI * 2;
          const velocity = 50 + Math.random() * 150;
          
          gsap.to(particle, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity + 100, // gravity effect
            rotation: Math.random() * 360,
            scale: Math.random() * 2,
            opacity: 0,
            duration: 0.8 + Math.random() * 0.5,
            ease: "circ.out",
            onComplete: () => particle.remove(),
          });
        }

        // Reveal content (scroll unroll metaphor)
        gsap.fromTo(content, 
          { height: 0, opacity: 0, scaleY: 0.9, transformOrigin: "top" },
          { height: "auto", opacity: 1, scaleY: 1, duration: 1.2, ease: "bounce.out(1, 0.5)" }
        );
      }
    }, { scope: containerRef });

    const handleMouseDown = () => {
      if (!isSealed) return;
      tl.current?.play();
      // Add a slight shake to container while pressing
      gsap.to(containerRef.current, {
        x: () => (Math.random() - 0.5) * 4,
        y: () => (Math.random() - 0.5) * 4,
        duration: 0.05,
        repeat: -1,
        yoyo: true,
      });
    };

    const handleMouseUp = () => {
      if (!isSealed) return;
      tl.current?.reverse();
      gsap.killTweensOf(containerRef.current);
      gsap.to(containerRef.current, { x: 0, y: 0, duration: 0.1 });
    };

    return (
      <div ref={containerRef} className={cn("relative flex flex-col items-center", className)} {...props}>
        {isSealed ? (
          <div 
            className="flex flex-col items-center cursor-pointer select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          >
            <div 
              ref={sealRef}
              className="relative w-24 h-24 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-4 border-[#5c1010] flex items-center justify-center flex-col z-20"
              style={{
                backgroundColor: sealColor,
                background: `radial-gradient(circle at 30% 30%, #a02020, ${sealColor} 70%, #400000)`,
                filter: "drop-shadow(0px 10px 5px rgba(0,0,0,0.4))",
              }}
            >
              {/* Embossed emblem placeholder */}
              <div className="w-16 h-16 border-2 border-red-950 rounded-full opacity-60 flex items-center justify-center">
                <span className="font-serif text-red-950 font-bold text-2xl opacity-70">V</span>
              </div>
            </div>
            <span className="mt-4 text-[#eadbb6] font-serif text-sm tracking-widest opacity-70">
              {revealText} (Mantén presionado)
            </span>
          </div>
        ) : null}

        {/* Particles render here */}
        <div ref={particlesRef} className="absolute top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none" />

        {/* Revealed Content */}
        <div 
          ref={contentRef} 
          className="relative w-full z-10 overflow-hidden bg-[#eaddc5] text-[#30180d] p-8 rounded border border-[#5c331d]/30 shadow-2xl"
          style={{ opacity: 0, height: 0, display: isSealed ? 'none' : 'block' }}
        >
          {/* Vellum texture overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    );
  }
);
WaxSealShatter.displayName = "WaxSealShatter";