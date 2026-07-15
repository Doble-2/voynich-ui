import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface FrequencyTunerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FrequencyTuner = React.forwardRef<HTMLInputElement, FrequencyTunerProps>(
  ({ className, min = 0, max = 100, step = 1, value = 50, onChange, ...props }, ref) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [internalValue, setInternalValue] = useState(value);

    useGSAP(() => {
      const thumb = thumbRef.current;
      const text = textRef.current;
      if (!thumb || !text) return;

      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const val = Number(target.value);
        setInternalValue(val);

        // Interferencia / ruido
        gsap.to(text, {
          opacity: 0.5 + Math.random() * 0.5,
          x: (Math.random() - 0.5) * 2,
          duration: 0.1,
          ease: "none",
        });

        gsap.to(thumb, {
          boxShadow: `0px 0px ${5 + Math.random() * 15}px rgba(100, 255, 255, 0.4)`,
          duration: 0.1,
          ease: "none",
        });

        // "Sintonizado" visual effect
        const isTuned = val === (max - min) / 2; // Assuming middle is tuned
        if (isTuned) {
          gsap.to(text, { color: "#5eead4", fontWeight: "bold", textShadow: "0 0 10px #5eead4", duration: 0.3 });
          gsap.to(thumb, { backgroundColor: "#5eead4", scale: 1.2, duration: 0.3, ease: "back.out(2)" });
        } else {
          gsap.to(text, { color: "#eadbb6", fontWeight: "normal", textShadow: "none", duration: 0.3 });
          gsap.to(thumb, { backgroundColor: "#404040", scale: 1, duration: 0.3, ease: "power2.out" });
        }
      };

      const inputElement = (thumb.parentNode as HTMLDivElement).querySelector("input");
      inputElement?.addEventListener("input", handleInput);

      return () => {
        inputElement?.removeEventListener("input", handleInput);
      };
    }, []);

    const percentage = ((internalValue - min) / (max - min)) * 100;

    return (
      <div className={cn("relative flex items-center w-full h-8", className)}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={(e) => {
            setInternalValue(Number(e.target.value));
            onChange?.(e);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          ref={trackRef}
          className="w-full h-1 bg-[#21120a] rounded-full border border-[#5c331d]/30"
        />
        <div
          ref={thumbRef}
          className="absolute h-4 w-4 rounded-full bg-[#404040] shadow-md border border-[#eadbb6]/30 pointer-events-none transition-transform"
          style={{ left: `calc(${percentage}% - 0.5rem)` }}
        />
        <span
          ref={textRef}
          className="absolute -top-6 text-xs font-mono text-[#eadbb6] pointer-events-none transition-colors"
          style={{ left: `calc(${percentage}% - 1rem)` }}
        >
          {(internalValue).toFixed(1)}Hz
        </span>
      </div>
    );
  }
);
FrequencyTuner.displayName = "FrequencyTuner";