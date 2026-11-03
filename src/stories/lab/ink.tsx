import React from "react";

/**
 * Filtros compartidos por los prototipos: el temblor de una pluma y la aguada que sangra en el papel.
 * Úsalos como `filter={`url(#${id}-pen)`}` y `url(#${id}-wash)`.
 */
export function InkFilters({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-pen`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="5" result="p" />
        <feDisplacementMap in="SourceGraphic" in2="p" scale="1.2" />
      </filter>
      <filter id={`${id}-wash`} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="9" result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale="6" />
      </filter>
      <pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
        <line x1="0" y1="0" x2="0" y2="5" stroke="rgb(var(--voynich-ink))" strokeWidth="0.6" opacity="0.55" />
      </pattern>
      <pattern id={`${id}-dots`} width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="0.7" fill="rgb(var(--voynich-ink))" opacity="0.45" />
        <circle cx="4.5" cy="4.2" r="0.5" fill="rgb(var(--voynich-ink))" opacity="0.35" />
      </pattern>
    </defs>
  );
}

/** Id estable sin «:» (los ids de React no valen dentro de url(#…)). */
export const useInkId = () => React.useId().replace(/:/g, "");
