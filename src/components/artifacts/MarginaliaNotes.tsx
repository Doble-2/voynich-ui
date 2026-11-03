import React, { useRef, useId } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../lib/useReducedMotion';

export interface MarginaliaNotesProps extends React.HTMLAttributes<HTMLSpanElement> {
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

export const MarginaliaNotes = React.forwardRef<HTMLSpanElement, MarginaliaNotesProps>(
  ({ children, note, className, noteColor, noteBgColor, noteBorderColor, trigger = "hover", ...props }, ref) => {
    const noteId = useId();
    const reduced = useReducedMotion();
    const openRef = useRef(false);
    const containerRef = useRef<HTMLSpanElement>(null);
    const noteRef = useRef<HTMLSpanElement>(null);
    const isHoveredRef = useRef(false);

    useGSAP(() => {
      const container = containerRef.current;
      const noteEl = noteRef.current;
      if (!container || !noteEl) return;

      const open = () => {
        isHoveredRef.current = true;
        gsap.to(noteEl, { autoAlpha: 1, x: 0, rotation: -0.6, duration: reduced ? 0 : 0.4, ease: 'power2.out' });
      };
      const close = () => {
        isHoveredRef.current = false;
        gsap.to(noteEl, { autoAlpha: 0, x: 8, rotation: 0, duration: reduced ? 0 : 0.3, ease: 'power2.in' });
      };
      const toggle = () => { openRef.current = !openRef.current; openRef.current ? open() : close(); };
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { openRef.current = false; close(); } };

      if (trigger === 'click') {
        container.addEventListener('click', toggle);
      } else {
        container.addEventListener('mouseenter', open);
        container.addEventListener('mouseleave', close);
        container.addEventListener('focusin', open);
        container.addEventListener('focusout', close);
      }
      container.addEventListener('keydown', onKey);

      return () => {
        container.removeEventListener('click', toggle);
        container.removeEventListener('mouseenter', open);
        container.removeEventListener('mouseleave', close);
        container.removeEventListener('focusin', open);
        container.removeEventListener('focusout', close);
        container.removeEventListener('keydown', onKey);
      };
    }, { scope: containerRef, dependencies: [trigger, reduced] });

    return (
      <span ref={containerRef} className={cn("relative group inline-block", className)} {...props}>
        <span
          tabIndex={0}
          aria-describedby={noteId}
          className="cursor-help border-b border-dotted border-current focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
        >
          {children}
        </span>
        {/* Glosa al margen: una nota en otra mano sobre un trozo de pergamino. */}
        <span
          ref={noteRef}
          id={noteId}
          role="note"
          className="voy-slip block absolute left-0 top-full mt-2 sm:left-full sm:top-0 sm:mt-0 sm:ml-5 w-52 max-w-[calc(100vw-2rem)] px-3 py-2 text-[13.5px] leading-snug italic opacity-0 invisible z-10 pointer-events-none"
          style={{
            fontFamily: "var(--voynich-font-body)",
            ...(noteColor ? { color: noteColor } : {}),
            ...(noteBgColor ? { backgroundColor: noteBgColor } : {}),
            ...(noteBorderColor ? { borderColor: noteBorderColor } : {}),
          }}
        >
          {note}
        </span>
      </span>
    );
  }
);

MarginaliaNotes.displayName = "MarginaliaNotes";
