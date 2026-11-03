import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../lib/useReducedMotion';

export interface IlluminatedDropcapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** La letra capital. */
  letter: string;
  /** El texto que sigue a la capital (sin la primera letra). */
  text: string;
  /**
   * Color de la letra. Por defecto, pan de oro claro.
   * @default "rgb(var(--voynich-gold-light))"
   */
  letterColor?: string;
  /**
   * Color del filete (la doble regla que enmarca la capital).
   * @default "rgb(var(--voynich-gold))"
   */
  borderColor?: string;
  /**
   * Color del campo de la capital. Por defecto, lapislázuli.
   * @default "rgb(var(--voynich-lapis))"
   */
  bgColor?: string;
  /**
   * Tamaño de la letra.
   * @default "3.4rem"
   */
  fontSize?: string;
  /** @deprecated Ya no hay brillo pulsante (no es propio de un códice). Se ignora. */
  glowColor?: string;
}

/**
 * `IlluminatedDropcap`
 *
 * Una capital iluminada: letra en pan de oro sobre un campo de lapislázuli, enmarcada por una doble
 * regla de oro. Se asienta sobre la página con una entrada serena. El texto hereda el color del
 * contexto, de modo que funciona igual sobre pergamino que sobre cuero.
 */
export const IlluminatedDropcap = React.forwardRef<HTMLDivElement, IlluminatedDropcapProps>(
  (
    {
      letter,
      text,
      className,
      letterColor = 'rgb(var(--voynich-gold-light))',
      borderColor = 'rgb(var(--voynich-gold))',
      bgColor = 'rgb(var(--voynich-lapis))',
      fontSize = '3.4rem',
      glowColor: _deprecatedGlow,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    useGSAP(
      () => {
        const letterEl = letterRef.current;
        if (!letterEl || reduced) return;
        gsap.fromTo(
          letterEl,
          { opacity: 0, y: 8, filter: 'brightness(0.7)' },
          { opacity: 1, y: 0, filter: 'brightness(1)', duration: 1.1, ease: 'power2.out' },
        );
      },
      { scope: containerRef, dependencies: [reduced] },
    );

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn('inline-block', className)}
        {...props}
      >
        <div ref={letterRef} className="float-left mr-4 mb-1 relative">
          <div
            className="relative w-[88px] h-[88px] flex items-center justify-center"
            style={{
              backgroundColor: bgColor,
              backgroundImage:
                'radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.18) 0%, transparent 60%), radial-gradient(circle at 70% 85%, rgb(0 0 0 / 0.3) 0%, transparent 60%)',
              // Doble filete: la regla exterior gruesa y otra interior más fina.
              boxShadow: `inset 0 0 0 3px rgb(0 0 0 / 0.35), inset 0 0 0 4px ${borderColor}, inset 0 0 0 7px rgb(0 0 0 / 0.3), inset 0 0 0 8px ${borderColor}, 2px 4px 5px rgb(0 0 0 / 0.4)`,
            }}
          >
            <span
              className="select-none"
              aria-hidden="true"
              style={{
                fontFamily: 'var(--voynich-font-display)',
                fontWeight: 600,
                fontSize,
                lineHeight: 1,
                color: letterColor,
                textShadow: '0 -1px 0 rgb(0 0 0 / 0.5), 0 1px 0 rgb(255 240 200 / 0.18)',
              }}
            >
              {letter}
            </span>
          </div>
        </div>
        <p className="leading-relaxed text-base" style={{ fontFamily: 'var(--voynich-font-body)' }}>
          <span className="sr-only">{letter}</span>
          {text}
        </p>
      </div>
    );
  },
);

IlluminatedDropcap.displayName = 'IlluminatedDropcap';
