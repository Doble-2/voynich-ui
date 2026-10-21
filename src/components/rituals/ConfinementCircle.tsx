import React, { useRef, useMemo, useId } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface ConfinementCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  /** Label for the dismiss/reject button @default "Rechazar" */
  dismissLabel?: string;
  /** Label for the confirm/accept button @default "Asimilar" */
  confirmLabel?: string;
  children?: React.ReactNode;
}

export const ConfinementCircle = React.forwardRef<HTMLDivElement, ConfinementCircleProps>(
  ({ className, isOpen, onClose, onConfirm, title = "Aviso Crucial", dismissLabel = "Rechazar", confirmLabel = "Asimilar", children, ...props }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const runesRef = useRef<SVGGElement>(null);
    const innerRunesRef = useRef<SVGGElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<SVGGElement>(null);
    const filterId = `confinement-glow-${useId().replace(/:/g, "")}`;

    // Pre-generate rune characters to prevent re-render flickering and SSR hydration mismatch
    const runes = useMemo(() =>
      Array.from({ length: 16 }, () =>
        String.fromCharCode(0x03b1 + Math.floor(Math.random() * 24))
      ),
    []);

    const innerRunes = useMemo(() =>
      Array.from({ length: 8 }, () =>
        String.fromCharCode(0x0400 + Math.floor(Math.random() * 40))
      ),
    []);

    // Floating particles
    const particles = useMemo(() =>
      Array.from({ length: 20 }, (_, i) => ({
        cx: 250 + (Math.random() - 0.5) * 400,
        cy: 250 + (Math.random() - 0.5) * 400,
        r: 0.5 + Math.random() * 2,
        delay: Math.random() * 3,
      })),
    []);

    useGSAP(() => {
      const overlay = overlayRef.current;
      const circle = circleRef.current;
      const runes = runesRef.current;
      const innerRunesEl = innerRunesRef.current;
      const particlesEl = particlesRef.current;
      if (!overlay || !circle || !runes) return;

      if (isOpen) {
        gsap.to(overlay, { opacity: 1, duration: 0.5, display: "flex" });
        gsap.fromTo(circle, 
          { scale: 0.5, rotation: -180, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "back.out(1.5)" }
        );
        gsap.fromTo(contentRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
        );
        // Spin outer runes clockwise
        gsap.to(runes, {
          rotation: 360,
          transformOrigin: "center center",
          duration: 30,
          repeat: -1,
          ease: "none",
        });
        // Spin inner runes counter-clockwise
        if (innerRunesEl) {
          gsap.to(innerRunesEl, {
            rotation: -360,
            transformOrigin: "center center",
            duration: 20,
            repeat: -1,
            ease: "none",
          });
        }
        // Animate particles
        if (particlesEl) {
          const dots = particlesEl.querySelectorAll("circle");
          dots.forEach((dot, i) => {
            gsap.to(dot, {
              opacity: 0.8,
              y: -20 - Math.random() * 30,
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }
      } else {
        gsap.to(circle, { scale: 1.2, rotation: 45, opacity: 0, duration: 0.6, ease: "power2.in" });
        gsap.to(overlay, { opacity: 0, duration: 0.5, delay: 0.2, onComplete: () => {
          gsap.set(overlay, { display: "none" });
        }});
      }
    }, [isOpen]);

    return (
      <div 
        ref={overlayRef} 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ display: "none", opacity: 0, background: "radial-gradient(circle at center, rgba(13,9,5,0.95) 0%, rgba(0,0,0,0.98) 100%)", backdropFilter: "blur(8px)" }}
      >
        <div 
          ref={circleRef}
          className={cn("relative w-full max-w-[520px] aspect-square flex items-center justify-center", className)}
          {...props}
        >
          {/* Summoning Circle SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
            <defs>
              <filter id={filterId}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
              <radialGradient id={`${filterId}-bg`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#5eead4" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient background glow */}
            <circle cx="250" cy="250" r="240" fill={`url(#${filterId}-bg)`} />

            {/* Triple concentric circles with varying opacity */}
            <circle cx="250" cy="250" r="240" fill="none" stroke="#5c331d" strokeWidth="1" opacity="0.2" />
            <circle cx="250" cy="250" r="230" fill="none" stroke="#5c331d" strokeWidth="2" opacity="0.3" />
            <circle cx="250" cy="250" r="220" fill="none" stroke="#5eead4" strokeWidth="0.5" strokeDasharray="3,8" opacity="0.4" />
            <circle cx="250" cy="250" r="165" fill="none" stroke="#5c331d" strokeWidth="3" opacity="0.6" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="#8b4a2a" strokeWidth="1" opacity="0.4" />
            
            {/* Sacred geometry: inner ring */}
            <circle cx="250" cy="250" r="130" fill="none" stroke="#5eead4" strokeWidth="0.5" opacity="0.2" strokeDasharray="1,6" />

            {/* Floating particles */}
            <g ref={particlesRef}>
              {particles.map((p, i) => (
                <circle key={`p-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="#5eead4" opacity="0" />
              ))}
            </g>

            {/* Outer rotating rune ring */}
            <g ref={runesRef}>
              {/* Double hexagram */}
              <polygon points="250,30 440,140 440,360 250,470 60,360 60,140" fill="none" stroke="#8b4a2a" strokeWidth="0.8" opacity="0.3" />
              <polygon points="250,60 410,160 410,340 250,440 90,340 90,160" fill="none" stroke="#8b4a2a" strokeWidth="0.5" opacity="0.2" />
              
              {/* Star overlay */}
              <polygon points="250,20 300,130 420,130 325,210 355,330 250,260 145,330 175,210 80,130 200,130" fill="none" stroke="#5eead4" strokeWidth="0.3" opacity="0.15" />

              {/* Outer runes (16 positions) */}
              {runes.map((char, i) => (
                <text 
                  key={i} 
                  x="250" y="55" 
                  fontSize="18" 
                  fill="#eaddc5" 
                  opacity="0.5"
                  transform={`rotate(${i * 22.5} 250 250)`}
                  textAnchor="middle"
                  fontFamily="serif"
                >
                  {char}
                </text>
              ))}
            </g>

            {/* Inner counter-rotating rune ring */}
            <g ref={innerRunesRef}>
              {innerRunes.map((char, i) => (
                <text
                  key={`inner-${i}`}
                  x="250" y="100"
                  fontSize="14"
                  fill="#5eead4"
                  opacity="0.3"
                  transform={`rotate(${i * 45} 250 250)`}
                  textAnchor="middle"
                  fontFamily="serif"
                >
                  {char}
                </text>
              ))}
            </g>

            {/* Tick marks around inner circle */}
            {Array.from({ length: 36 }).map((_, i) => (
              <line
                key={`tick-${i}`}
                x1="250" y1="162" x2="250" y2={i % 3 === 0 ? "170" : "166"}
                stroke="#5c331d"
                strokeWidth={i % 3 === 0 ? "1.5" : "0.5"}
                opacity={i % 3 === 0 ? "0.6" : "0.3"}
                transform={`rotate(${i * 10} 250 250)`}
              />
            ))}
          </svg>

          {/* Modal Content */}
          <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center w-[260px] h-[260px] text-center">
            <h3 className="text-lg font-serif text-[#eadbb6] border-b border-[#5c331d]/40 pb-2 mb-3 w-full tracking-wide"
              style={{ textShadow: "0 0 20px rgba(234,219,182,0.1)" }}
            >
              {title}
            </h3>
            <div className="flex-1 overflow-y-auto text-sm font-serif text-[#eadbb6]/60 w-full px-3 scrollbar-thin leading-relaxed">
              {children}
            </div>
            <div className="flex gap-10 mt-4">
              <button 
                onClick={onClose}
                className="text-[#eadbb6]/40 hover:text-red-400 hover:scale-110 font-serif uppercase tracking-[0.2em] text-[10px] transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]"
              >
                {dismissLabel}
              </button>
              <button 
                onClick={onConfirm}
                className="text-[#5eead4] hover:text-white hover:scale-110 font-serif uppercase tracking-[0.2em] text-[10px] transition-all duration-300 drop-shadow-[0_0_5px_rgba(94,234,212,0.3)] hover:drop-shadow-[0_0_12px_rgba(94,234,212,0.6)]"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ConfinementCircle.displayName = "ConfinementCircle";