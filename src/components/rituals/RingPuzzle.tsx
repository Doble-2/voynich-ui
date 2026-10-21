import React, {
  useState,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

/** Configuración de un anillo individual en el RingPuzzle. */
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
}

/** Acciones imperativas que el desarrollador puede ejecutar desde el exterior usando ref */
export interface RingPuzzleRef {
  /** Resetea todos los anillos a su rotación inicial */
  reset: () => void;
  /** Resuelve el rompecabezas automáticamente fijando todos los anillos en su targetRotation */
  solve: () => void;
  /** Rota un anillo específico a un grado exacto */
  setRotation: (ringId: string, degrees: number) => void;
  /** Obtiene la rotación actual de todos los anillos */
  getRotations: () => Record<string, number>;
}

/** Propiedades globales para el componente RingPuzzle. */
export interface RingPuzzleProps {
  rings: Ring[];
  onChange?: (
    locked: Record<string, boolean>,
    rotations: Record<string, number>,
  ) => void;
  onSolve?: () => void;
  /** Render prop opcional para controlar cómo se dibuja cada item individual (útil para tooltips, 3D, condicionales extras) */
  renderItem?: (
    item: React.ReactNode,
    index: number,
    ring: Ring,
    isLocked: boolean,
  ) => React.ReactNode;
  size?: number;
  className?: string;
  snapTolerance?: number;
  showCenterPivot?: boolean;
  disabled?: boolean;
}

const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

const isCloseToTarget = (
  current: number,
  target: number,
  tolerance: number,
) => {
  const diff = Math.abs(normalizeAngle(current) - normalizeAngle(target));
  return diff <= tolerance || diff >= 360 - tolerance;
};

