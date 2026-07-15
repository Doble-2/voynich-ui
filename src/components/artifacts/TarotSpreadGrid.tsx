import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface TarotCard {
  id: string;
  title: string;
  description: string;
  frontImage?: React.ReactNode;
  backImage?: React.ReactNode;
}

export interface TarotSpreadGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cards: TarotCard[];
  spreadType?: "fan" | "cross" | "grid";
}

export const TarotSpreadGrid = React.forwardRef<HTMLDivElement, TarotSpreadGridProps>(
  ({ className, cards, spreadType = "fan", ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [spreadLoaded, setSpreadLoaded] = useState(false);
    const [activeCard, setActiveCard] = useState<string | null>(null);

    useGSAP(() => {
      const container = containerRef.current;
      if (!container || !cardRefs.current.length || spreadLoaded) return;

      const mm = gsap.matchMedia();
      const targets = cardRefs.current.filter(Boolean);

      // Distribute based on spread type
      if (spreadType === "fan") {
        gsap.fromTo(targets, 
          { x: 0, y: 0, rotation: 0, opacity: 0, scale: 0.8 },
          {
            x: (i) => (i - targets.length / 2) * 50,
            y: (i) => Math.abs(i - targets.length / 2) * 15,
            rotation: (i) => (i - targets.length / 2) * 10,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "circ.inOut",
            stagger: 0.1,
            transformOrigin: "center bottom",
          }
        );
      } else if (spreadType === "cross") {
        // Celtic cross simplified
        gsap.fromTo(targets, 
          { x: 0, y: 0, rotation: 0, opacity: 0, scale: 0.5 },
          {
            x: (i) => {
              if (i === 1) return 20; // Crossing
              if (i > 1) return (i - 1) * 80;
              return 0;
            },
            y: (i) => {
              if (i === 1) return 10;
              if (i % 2 === 0) return 40;
              return -40;
            },
            rotation: (i) => i === 1 ? 90 : (Math.random() - 0.5) * 5, // The cross card rotates
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.3,
            ease: "power3.inOut",
          }
        );
      } else {
        // Grid
        gsap.fromTo(targets, 
          { y: 50, opacity: 0, rotationY: 180 },
          { y: 0, opacity: 1, rotationY: 0, duration: 1, stagger: 0.1, ease: "back.out(1.2)" }
        );
      }

      setSpreadLoaded(true);
    }, [spreadType]);

    // Flip card interaction
    const handleCardClick = (id: string, index: number) => {
      const card = cardRefs.current[index];
      if (!card) return;

      const isFlipped = activeCard === id;
      setActiveCard(isFlipped ? null : id);

      gsap.to(card.querySelector('.card-inner'), {
        rotationY: isFlipped ? 0 : 180,
        duration: 0.8,
        ease: "power2.inOut",
        z: isFlipped ? 0 : 50,
      });

      // Levitating effect on active card
      gsap.to(card, {
        y: isFlipped ? "-=10" : "-=30", // lift
        scale: isFlipped ? 1.0 : 1.1,
        boxShadow: isFlipped 
          ? "0 4px 10px rgba(0, 0, 0, 0.5)" 
          : "0 20px 40px rgba(234, 219, 182, 0.2)",
        duration: 0.4,
        ease: "sine.inOut"
      });
    };

    return (
      <div 
        ref={containerRef} 
        className={cn("relative min-h-[400px] flex items-center justify-center p-8 [perspective:1000px]", className)} 
        {...props}
      >
        <div className={cn(
          "relative",
          spreadType === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "flex items-center justify-center"
        )}>
          {cards.map((card, index) => (
            <div 
              key={card.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="relative w-40 h-64 cursor-pointer [transform-style:preserve-3d] transition-all"
              style={{
                position: spreadType === "grid" ? "relative" : "absolute",
                zIndex: activeCard === card.id ? 50 : index + 1
              }}
              onClick={() => handleCardClick(card.id, index)}
            >
              {/* Inner container to hold 3D flip */}
              <div 
                className="card-inner relative w-full h-full [transform-style:preserve-3d]"
                style={{ transformOrigin: "center center" }}
              >
                {/* Back (Cover) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-[#180a04] border-2 border-[#5c331d] rounded-lg shadow-2xl overflow-hidden [backface-visibility:hidden]"
                >
                  <div className="absolute inset-2 border border-[#eadbb6]/20 bg-[#21120a] flex items-center justify-center pointer-events-none p-4">
                    {/* Alchemical back pattern placeholder */}
                    <div className="w-16 h-16 border border-[#eadbb6]/30 rotate-45 flex items-center justify-center">
                      <div className="w-12 h-12 border border-[#eadbb6]/40 rounded-full" />
                    </div>
                  </div>
                  {card.backImage}
                </div>

                {/* Front (Content) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-[#eadbb6] text-[#30180d] border-2 border-[#8b6b4a] rounded-lg shadow-inner overflow-hidden [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="flex flex-col h-full p-4 items-center justify-between text-center border-4 border-[#30180d]/10 m-1">
                    <p className="font-serif font-black text-sm tracking-widest border-b border-[#30180d]/20 pb-2 w-full uppercase">
                      {card.title}
                    </p>
                    <div className="flex-1 w-full my-2 relative">
                       {card.frontImage || <div className="absolute inset-0 bg-[#d9c59c] mix-blend-multiply opacity-50" />}
                    </div>
                    <p className="font-mono text-[10px] leading-tight text-[#5c331d] opacity-80 h-10 w-full">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
TarotSpreadGrid.displayName = "TarotSpreadGrid";