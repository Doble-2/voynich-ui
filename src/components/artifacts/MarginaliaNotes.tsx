import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '../../lib/utils'; // Adjust path if necessary

interface MarginaliaNotesProps {
  children?: React.ReactNode;
  note: string;
  className?: string; // Add className prop
}

export const MarginaliaNotes: React.FC<MarginaliaNotesProps> = ({ children, note, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    if (isHovered) {
      gsap.to(noteRef.current, {
        autoAlpha: 1,
        x: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(noteRef.current, {
        autoAlpha: 0,
        x: 10,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, { dependencies: [isHovered] });

  return (
    <div ref={containerRef} className={cn("relative group inline-block", className)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <span className="border-b border-dashed border-gray-500 cursor-help">{children}</span>
      <div 
        ref={noteRef} 
        className="absolute left-full top-0 ml-4 w-48 p-2 text-xs font-serif text-amber-100 bg-[#2b1810] border border-[#5c331d] shadow-lg opacity-0 invisible z-10 pointer-events-none before:content-[''] before:absolute before:top-2 before:-left-2 before:border-[8px] before:border-transparent before:border-r-[#5c331d]"
      >
          {note}
      </div>
    </div>
  );
};
