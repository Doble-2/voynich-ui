import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface InvisibleInkBlockProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  revealColor?: string;
  interaction?: "hover" | "click";
}

export const InvisibleInkBlock = React.forwardRef<HTMLSpanElement, InvisibleInkBlockProps>(
  ({ className, text, revealColor = "#8b0000", interaction = "hover", ...props }, ref) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    useGSAP(() => {
      const el = textRef.current;
      if (!el) return;

      if (isRevealed) {
        gsap.to(el, {
          opacity: 1,
          filter: "blur(0px)",
          color: revealColor,
          textShadow: `0 0 8px ${revealColor}60`,
          duration: 2,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, {
          opacity: 0.05,
          filter: "blur(6px)",
          color: "transparent",
          textShadow: "0 0 0px transparent",
          duration: 1,
          ease: "power2.in",
        });
      }
    }, [isRevealed, revealColor]);

    const triggerReveal = () => setIsRevealed(true);
    const triggerHide = () => setIsRevealed(false);

    return (
      <span
        ref={containerRef}
        className={cn("relative cursor-help inline-flex items-center", className)}
        onMouseEnter={interaction === "hover" ? triggerReveal : undefined}
        onMouseLeave={interaction === "hover" ? triggerHide : undefined}
        onClick={interaction === "click" ? () => setIsRevealed(!isRevealed) : undefined}
        {...props}
      >
        <span
          className="absolute inset-0 pointer-events-none border-b border-dashed border-[#5c331d]/30"
          style={{ opacity: isRevealed ? 0 : 1, transition: "opacity 1s" }}
        />
        <span
          ref={textRef}
          className="relative inline-block transition-none"
          style={{
            opacity: 0.05,
            filter: "blur(6px)",
            color: "transparent"
          }}
        >
          {text}
        </span>
      </span>
    );
  }
);
InvisibleInkBlock.displayName = "InvisibleInkBlock";