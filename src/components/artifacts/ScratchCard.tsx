import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/useReducedMotion";

export interface ScratchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Ancho máximo de la tarjeta en píxeles (en contenedores más estrechos se encoge manteniendo la proporción).
   * @default 300
   */
  width?: number;
  /**
   * The height of the scratch card in pixels.
   * @default 200
   */
  height?: number;
  /**
   * La cubierta que se rasca: una URL `url(...)`, un color CSS o un degradado.
   * Si se omite, se pinta una cubierta de pan de oro con grano y vetas.
   */
  coverImage?: string;
  /**
   * Brush size in pixels for scratching.
   * @default 20
   */
  brushSize?: number;
  /**
   * Hardness of the brush (0 to 1). Lower is softer/blurrier.
   * @default 1
   */
  brushHardness?: number;
  /**
   * Auto-reveal threshold (0 to 1). If the scratched area exceeds this, the entire card is cleared.
   * Null removes the auto-reveal functionality.
   * @default 0.5
   */
  clearThreshold?: number | null;
  /**
   * Callback triggered when the card has been scratched beyond the clearThreshold.
   */
  onComplete?: () => void;
  /**
   * The content to reveal underneath the cover.
   */
  children?: React.ReactNode;
}

export interface ScratchCardRef {
  /**
   * Forces the scratch card to completely reset.
   */
  reset: () => void;
  /**
   * Forces the entire card cover to clear magically.
   */
  clear: () => void;
}

/**
 * A classic interactive Scratch-Off card component driven by the Canvas API (`destination-out`).
 * It obscures hidden content and allows users to reveal it by "scratching" with the mouse or touch.
 *
 * Includes built-in support for auto-revealing when a specific threshold is met.
 *
 * @example
 * ```tsx
 * <ScratchCard
 *   width={400}
 *   height={200}
 *   coverImage="url(/noisy-texture.jpg)"
 *   onComplete={() => alert('You won!')}
 * >
 *   <div className="flex bg-gold text-black rounded text-6xl items-center justify-center h-full">
 *     jackpot!
 *   </div>
 * </ScratchCard>
 * ```
 */
/**
 * Pinta una cubierta de pan de oro: base tonal, grano fino, vetas largas y un marco grabado.
 * Determinista: el mismo tamaño da siempre la misma cubierta.
 */
function paintGoldLeaf(ctx: CanvasRenderingContext2D, w: number, h: number) {
  let seed = 1337;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, "#c9a45a");
  base.addColorStop(0.45, "#b08a45");
  base.addColorStop(1, "#8f6c2c");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // Manchas tonales suaves (pátina / pulido desigual).
  for (let i = 0; i < 26; i++) {
    const x = rnd() * w, y = rnd() * h, r = 20 + rnd() * 70;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const light = rnd() > 0.5;
    g.addColorStop(0, light ? "rgba(240,215,150,0.22)" : "rgba(80,50,10,0.2)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Grano fino.
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rnd() - 0.5) * 26;
    img.data[i] = Math.max(0, Math.min(255, img.data[i]! + n));
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1]! + n));
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2]! + n * 0.6));
  }
  ctx.putImageData(img, 0, 0);

  // Vetas largas del pan de oro aplicado a mano.
  ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) {
    const y = rnd() * h, x = rnd() * w, len = 30 + rnd() * 120;
    ctx.strokeStyle = rnd() > 0.5 ? "rgba(255,235,170,0.12)" : "rgba(70,45,10,0.12)";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y + (rnd() - 0.5) * 6);
    ctx.stroke();
  }

  // Marco grabado: doble filete de tinta.
  ctx.strokeStyle = "rgba(48,30,8,0.75)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(6.5, 6.5, w - 13, h - 13);
  ctx.lineWidth = 0.8;
  ctx.strokeRect(10.5, 10.5, w - 21, h - 21);
}

