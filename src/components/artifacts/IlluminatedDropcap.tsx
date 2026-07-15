import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '../../lib/utils'; // Adjust path if necessary

interface IlluminatedDropcapProps {
  letter: string;
  text: string;
  className?: string; // Add className prop
}

export const IlluminatedDropcap: React.FC<IlluminatedDropcapProps> = ({ letter, text, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    // Basic gold foil effect
    gsap.fromTo(letterRef.current,
      { opacity: 0, scale: 0.8, rotationY: 45 },
      { opacity: 1, scale: 1, rotationY: 0, duration: 1.5, ease: 'back.out(1.7)' }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={cn("inline-block", className)}>
      <span ref={letterRef} className="float-left text-6xl font-serif text-amber-500 mr-2 border border-amber-500 p-2 shadow-[0_0_10px_rgba(245,158,11,0.5)] bg-[#1a0f05]">
        {letter}
      </span>
      <p className="text-gray-300 leading-relaxed indent-4">{text}</p>
    </div>
  );
};