export const RingPuzzle = forwardRef<RingPuzzleRef, RingPuzzleProps>(
  (
    {
      rings,
      onChange,
      onSolve,
      renderItem,
      size = 400,
      className,
      snapTolerance = 8,
      showCenterPivot = true,
      disabled = false,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ringNodesRef = useRef<Record<string, HTMLDivElement | null>>({});
    
    // Almacenamos el estado numérico sin gatillar renders por frame de animación
    const rotationsProxy = useRef<Record<string, number>>({});
    
    const [hasSolved, setHasSolved] = useState(false);

    const getInitialLocks = () =>
      rings.reduce(
        (acc, r) => ({
          ...acc,
          [r.id]:
            r.targetRotation !== undefined
              ? isCloseToTarget(
                  r.initialRotation || 0,
                  r.targetRotation,
                  snapTolerance,
                )
              : false,
        }),
        {} as Record<string, boolean>,
      );

    const [lockedRings, setLockedRings] = useState<Record<string, boolean>>(getInitialLocks);
    
    // Pointers y drags (no reactivos para performance numérico)
    const pointerState = useRef<{
      draggingId: string | null;
      startAngle: number;
      startRotation: number;
      lastAngle: number;
      velocity: number;
    }>({
      draggingId: null,
      startAngle: 0,
      startRotation: 0,
      lastAngle: 0,
      velocity: 0,
    });

    // Inyectar estado inicial a proxy
    useMemo(() => {
      // Solo en primer mount
      if (Object.keys(rotationsProxy.current).length === 0) {
        rings.forEach(r => {
          rotationsProxy.current[r.id] = r.initialRotation || 0;
        });
      }
    }, [rings]);

    const setNodeRotation = (id: string, deg: number) => {
      rotationsProxy.current[id] = deg;
      const node = ringNodesRef.current[id];
      if (node) {
        gsap.set(node, { rotation: deg });
      }
    };

    useGSAP(() => {
       rings.forEach((ring) => {
         const deg = rotationsProxy.current[ring.id] || 0;
         setNodeRotation(ring.id, deg);
       });
    }, { scope: containerRef, dependencies: [rings] });

    const checkSolutionAndSnap = (ringId: string) => {
      const ringConfig = rings.find((r) => r.id === ringId);
      if (!ringConfig || ringConfig.targetRotation === undefined) return;
      const currentRot = rotationsProxy.current[ringId] ?? 0;

      if (isCloseToTarget(currentRot, ringConfig.targetRotation, snapTolerance)) {
        // Ejecutamos snap mecánico con GSAP Back out
        const targetRot = ringConfig.targetRotation;
        rotationsProxy.current[ringId] = targetRot;
        const ringNode = ringNodesRef.current[ringId];
        if (!ringNode) return;

        gsap.to(ringNode, {
          rotation: targetRot,
          duration: 0.6,
          ease: "back.out(2.2)", // "Clanc" vibratorio mecánico pesado
          onComplete: () => {
             setLockedRings((prev) => {
               const nextLocked = { ...prev, [ringId]: true };
               const allTargetsMet = rings
                 .filter((r) => r.targetRotation !== undefined)
                 .every((r) => nextLocked[r.id]);

               if (allTargetsMet && !hasSolved) {
                 setHasSolved(true);
                 setTimeout(() => onSolve?.(), 0);
               }
               
               // Retornamos el payload completo de rotaciones al parent callback
               setTimeout(() => onChange?.(nextLocked, { ...rotationsProxy.current }), 0);
               return nextLocked;
             });
          }
        });
      } else {
        onChange?.(lockedRings, { ...rotationsProxy.current });
      }
    };

    useImperativeHandle(ref, () => ({
      reset: () => {
        const nextLocks = getInitialLocks();
        setLockedRings(nextLocks);
        setHasSolved(false);
        rings.forEach((r) => {
          const deg = r.initialRotation || 0;
          rotationsProxy.current[r.id] = deg;
          const node = ringNodesRef.current[r.id];
          if (node) {
            gsap.to(node, {
               rotation: deg,
               duration: 1.2,
               ease: "power3.inOut" // Regreso armónico
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
                  duration: 2.5,
                  ease: "back.out(1.2)"
                });
              }
          }
        });
        setLockedRings(solvedLocks);
        setHasSolved(true);
        setTimeout(() => {
          onChange?.(solvedLocks, rotationsProxy.current);
          onSolve?.();
        }, 2500);
      },
      setRotation: (ringId, degrees) => {
         const node = ringNodesRef.current[ringId];
         if (node) {
             gsap.to(node, {
               rotation: degrees,
               duration: 0.8,
               ease: "power2.out",
               onUpdate: () => {
                   rotationsProxy.current[ringId] = gsap.getProperty(node, "rotation") as number;
               },
               onComplete: () => checkSolutionAndSnap(ringId)
             });
         }
      },
      getRotations: () => ({ ...rotationsProxy.current }),
    }));

    const getAngle = (clientX: number, clientY: number) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
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

      // Si había una animación corriendo en este nodo, matarla
      const ringNode = ringNodesRef.current[ringId];
      if (ringNode) gsap.killTweensOf(ringNode);
    };

    useGSAP(() => {
      const handlePointerMove = (e: PointerEvent) => {
        const { draggingId, startAngle, startRotation, lastAngle } = pointerState.current;
        if (!draggingId) return;

        const currentAngle = getAngle(e.clientX, e.clientY);
        let deltaAngle = currentAngle - startAngle;

        // Soporte de cruce de límite de cuadrante (-180 / 180 atan2)
        if (currentAngle - lastAngle > 180) deltaAngle -= 360;
        if (currentAngle - lastAngle < -180) deltaAngle += 360;

        let newRotation = startRotation + deltaAngle;

        const ringConfig = rings.find((r) => r.id === draggingId);
        if (ringConfig?.step) {
          newRotation = Math.round(newRotation / ringConfig.step) * ringConfig.step;
        }

        pointerState.current.velocity = currentAngle - lastAngle;
        pointerState.current.lastAngle = currentAngle;
        
        // Asignación directa física (muy performante al no recular React)
        setNodeRotation(draggingId, newRotation);
      };

      const handlePointerUp = () => {
        const { draggingId, velocity } = pointerState.current;
        if (draggingId) {
          const ringConfig = rings.find(r => r.id === draggingId);
          // Inercia virtual sintética al soltar
          if (Math.abs(velocity) > 2) {
             const currentRot = rotationsProxy.current[draggingId] ?? 0;
             const finalRotation = currentRot + (velocity * 4);
             const ringNode = ringNodesRef.current[draggingId];
             if (ringNode) {
               gsap.to(ringNode, {
                 rotation: ringConfig?.step ? Math.round(finalRotation / ringConfig.step) * ringConfig.step : finalRotation,
                 duration: 0.8,
                 ease: "power2.out",
                 onUpdate: () => {
                   rotationsProxy.current[draggingId] = gsap.getProperty(ringNode, "rotation") as number;
                 },
                 onComplete: () => {
                   checkSolutionAndSnap(draggingId);
                 }
               });
             }
          } else {
             checkSolutionAndSnap(draggingId);
          }
          
          pointerState.current.draggingId = null;
        }
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }, { scope: containerRef, dependencies: [rings, snapTolerance, hasSolved, disabled, lockedRings] });

    const handleKeyDown = (e: React.KeyboardEvent, ringId: string) => {
      if (disabled || lockedRings[ringId]) return;
      const ringConfig = rings.find((r) => r.id === ringId);
      if (ringConfig?.disabled) return;

      const deltaAmount = ringConfig?.step || 15;
      let delta = 0;

      if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = deltaAmount;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -deltaAmount;

      if (delta !== 0) {
        e.preventDefault();
        const currentRot = rotationsProxy.current[ringId] || 0;
        const ringNode = ringNodesRef.current[ringId];
        if (ringNode) {
          gsap.to(ringNode, {
             rotation: currentRot + delta,
             duration: 0.3,
             ease: "power1.out",
             onUpdate: () => {
               rotationsProxy.current[ringId] = gsap.getProperty(ringNode, "rotation") as number;
             },
             onComplete: () => checkSolutionAndSnap(ringId)
          });
        }
      }
    };

    const sortedRings = useMemo(
      () => [...rings].sort((a, b) => b.radius - a.radius),
      [rings],
    );

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative rounded-full flex items-center justify-center overflow-hidden select-none",
          "bg-background text-foreground border border-border shadow-lg",
          className,
        )}
        style={{
          width: size,
          height: size,
        }}
      >
        {showCenterPivot && (
          <div className="absolute left-1/2 top-1/2 w-8 h-8 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-50 shadow-md border-4 border-background pointer-events-none" />
        )}

        {sortedRings.map((ring, index) => {
          const ringSize = ring.radius * 2;
          const items = ring.items || [];
          const itemAngle = items.length > 0 ? 360 / items.length : 0;
          const isLocked = Boolean(lockedRings[ring.id]);
          const isInteractable = !disabled && !ring.disabled && !isLocked;

          return (
            <div
              key={ring.id}
              ref={(el) => { ringNodesRef.current[ring.id] = el; }} // Asignar ref por ID
              role={isInteractable ? "slider" : "presentation"}
              aria-valuemin={0}
              aria-valuemax={360}
              aria-label={`Anillo ${ring.id}`}
              tabIndex={isInteractable ? 0 : -1}
              onPointerDown={(e) => handlePointerDown(e, ring.id)}
              onKeyDown={(e) => handleKeyDown(e, ring.id)}
              className={cn(
                "absolute rounded-full border overflow-hidden box-border",
                "border-border bg-secondary/30 text-foreground",
                isLocked
                  ? "cursor-default drop-shadow-md brightness-110"
                  : "cursor-grab active:cursor-grabbing",
                isInteractable &&
                  "hover:border-primary focus:outline-none focus:ring-4 focus:ring-ring transition-shadow",
                ring.ringClassName,
              )}
              style={{
                width: ringSize,
                height: ringSize,
                left: (size - ringSize) / 2,
                top: (size - ringSize) / 2,
                borderWidth: ring.thickness === ring.radius ? 0 : 2,
                borderColor: "inherit",
                touchAction: "none",
                backgroundColor: ring.bgImage ? "transparent" : undefined,
                backgroundImage: ring.bgImage
                  ? `url(${ring.bgImage})`
                  : undefined,
                backgroundSize: "cover",
                zIndex: 10 + index,
                // Quitado: transform: rotate(...) porque GSAP lo rige
                // Quitado: transition-transform css porque pelearia con gsap
              }}
            >
              {ring.bgContent && (
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  {ring.bgContent}
                </div>
              )}

              {!ring.hideDividers &&
                items.map((_, i) => (
                  <div
                    key={`line-${i}`}
                    className="absolute left-1/2 top-0 w-[2px] bg-border origin-bottom pointer-events-none"
                    style={{
                      height: ring.thickness,
                      transform: `translateX(-50%) rotate(${i * itemAngle}deg)`,
                      transformOrigin: `50% ${ring.radius}px`,
                    }}
                  />
                ))}

              {items.map((item, i) => {
                const currentItemAngle = i * itemAngle;
                return (
                  <div
                    key={`item-${i}`}
                    className="absolute left-1/2 top-1/2 flex items-center justify-center pointer-events-none"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${currentItemAngle}deg) translateY(-${ring.radius - ring.thickness / 2}px)`,
                      width: ring.thickness * 1.5,
                      height: ring.thickness,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        transform:
                          ring.itemOrientation === "upright"
                            ? "rotate(0deg)"
                            : "rotate(90deg)",
                        opacity: isLocked ? 1 : 0.85,
                        fontWeight: isLocked ? "bold" : "normal",
                        fontSize: `${Math.min(ring.thickness * 0.4, 32)}px`,
                      }}
                    >
                      {renderItem ? renderItem(item, i, ring, isLocked) : item}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  },
);

RingPuzzle.displayName = "RingPuzzle";