export const ScratchCard = forwardRef<ScratchCardRef, ScratchCardProps>(
  (
    {
      width = 300,
      height = 200,
      coverImage,
      brushSize = 20,
      brushHardness = 1,
      clearThreshold = 0.5,
      onComplete,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    const [isScratching, setIsScratching] = useState(false);
    const [isCleared, setIsCleared] = useState(false);

    // Animaciones para revelar GSAP 
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    // Track scratched area. Because pixel manipulation is expensive, we rely on a cruder estimate
    // or a sparse sampling strategy. Here we use an estimation array.
    const pixelsScratched = useRef<Set<string>>(new Set());

    // Initialization & Cover Paint
    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Limpieza de estados GSAP y React
      if (tweenRef.current) tweenRef.current.kill();
      gsap.set(canvas, { opacity: 1, filter: "none" });
      
      setIsCleared(false);
      pixelsScratched.current.clear();

      canvas.width = width;
      canvas.height = height;

      // We reset the global composite operation to draw the initial cover
      ctx.globalCompositeOperation = "source-over";

      let isDrawn = false;
      if (coverImage && coverImage.startsWith("url")) {
        const img = new Image();
        const match = coverImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
          img.src = match[1];
          img.crossOrigin = "anonymous";
          img.onload = () => {
             ctx.drawImage(img, 0, 0, width, height);
             setupEraseMode(ctx);
          };
          isDrawn = true;
        }
      } 
      
      if (!isDrawn) {
        if (coverImage) {
          ctx.fillStyle = coverImage;
          ctx.fillRect(0, 0, width, height);
        } else {
          paintGoldLeaf(ctx, width, height);
        }
        setupEraseMode(ctx);
      }
    };

    const setupEraseMode = (ctx: CanvasRenderingContext2D) => {
      // Crucial for the scratch effect: any new drawings will erase the existing pixels.
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = brushSize * 2;
      
      if (brushHardness < 1) {
         ctx.shadowBlur = brushSize * (1 - brushHardness);
         ctx.shadowColor = "black";
      } else {
         ctx.shadowBlur = 0;
      }
    };

    useGSAP(() => {
      initializeCanvas();
    }, { dependencies: [width, height, coverImage], scope: containerRef });

    useImperativeHandle(ref, () => ({
      reset: () => {
        initializeCanvas();
      },
      clear: () => {
         const canvas = canvasRef.current;
         if (!canvas || isCleared) return;

         setIsCleared(true);
         tweenRef.current = gsap.to(canvas, {
           opacity: 0,
           filter: "blur(4px)",
           duration: reduced ? 0 : 1.2,
           ease: "power2.inOut",
           onComplete: () => {
             const ctx = canvas.getContext("2d");
             if (ctx) {
               ctx.globalCompositeOperation = "destination-out";
               ctx.fillRect(0, 0, width, height);
             }
             if (onComplete) onComplete();
           }
         });
      },
    }));

    // Handle Input via Ticker para evitar ahogar el main thred
    // Usamos quickTo de Gsap indirectamente si quisieramos rastrear pincel, pero para dibujar
    // en canva necesitamos coordenadas precisas instantaneas.
    const scratch = (
      e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
    ) => {
      if (!isScratching || isCleared) return;

      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      let x, y;

      if ("touches" in e) {
        const touch = e.touches[0];
        if (!touch) return;
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = (e as React.MouseEvent).clientX - rect.left;
        y = (e as React.MouseEvent).clientY - rect.top;
      }
      // La tarjeta se encoge en pantallas estrechas: de px de pantalla a px del lienzo.
      if (rect.width) {
        x *= canvas.width / rect.width;
        y *= canvas.height / rect.height;
      }

      // Apply Hardness gradient if required (more complex, using simple solid dot for now)
      if (brushHardness < 1) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(brushHardness, "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rough check for completion threshold
      // Instead of looping all pixels (laggy on big canvases), we sample a grid.
      if (clearThreshold !== null && Math.random() > 0.8) {
        checkCompletion(ctx);
      }
    };

    const checkCompletion = (ctx: CanvasRenderingContext2D) => {
      if (isCleared) return;
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      const totalPixels = width * height;

      // Sample every 4th pixel to save CPU
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) transparentPixels++;
      }

      const percentCleared = transparentPixels / (totalPixels / 4);

      if (percentCleared >= (clearThreshold as number)) {
        setIsCleared(true);
        
        // Auto-clear the rest smoothly with GSAP
        tweenRef.current = gsap.to(canvasRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
             ctx.globalCompositeOperation = "destination-out";
             ctx.fillRect(0, 0, width, height); // Limpieza final de pixeles sucios
             if (onComplete) onComplete();
          }
        });
      }
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
      setIsScratching(true);
      scratch(e);
    };

    const handleEnd = () => {
      setIsScratching(false);
    };

    // Bind passive touch listeners for mobile to avoid warnings
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const onTouchMove = (e: TouchEvent) => {
        if (isScratching) scratch(e);
      };

      canvas.addEventListener("touchmove", onTouchMove, { passive: false });
      return () => {
        canvas.removeEventListener("touchmove", onTouchMove);
      };
    }, [isScratching]);

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden cursor-crosshair select-none touch-none",
          className,
        )}
        // Tamaño máximo `width`×`height`; en un contenedor más estrecho se encoge sin deformarse.
        style={{ width, maxWidth: "100%", aspectRatio: `${width} / ${height}`, ...style }}
        {...props}
      >
        {/* Hidden Content Beneath */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          {children}
        </div>

        {/* La capa rascable es puramente visual; el contenido de debajo siempre está en el DOM. */}
        {!isCleared && (
          <button
            type="button"
            className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:left-2 focus:top-2 focus:px-2 focus:py-1 focus:text-xs voy-slip"
            onClick={() => {
              const canvas = canvasRef.current;
              if (!canvas || isCleared) return;
              setIsCleared(true);
              tweenRef.current = gsap.to(canvas, {
                opacity: 0,
                duration: reduced ? 0 : 0.6,
                onComplete: () => onComplete?.(),
              });
            }}
          >
            Revelar contenido
          </button>
        )}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onMouseMove={scratch}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          className={cn(
            "absolute inset-0 z-10 h-full w-full",
            isCleared ? "pointer-events-none" : ""
          )}
        />
      </div>
    );
  },
);

ScratchCard.displayName = "ScratchCard";
