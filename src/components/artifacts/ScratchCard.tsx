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

export interface ScratchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The width of the scratch card in pixels.
   * @default 300
   */
  width?: number;
  /**
   * The height of the scratch card in pixels.
   * @default 200
   */
  height?: number;
  /**
   * The image URL, color, or gradient to display as the cover over the scratch card.
   * @default 'gray'
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
export const ScratchCard = forwardRef<ScratchCardRef, ScratchCardProps>(
  (
    {
      width = 300,
      height = 200,
      coverImage = "#888",
      brushSize = 20,
      brushHardness = 1,
      clearThreshold = 0.5,
      onComplete,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
      if (coverImage.startsWith("url")) {
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
        ctx.fillStyle = coverImage;
        ctx.fillRect(0, 0, width, height);
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
           duration: 1.2,
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
        style={{ width, height }}
        {...props}
      >
        {/* Hidden Content Beneath */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          {children}
        </div>

        {/* The Scratchable Canvas Layer */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onMouseMove={scratch}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          className={cn(
            "absolute inset-0 z-10",
            isCleared ? "pointer-events-none" : ""
          )}
        />
      </div>
    );
  },
);

ScratchCard.displayName = "ScratchCard";
