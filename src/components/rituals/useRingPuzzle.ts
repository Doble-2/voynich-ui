import React, { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../lib/useReducedMotion";

/** Configuración de un anillo individual. */
export interface Ring {
  id: string;
  radius: number;
  thickness: number;
  items?: React.ReactNode[];
  itemOrientation?: "upright" | "radial";
  bgImage?: string;
  bgContent?: React.ReactNode;
  initialRotation?: number;
  targetRotation?: number;
  hideDividers?: boolean;
  ringClassName?: string;
  disabled?: boolean;
  step?: number;
  /** Nombre accesible del anillo (lectores de pantalla). Por defecto `Anillo <id>`. */
  label?: string;
  /**
   * Texto diminuto grabado a lo largo de la escala, como en un astrolabio real.
   * Es decorativo (`aria-hidden`). Se repite para cubrir la circunferencia.
   */
  engraveText?: string;
}

/** Resultado entregado cuando el puzzle se resuelve. Es un dato: el integrador decide qué significa. */
export interface RingPuzzleResult {
  /** Rotación final de cada anillo, normalizada a [0, 360). */
  rotations: Record<string, number>;
  /** Anillos encajados en su `targetRotation` (si lo tienen). */
  locked: Record<string, boolean>;
}

/** Acciones imperativas que el desarrollador puede ejecutar desde el exterior usando ref. */
export interface RingPuzzleRef {
  /** Resetea todos los anillos a su rotación inicial. */
  reset: () => void;
  /** Resuelve el rompecabezas automáticamente fijando todos los anillos en su targetRotation. */
  solve: () => void;
  /** Rota un anillo específico a un grado exacto. */
  setRotation: (ringId: string, degrees: number) => void;
  /** Obtiene la rotación actual de todos los anillos. */
  getRotations: () => Record<string, number>;
}

export interface UseRingPuzzleOptions {
  /** Los anillos del puzzle. */
  rings: Ring[];
  /** Se llama cuando cambia el estado de los anillos. */
  onChange?: ((locked: Record<string, boolean>, rotations: Record<string, number>) => void) | undefined;
  /**
   * Se llama una vez al resolver el puzzle, con la combinación final.
   * Úsalo para derivar una clave sin que la solución viva en este componente.
   */
  onSolve?: ((result: RingPuzzleResult) => void) | undefined;
  /**
   * Verificador externo. Se ejecuta cada vez que un anillo se detiene, con las rotaciones
   * normalizadas. Si devuelve `true` el puzzle se da por resuelto. Permite no incluir la
   * solución en claro: los anillos pueden no tener `targetRotation`.
   */
  verify?: ((rotations: Record<string, number>) => boolean | Promise<boolean>) | undefined;
  /** `auto` respeta `prefers-reduced-motion` (encaje instantáneo, sin inercia). @default "auto" */
  motion?: "auto" | "none" | undefined;
  /** Tolerancia de encaje, en grados. @default 8 */
  snapTolerance?: number | undefined;
  /** Desactiva toda la interacción. @default false */
  disabled?: boolean | undefined;
}

/** Props de comportamiento que debes poner en el elemento que dibuje un anillo. */
export interface RingBehaviorProps {
  ref: (el: HTMLDivElement | null) => void;
  role: "slider" | "presentation";
  tabIndex: number;
  "aria-valuemin": number;
  "aria-valuemax": number;
  "aria-valuenow": number;
  "aria-label": string;
  "aria-disabled": true | undefined;
  "data-locked": boolean;
  "data-interactive": boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  style: React.CSSProperties;
}

export interface UseRingPuzzleReturn {
  /** Ponla en el contenedor: se usa para calcular los ángulos del arrastre. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Anillos encajados en su posición. */
  locked: Record<string, boolean>;
  /** `true` cuando el puzzle está resuelto. */
  solved: boolean;
  /** Los anillos de mayor a menor radio (de atrás hacia delante). */
  sortedRings: Ring[];
  /** Acciones imperativas: `reset`, `solve`, `setRotation`, `getRotations`. */
  controls: RingPuzzleRef;
  /** Si el usuario puede mover ahora mismo ese anillo. */
  isInteractable: (ring: Ring) => boolean;
  /** Props de comportamiento (ref, aria, teclado, arrastre) para el elemento de un anillo. */
  getRingProps: (ring: Ring) => RingBehaviorProps;
}

export const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

const isCloseToTarget = (current: number, target: number, tolerance: number) => {
  const diff = Math.abs(normalizeAngle(current) - normalizeAngle(target));
  return diff <= tolerance || diff >= 360 - tolerance;
};

/**
 * `useRingPuzzle`
 *
 * Toda la mecánica del puzzle de anillos —arrastre con inercia, encaje, teclado, verificación externa,
 * movimiento reducido y accesibilidad— **sin dibujar nada**. Úsalo para pintar el puzzle con tu propio
 * material, o para mover cualquier cosa que gire (diales, ruedas, cerraduras).
 *
 * @example
 * const puzzle = useRingPuzzle({ rings, onSolve });
 * return (
 *   <div ref={puzzle.containerRef}>
 *     {puzzle.sortedRings.map((ring) => (
 *       <div key={ring.id} {...puzzle.getRingProps(ring)}>…tu dibujo…</div>
 *     ))}
 *   </div>
 * );
 */
export function useRingPuzzle({
  rings,
  onChange,
  onSolve,
  verify,
  motion = "auto",
  snapTolerance = 8,
  disabled = false,
}: UseRingPuzzleOptions): UseRingPuzzleReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringNodesRef = useRef<Record<string, HTMLDivElement | null>>({});

  // El estado numérico vive fuera de React para no re-renderizar en cada frame de animación.
  const rotationsProxy = useRef<Record<string, number>>({});

  const [hasSolved, setHasSolved] = useState(false);
  const solvedRef = useRef(false);
  const verifyTicket = useRef(0);
  /** Destino pendiente por anillo mientras se encadenan pulsaciones de teclado. */
  const pendingKeyTarget = useRef<Record<string, number>>({});

  const systemReduced = useReducedMotion();
  const reducedRef = useRef(false);
  reducedRef.current = motion === "none" || systemReduced;
  /** Duración efectiva: 0 cuando el usuario pidió menos movimiento. */
  const dur = (seconds: number) => (reducedRef.current ? 0 : seconds);

  const getInitialLocks = () =>
    rings.reduce(
      (acc, r) => ({
        ...acc,
        [r.id]:
          r.targetRotation !== undefined
            ? isCloseToTarget(r.initialRotation || 0, r.targetRotation, snapTolerance)
            : false,
      }),
      {} as Record<string, boolean>,
    );

  const [lockedRings, setLockedRings] = useState<Record<string, boolean>>(getInitialLocks);
  const lockedRef = useRef(lockedRings);
  lockedRef.current = lockedRings;

  const pointerState = useRef<{
    draggingId: string | null;
    startAngle: number;
    startRotation: number;
    lastAngle: number;
    velocity: number;
  }>({ draggingId: null, startAngle: 0, startRotation: 0, lastAngle: 0, velocity: 0 });

  // Estado inicial en el proxy (solo en el primer montaje).
  useMemo(() => {
    if (Object.keys(rotationsProxy.current).length === 0) {
      rings.forEach((r) => {
        rotationsProxy.current[r.id] = r.initialRotation || 0;
      });
    }
  }, [rings]);

  const syncAria = (id: string) => {
    ringNodesRef.current[id]?.setAttribute(
      "aria-valuenow",
      String(Math.round(normalizeAngle(rotationsProxy.current[id] ?? 0))),
    );
  };

  const normalizedRotations = () =>
    Object.fromEntries(Object.entries(rotationsProxy.current).map(([id, deg]) => [id, normalizeAngle(deg)]));

  const setNodeRotation = (id: string, deg: number) => {
    rotationsProxy.current[id] = deg;
    const node = ringNodesRef.current[id];
    if (node) gsap.set(node, { rotation: deg });
    syncAria(id);
  };

  /** Marca el puzzle como resuelto una sola vez y entrega el resultado como dato. */
  const finishSolve = (locked: Record<string, boolean>) => {
    if (solvedRef.current) return;
    solvedRef.current = true;
    setHasSolved(true);
    onSolve?.({ rotations: normalizedRotations(), locked: { ...locked } });
  };

  /** Consulta al verificador externo (si existe). Ignora respuestas obsoletas. */
  const runVerify = () => {
    if (!verify || solvedRef.current) return;
    const ticket = ++verifyTicket.current;
    Promise.resolve(verify(normalizedRotations())).then((ok) => {
      if (ok && ticket === verifyTicket.current) finishSolve(lockedRef.current);
    });
  };

  useGSAP(
    () => {
      rings.forEach((ring) => setNodeRotation(ring.id, rotationsProxy.current[ring.id] || 0));
    },
    { scope: containerRef, dependencies: [rings] },
  );

  const checkSolutionAndSnap = (ringId: string) => {
    const ringConfig = rings.find((r) => r.id === ringId);
    if (!ringConfig) return;
    syncAria(ringId);
    if (ringConfig.targetRotation === undefined) {
      onChange?.(lockedRef.current, { ...rotationsProxy.current });
      runVerify();
      return;
    }
    const currentRot = rotationsProxy.current[ringId] ?? 0;

    if (isCloseToTarget(currentRot, ringConfig.targetRotation, snapTolerance)) {
      const targetRot = ringConfig.targetRotation;
      rotationsProxy.current[ringId] = targetRot;
      syncAria(ringId);
      const ringNode = ringNodesRef.current[ringId];
      if (!ringNode) return;

      gsap.to(ringNode, {
        rotation: targetRot,
        duration: dur(0.6),
        ease: "back.out(2.2)", // "Clanc" mecánico
        onComplete: () => {
          setLockedRings((prev) => {
            const nextLocked = { ...prev, [ringId]: true };
            const allTargetsMet = rings
              .filter((r) => r.targetRotation !== undefined)
              .every((r) => nextLocked[r.id]);
            if (allTargetsMet) setTimeout(() => finishSolve(nextLocked), 0);
            setTimeout(() => onChange?.(nextLocked, { ...rotationsProxy.current }), 0);
            return nextLocked;
          });
        },
      });
    } else {
      onChange?.(lockedRings, { ...rotationsProxy.current });
      runVerify();
    }
  };

  const controls: RingPuzzleRef = {
    reset: () => {
      setLockedRings(getInitialLocks());
      setHasSolved(false);
      solvedRef.current = false;
      verifyTicket.current++;
      rings.forEach((r) => {
        const deg = r.initialRotation || 0;
        rotationsProxy.current[r.id] = deg;
        const node = ringNodesRef.current[r.id];
        if (node) {
          gsap.to(node, {
            rotation: deg,
            duration: dur(1.2),
            ease: "power3.inOut",
            onUpdate: () => syncAria(r.id),
          });
        }
      });
    },
    solve: () => {
      const solvedLocks = { ...lockedRings };
      rings.forEach((r) => {
        if (r.targetRotation !== undefined) {
          rotationsProxy.current[r.id] = r.targetRotation;
          solvedLocks[r.id] = true;
          const node = ringNodesRef.current[r.id];
          if (node) {
            gsap.to(node, {
              rotation: r.targetRotation,
              duration: dur(2.5),
              ease: "back.out(1.2)",
              onUpdate: () => syncAria(r.id),
            });
          }
        }
      });
      setLockedRings(solvedLocks);
      setTimeout(() => {
        onChange?.(solvedLocks, { ...rotationsProxy.current });
        finishSolve(solvedLocks);
      }, dur(2.5) * 1000);
    },
    setRotation: (ringId, degrees) => {
      const node = ringNodesRef.current[ringId];
      if (node) {
        gsap.to(node, {
          rotation: degrees,
          duration: dur(0.8),
          ease: "power2.out",
          onUpdate: () => {
            rotationsProxy.current[ringId] = gsap.getProperty(node, "rotation") as number;
          },
          onComplete: () => checkSolutionAndSnap(ringId),
        });
      }
    },
    getRotations: () => ({ ...rotationsProxy.current }),
  };

  const getAngle = (clientX: number, clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.atan2(clientY - (rect.top + rect.height / 2), clientX - (rect.left + rect.width / 2)) * (180 / Math.PI);
  };

  const handlePointerDown = (e: React.PointerEvent, ringId: string) => {
    if (disabled) return;
    const ringConfig = rings.find((r) => r.id === ringId);
    if (ringConfig?.disabled || lockedRings[ringId]) return;

    e.stopPropagation();
    e.preventDefault();

    const angle = getAngle(e.clientX, e.clientY);
    pointerState.current = {
      draggingId: ringId,
      startAngle: angle,
      startRotation: rotationsProxy.current[ringId] || 0,
      lastAngle: angle,
      velocity: 0,
    };

    delete pendingKeyTarget.current[ringId];
    const ringNode = ringNodesRef.current[ringId];
    if (ringNode) gsap.killTweensOf(ringNode);
  };

  useGSAP(
    () => {
      const handlePointerMove = (e: PointerEvent) => {
        const { draggingId, startAngle, startRotation, lastAngle } = pointerState.current;
        if (!draggingId) return;

        const currentAngle = getAngle(e.clientX, e.clientY);
        let deltaAngle = currentAngle - startAngle;

        // Cruce del límite de cuadrante (-180 / 180 de atan2).
        if (currentAngle - lastAngle > 180) deltaAngle -= 360;
        if (currentAngle - lastAngle < -180) deltaAngle += 360;

        let newRotation = startRotation + deltaAngle;
        const ringConfig = rings.find((r) => r.id === draggingId);
        if (ringConfig?.step) newRotation = Math.round(newRotation / ringConfig.step) * ringConfig.step;

        pointerState.current.velocity = currentAngle - lastAngle;
        pointerState.current.lastAngle = currentAngle;
        setNodeRotation(draggingId, newRotation);
      };

      const handlePointerUp = () => {
        const { draggingId, velocity } = pointerState.current;
        if (!draggingId) return;
        const ringConfig = rings.find((r) => r.id === draggingId);
        if (!reducedRef.current && Math.abs(velocity) > 2) {
          // Inercia al soltar.
          const currentRot = rotationsProxy.current[draggingId] ?? 0;
          const finalRotation = currentRot + velocity * 4;
          const ringNode = ringNodesRef.current[draggingId];
          if (ringNode) {
            gsap.to(ringNode, {
              rotation: ringConfig?.step ? Math.round(finalRotation / ringConfig.step) * ringConfig.step : finalRotation,
              duration: 0.8,
              ease: "power2.out",
              onUpdate: () => {
                rotationsProxy.current[draggingId] = gsap.getProperty(ringNode, "rotation") as number;
              },
              onComplete: () => checkSolutionAndSnap(draggingId),
            });
          }
        } else {
          checkSolutionAndSnap(draggingId);
        }
        pointerState.current.draggingId = null;
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    },
    { scope: containerRef, dependencies: [rings, snapTolerance, hasSolved, disabled, lockedRings] },
  );

  const handleKeyDown = (e: React.KeyboardEvent, ringId: string) => {
    if (disabled || lockedRings[ringId]) return;
    const ringConfig = rings.find((r) => r.id === ringId);
    if (ringConfig?.disabled) return;

    const deltaAmount = ringConfig?.step || 15;
    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = deltaAmount;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -deltaAmount;
    if (delta === 0) return;

    e.preventDefault();
    // Acumulamos sobre el destino pendiente: las pulsaciones rápidas no deben perderse
    // por leer la rotación a mitad de animación.
    const base = pendingKeyTarget.current[ringId] ?? (rotationsProxy.current[ringId] || 0);
    const nextTarget = base + delta;
    pendingKeyTarget.current[ringId] = nextTarget;
    const ringNode = ringNodesRef.current[ringId];
    if (ringNode) {
      gsap.to(ringNode, {
        rotation: nextTarget,
        duration: dur(0.3),
        ease: "power1.out",
        overwrite: "auto",
        onUpdate: () => {
          rotationsProxy.current[ringId] = gsap.getProperty(ringNode, "rotation") as number;
          syncAria(ringId);
        },
        onComplete: () => {
          delete pendingKeyTarget.current[ringId];
          rotationsProxy.current[ringId] = nextTarget;
          checkSolutionAndSnap(ringId);
        },
      });
    }
  };

  const sortedRings = useMemo(() => [...rings].sort((a, b) => b.radius - a.radius), [rings]);

  const isInteractable = (ring: Ring) => !disabled && !ring.disabled && !lockedRings[ring.id];

  const getRingProps = (ring: Ring): RingBehaviorProps => {
    const interactable = isInteractable(ring);
    return {
      ref: (el) => {
        ringNodesRef.current[ring.id] = el;
      },
      role: interactable ? "slider" : "presentation",
      tabIndex: interactable ? 0 : -1,
      "aria-valuemin": 0,
      "aria-valuemax": 360,
      "aria-valuenow": Math.round(normalizeAngle(ring.initialRotation || 0)),
      "aria-label": ring.label ?? `Anillo ${ring.id}`,
      "aria-disabled": !interactable || undefined,
      "data-locked": Boolean(lockedRings[ring.id]),
      "data-interactive": interactable,
      onPointerDown: (e) => handlePointerDown(e, ring.id),
      onKeyDown: (e) => handleKeyDown(e, ring.id),
      style: { touchAction: "none" },
    };
  };

  return { containerRef, locked: lockedRings, solved: hasSolved, sortedRings, controls, isInteractable, getRingProps };
}
