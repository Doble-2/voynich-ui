import React, { useRef, useId } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';

export interface IlluminatedDropcapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** La letra capital iluminada. */
  letter: string;
  /** El texto del cuerpo que fluye alrededor de la letra. */
  text: string;
  /** Color de la letra. @default "rgb(251,191,36)" (amber-400) */
  letterColor?: string;
  /** Color del borde ornamental. @default "rgba(217,119,6,0.4)" (amber-600/40) */
  borderColor?: string;
  /** Color de fondo de la caja de la letra. @default "#1a0f05" */
  bgColor?: string;
  /** Tamaño de la letra capital. @default "3rem" */
  fontSize?: string;
  /** Color del resplandor. @default "rgba(245,158,11,0.4)" */
  glowColor?: string;
}

export const IlluminatedDropcap = React.forwardRef<HTMLDivElement, IlluminatedDropcapProps>(
  ({ letter, text, className, letterColor = "rgb(251,191,36)", borderColor = "rgba(217,119,6,0.4)", bgColor = "#1a0f05", fontSize = "3rem", glowColor = "rgba(245,158,11,0.4)", ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const glowId = `dropcap-glow-${useId().replace(/:/g, "")}`;

    useGSAP(() => {
      const letterEl = letterRef.current;
      if (!letterEl) return;

      // Gold foil shimmer entrance
      gsap.fromTo(letterEl,
        { opacity: 0, scale: 0.6, rotationY: 60, filter: "brightness(0.3)" },
        { 
          opacity: 1, scale: 1, rotationY: 0, filter: "brightness(1)",
          duration: 1.8, ease: 'back.out(1.4)',
        }
      );

      // Continuous subtle glow pulse
      gsap.to(letterEl, {
        boxShadow: `0 0 25px ${glowColor}, inset 0 0 15px ${glowColor.replace(/[\d.]+\)$/, '0.1)')}`,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });
    }, { scope: containerRef });

    return (
      <div ref={containerRef} className={cn("inline-block", className)} {...props}>
        <div ref={letterRef} className="float-left mr-4 mb-1 relative"
          style={{ perspective: "400px" }}
        >
          {/* Ornamental border frame */}
          <div className="relative w-20 h-20 flex items-center justify-center border-2"
            style={{
              borderColor: borderColor,
              backgroundColor: bgColor,
              borderRadius: '4px 12px 4px 8px',
              boxShadow: `0 0 15px ${glowColor.replace(/[\d.]+\)$/, '0.15)')}, inset 0 0 10px ${glowColor.replace(/[\d.]+\)$/, '0.05)')}`,
            }}
          >
            {/* Corner flourishes */}
            <span className="absolute -top-1 -left-1 text-amber-700/30 text-xs">❧</span>
            <span className="absolute -bottom-1 -right-1 text-amber-700/30 text-xs rotate-180">❧</span>

            {/* The letter itself */}
            <span className="font-serif select-none"
              style={{ 
                fontSize: fontSize,
                color: letterColor,
                textShadow: `0 0 12px ${glowColor}, 0 2px 4px rgba(0,0,0,0.6)`,
                filter: 'contrast(1.2) brightness(1.1)',
              }}
            >
              {letter}
            </span>
          </div>
        </div>
        <p className="text-[#eadbb6]/80 leading-relaxed font-serif text-base"
          style={{ filter: 'sepia(0.15) contrast(1.05) brightness(0.95)' }}
        >
          {text}
        </p>
      </div>
    );
  }
);

IlluminatedDropcap.displayName = "IlluminatedDropcap";
