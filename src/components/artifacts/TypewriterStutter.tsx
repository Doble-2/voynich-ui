import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface TypewriterStutterProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  speed?: number;
  startDelay?: number;
  textColor?: string;
  onComplete?: () => void;
}

export const TypewriterStutter = React.forwardRef<HTMLDivElement, TypewriterStutterProps>(
  ({ className, text, speed = 50, startDelay = 0, textColor = "#eadbb6", onComplete, ...props }, ref) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
      const node = textRef.current;
      const cursor = cursorRef.current;
      if (!node || !cursor) return;

      let pos = 0;
      let isGlitching = false;
      const totalLen = text.length;
      node.textContent = "";

      // Cursor blinking
      gsap.to(cursor, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true, ease: "steps(1)" });

      const animateTyping = () => {
        if (pos > totalLen) {
          onComplete?.();
          return;
        }

        // Random glitch: 10% chance to type garbage, or delete
        if (Math.random() < 0.1 && pos > 0 && !isGlitching) {
          isGlitching = true;
          // Stutter effect: replace last char with random symbol temporarily
          const glitchChar = String.fromCharCode(33 + Math.floor(Math.random() * 60));
          node.textContent = text.slice(0, pos - 1) + glitchChar;
          
          gsap.to(containerRef.current, {
            x: (Math.random() - 0.5) * 4,
            duration: 0.05,
            yoyo: true,
            repeat: 3,
            ease: "none",
          });

          setTimeout(() => {
            isGlitching = false;
            node.textContent = text.slice(0, pos); // restore correct
            setTimeout(animateTyping, speed * 2);
          }, speed * 3);
        } else if (Math.random() < 0.05 && pos > 2 && !isGlitching) {
          // Erase back random amount
          isGlitching = true;
          pos -= Math.floor(1 + Math.random() * 3);
          node.textContent = text.slice(0, pos);
          setTimeout(() => {
            isGlitching = false;
            animateTyping();
          }, speed * 4);
        } else {
          // Normal typing
          node.textContent = text.slice(0, pos);
          pos++;
          
          // Varying speed simulating mechanical resistance
          const dynamicSpeed = isGlitching ? speed * 0.2 : speed + (Math.random() * speed);
          setTimeout(animateTyping, dynamicSpeed);
        }
      };

      setTimeout(animateTyping, startDelay);
    }, [text, speed, startDelay]);

    return (
      <div 
        ref={containerRef} 
        className={cn("font-mono text-sm leading-relaxed tracking-wider", className)}
        style={{ color: textColor }}
        {...props}
      >
        <span ref={textRef} />
        <span 
          ref={cursorRef} 
          className="inline-block w-[0.5em] h-[1em] ml-1 align-middle"
          style={{ backgroundColor: textColor }}
        />
      </div>
    );
  }
);
TypewriterStutter.displayName = "TypewriterStutter";