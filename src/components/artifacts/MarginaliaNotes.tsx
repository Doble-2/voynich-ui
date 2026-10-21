import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';

export interface MarginaliaNotesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The tooltip text shown in the margin annotation. */
  note: string;
  /** The inline content that triggers the annotation on hover. */
  children?: React.ReactNode;
  /** Color del texto de la nota. @default "rgb(255,243,200)" */
  noteColor?: string;
  /** Color de fondo de la nota. @default "#2b1810" */
  noteBgColor?: string;
  /** Color del borde de la nota. @default "#5c331d" */
  noteBorderColor?: string;
  /** Modo de activación. @default "hover" */
  trigger?: "hover" | "click";
}

export const MarginaliaNotes = React.forwardRef<HTMLDivElement, MarginaliaNotesProps>(
  ({ children, note, className, noteColor = "rgb(255,243,200)", noteBgColor = "#2b1810", noteBorderColor = "#5c331d", trigger = "hover", ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const noteRef = useRef<HTMLDivElement>(null);
    const isHoveredRef = useRef(false);

    useGSAP(() => {
      const container = containerRef.current;
      const noteEl = noteRef.current;
      if (!container || !noteEl) return;

      const handleEnter = () => {
        isHoveredRef.current = true;
        gsap.to(noteEl, {
          autoAlpha: 1,
          x: 0,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      const handleLeave = () => {
        isHoveredRef.current = false;
        gsap.to(noteEl, {
          autoAlpha: 0,
          x: 10,
          duration: 0.3,
          ease: 'power2.in',
        });
      };

      container.addEventListener('mouseenter', handleEnter);
      container.addEventListener('mouseleave', handleLeave);

      return () => {
        container.removeEventListener('mouseenter', handleEnter);
        container.removeEventListener('mouseleave', handleLeave);
      };
    }, { scope: containerRef });

    return (
      <div ref={containerRef} className={cn("relative group inline-block", className)} {...props}>
        <span className="border-b border-dashed border-gray-500 cursor-help">{children}</span>
        <div 
          ref={noteRef} 
          className="absolute left-full top-0 ml-4 w-48 p-2 text-xs font-serif text-amber-100 bg-[#2b1810] border border-[#5c331d] shadow-lg opacity-0 invisible z-10 pointer-events-none before:content-[''] before:absolute before:top-2 before:-left-2 before:border-[8px] before:border-transparent before:border-r-[#5c331d]"
        >
            {note}
        </div>
      </div>
    );
  }
);

MarginaliaNotes.displayName = "MarginaliaNotes";
