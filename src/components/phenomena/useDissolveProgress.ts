import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../lib/useReducedMotion";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export interface UseDissolveProgressOptions {
  /** Progreso fijo (0 a 1) cuando no se anima. Úsalo para conducirlo desde fuera (scroll, estado…). @default 0 */
  progress?: number | undefined;
  /** Anima el progreso de 0 a 1 por su cuenta. @default false */
  animate?: boolean | undefined;
  /** Pausa la animación. @default false */
  paused?: boolean | undefined;
  /** Progreso (0 a 1) en el que la animación se detiene. */
  pauseAt?: number | undefined;
  /** Duración de un ciclo, en segundos. @default 6 */
  duration?: number | undefined;
  /** Repite la animación. @default true */
  loop?: boolean | undefined;
  /** Se llama en cada cambio del progreso (0 a 1). */
  onProgress?: ((progress: number) => void) | undefined;
  /** Se llama una vez cuando el progreso llega al final (sin `loop`) o a `pauseAt`. */
  onComplete?: (() => void) | undefined;
}

/**
 * `useDissolveProgress`
 *
 * El motor de progreso de `CinderDissolve`, sin dibujar nada: un valor de 0 a 1 que sube solo (con GSAP) o
 * se conduce desde fuera, con pausa, repetición y respeto a `prefers-reduced-motion`. Úsalo para sincronizar
 * cualquier otro efecto con el mismo avance (una máscara tuya, un texto, un sonido).
 *
 * `tick` es el reloj global en ms, útil para animar trazados que dependen del tiempo.
 */
export function useDissolveProgress({
  progress = 0,
  animate: animateProp = false,
  paused = false,
  pauseAt,
  duration = 6,
  loop = true,
  onProgress,
  onComplete,
}: UseDissolveProgressOptions = {}) {
  const reduced = useReducedMotion();
  const animate = animateProp && !reduced;
  const proxy = useRef({ val: progress });
  const [animated, setAnimated] = useState(progress);
  const [tick, setTick] = useState(0);
  const safeDuration = Math.max(duration, 0.1);
  const clampedPauseAt = pauseAt === undefined ? undefined : clamp(pauseAt, 0, 1);

  // Los callbacks se guardan en refs: cambiar de función no debe reiniciar la animación.
  const cbs = useRef({ onProgress, onComplete });
  cbs.current = { onProgress, onComplete };
  const completed = useRef(false);

  useGSAP(
    () => {
      if (!animate) {
        setAnimated(progress);
        return;
      }
      if (paused) {
        if (clampedPauseAt !== undefined) setAnimated(clampedPauseAt);
        return;
      }
      completed.current = false;
      const p = proxy.current;
      p.val = 0;
      const tween = gsap.to(p, {
        val: 1,
        duration: safeDuration,
        ease: "power1.inOut",
        repeat: loop ? -1 : 0,
        onUpdate: () => {
          if (clampedPauseAt !== undefined && p.val >= clampedPauseAt) {
            setAnimated(clampedPauseAt);
            setTick(gsap.ticker.time * 1000);
            tween.pause();
            return;
          }
          setAnimated(p.val);
          setTick(gsap.ticker.time * 1000);
        },
      });
      return () => {
        tween.kill();
      };
    },
    { dependencies: [animate, clampedPauseAt, loop, paused, progress, safeDuration] },
  );

  const value = clamp(animate ? animated : progress, 0, 1);
  const end = clampedPauseAt ?? 1;

  useEffect(() => {
    cbs.current.onProgress?.(value);
    const reachedEnd = value >= end - 1e-6 && (clampedPauseAt !== undefined || !loop || !animate);
    if (value > 0 && reachedEnd && !completed.current) {
      completed.current = true;
      cbs.current.onComplete?.();
    }
    if (value < end - 0.02) completed.current = false;
  }, [value, end, clampedPauseAt, loop, animate]);

  return { progress: value, tick, animate };
}
