import React, { useRef, useState, useImperativeHandle } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface WaxSealShatterRef {
  /** Rompe el sello programáticamente. */
  shatter: () => void;
  /** Restaura el sello al estado original. */
  seal: () => void;
}

export interface WaxSealShatterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Contenido revelado tras romper el sello. */
  children?: React.ReactNode;
  /** Texto descriptivo bajo el sello. @default "Desbloquear Conocimiento" */
  revealText?: string;
  /** Color del sello de cera. @default "#8b0000" */
  sealColor?: string;
  /** Tamaño del sello (px). @default 96 */
  sealSize?: number;
  /** Carácter o texto del emblema central. @default "V" */
  emblem?: string;
  /** Duración de la presión para romper (seg). @default 1.5 */
  holdDuration?: number;
  /** Número de partículas en la ruptura. @default 20 */
  particleCount?: number;
  /** Intensidad de la explosión de partículas (px). @default 150 */
  shatterIntensity?: number;
  /** Callback cuando el sello se rompe. */
  onShatter?: () => void;
  /** Callback cuando el sello se restaura. */
  onSeal?: () => void;
}

export const WaxSealShatter = React.forwardRef<WaxSealShatterRef, WaxSealShatterProps>(
  (
    {
      className,
      children,
      revealText = "Desbloquear Conocimiento",
      sealColor = "#8b0000",
      sealSize = 96,
      emblem = "V",
      holdDuration = 1.5,
      particleCount = 20,
      shatterIntensity = 150,
      onShatter,
      onSeal,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isSealed, setIsSealed] = useState(true);
    const tl = useRef<gsap.core.Timeline | null>(null);

    const performShatter = () => {
      setIsSealed(false);
      const seal = sealRef.current;
      const particlesContainer = particlesRef.current;
      const content = contentRef.current;

      if (!seal || !particlesContainer || !content) return;

      gsap.set(seal, { display: "none" });

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute w-3 h-3 rounded-full border border-red-950";
        particle.style.backgroundColor = sealColor;
        particlesContainer.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * shatterIntensity;

        gsap.to(particle, {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity + 100,
          rotation: Math.random() * 360,
          scale: Math.random() * 2,
          opacity: 0,
          duration: 0.8 + Math.random() * 0.5,
          ease: "circ.out",
          onComplete: () => particle.remove(),
        });
      }

      gsap.fromTo(
        content,
        { height: 0, opacity: 0, scaleY: 0.9, transformOrigin: "top" },
        { height: "auto", opacity: 1, scaleY: 1, duration: 1.2, ease: "bounce.out(1, 0.5)" },
      );

      onShatter?.();
    };

    const performSeal = () => {
      setIsSealed(true);
      const seal = sealRef.current;
      const content = contentRef.current;

      if (seal) {
        gsap.set(seal, { display: "flex", scale: 0 });
        gsap.to(seal, { scale: 1, duration: 0.6, ease: "back.out(1.7)" });
      }

      if (content) {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        });
      }

      onSeal?.();
    };

    useImperativeHandle(ref, () => ({
      shatter: () => {
        if (isSealed) performShatter();
      },
      seal: () => {
        if (!isSealed) performSeal();
      },
    }));

    useGSAP(
      () => {
        if (!sealRef.current || !particlesRef.current || !contentRef.current) return;

        tl.current = gsap.timeline({ paused: true, onComplete: performShatter });

        tl.current.to(sealRef.current, {
          scale: 0.85,
          rotation: (Math.random() - 0.5) * 10,
          filter: "contrast(1.5) brightness(0.8)",
          duration: holdDuration,
          ease: "power2.in",
        });
      },
      { scope: containerRef, dependencies: [holdDuration, sealColor, particleCount, shatterIntensity] },
    );

    const handleMouseDown = () => {
      if (!isSealed) return;
      tl.current?.play();
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

    const emblemSize = sealSize * 0.667;

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
              className="relative rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-4 border-[#5c1010] flex items-center justify-center flex-col z-20"
              style={{
                width: sealSize,
                height: sealSize,
                backgroundColor: sealColor,
                background: `radial-gradient(circle at 30% 30%, #a02020, ${sealColor} 70%, #400000)`,
                filter: "drop-shadow(0px 10px 5px rgba(0,0,0,0.4))",
              }}
            >
              <div
                className="border-2 border-red-950 rounded-full opacity-60 flex items-center justify-center"
                style={{ width: emblemSize, height: emblemSize }}
              >
                <span className="font-serif text-red-950 font-bold text-2xl opacity-70">{emblem}</span>
              </div>
            </div>
            <span className="mt-4 text-[#eadbb6] font-serif text-sm tracking-widest opacity-70">
              {revealText} (Mantén presionado)
            </span>
          </div>
        ) : null}

        <div ref={particlesRef} className="absolute top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none" />

        <div
          ref={contentRef}
          className="relative w-full z-10 overflow-hidden bg-[#eaddc5] text-[#30180d] p-8 rounded border border-[#5c331d]/30 shadow-2xl"
          style={{ opacity: 0, height: 0, display: isSealed ? "none" : "block" }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            }}
          />
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    );
  },
);
WaxSealShatter.displayName = "WaxSealShatter";