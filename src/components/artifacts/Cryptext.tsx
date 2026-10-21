import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

export interface CryptextRef {
  /** Reinicia la animación de decodificación desde cero programáticamente. */
  scramble: () => void;
}

/**
 * Propiedades de configuración para el componente de animación de cifrado alquímico.
 */
export interface CryptextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * El conjuro final a revelar (texto claro).
   * @example "VOYNICH_PROTOCOL"
   */
  text: string;
  /**
   * Caracteres abstractos ("glifos") que se rotarán al azar durante la fase de encriptación.
   * @default "ԱΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩאבγδεζηθικλμνξοπρστυφχψω1234567890☿♀♁♂♃♄♅♆♇"
   */
  dictionary?: string;
  /**
   * Velocidad en milisegundos a la que mutan los glifos.
   * @default 60
   */
  speed?: number;
  /**
   * Retraso total (en ms) de confusión pura antes de estabilizar la revelación.
   * @default 700
   */
  delay?: number;
  /**
   * Velocidad de revelado: glifos decodificados por ciclo/frame.
   * @default 1
   */
  resolvePerFrame?: number;
  /**
   * El elemento o etiqueta HTML subyacente para renderizar el papiro virtual.
   * @default "span"
   */
  as?: React.ElementType;
  /**
   * Iniciar la animación automáticamente al montar.
   * @default true
   */
  autoStart?: boolean;
  /**
   * Callback cuando la revelación está completa.
   */
  onComplete?: () => void;
}

const DEFAULT_DICT =
  "ԱΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩאבγδεζηθικλμνξοπρστυφχψω1234567890☿♀♁♂♃♄♅♆♇";

/**
 * `Cryptext`
 *
 * Un encriptador de texto marginal. Representa las anotaciones "ocultas a plena vista".
 * Utiliza GSAP Ticker para rotar glifos alquímicos a alta velocidad sin sacrificar renders de React.
 */
export const Cryptext = forwardRef<CryptextRef, CryptextProps>(
  (
    {
      text,
      dictionary = DEFAULT_DICT,
      speed = 50,
      delay = 800,
      resolvePerFrame = 1,
      as: Tag = "span",
      autoStart = true,
      onComplete: onCompleteCb,
      className,
      ...props
    },
    ref,
  ) => {
    const textRef = useRef<HTMLElement>(null);
    const triggerScramble = useRef<() => void>(() => {});

    useGSAP(() => {
      const node = textRef.current;
      if (!node) return;

      const state = { resolved: 0, lastTick: 0 };
      let tickListener: ((time: number) => void) | null = null;

      triggerScramble.current = () => {
        // Matamos animaciones previas para evitar fantasmas si el dev llama spam a scramble()
        gsap.killTweensOf(state);
        gsap.killTweensOf(node);
        if (tickListener) gsap.ticker.remove(tickListener);

        state.resolved = 0;
        state.lastTick = gsap.ticker.time;

        // Mutación inestable: simulamos la tinta quemándose antes de revelarse
        gsap.to(node, {
          color: "#5c331d",
          opacity: 0.8,
          duration: 0.3,
          ease: "power2.inOut",
        });

        // Tween lógico lineal: Controla cuántas letras ya son el texto final
        gsap.to(state, {
          resolved: text.length,
          duration: (text.length / resolvePerFrame) * (speed / 1000),
          delay: delay / 1000,
          ease: "none", // Lineal para decodificar como máquina fluida
          onComplete: () => {
            // Limpieza al terminar
            if (tickListener) gsap.ticker.remove(tickListener);
            node.textContent = text;
            
            // Regreso al descanso botánico orgánico (tinta asentada)
            gsap.to(node, {
              color: "#30180d",
              opacity: 1,
              duration: 0.8,
              ease: "sine.out",
            });
            onCompleteCb?.();
          },
        });

        // Ticker de alto rendimiento para el DOM (100x más rápido que react useState updates)
        tickListener = (time: number) => {
          if (time - state.lastTick > speed / 1000) {
            state.lastTick = time;
            const roundedResolved = Math.floor(state.resolved);

            let output = "";
            for (let i = 0; i < text.length; i++) {
              // Si ya pasamos por esta letra o es espacio, la revelamos fija
              if (i < roundedResolved || text[i] === " ") {
                output += text[i];
              } else {
                // Glifo alquímico aleatorio
                output += dictionary[Math.floor(Math.random() * dictionary.length)];
              }
            }
            node.textContent = output;
          }
        };

        gsap.ticker.add(tickListener);
      };

      // Disparador inicial
      if (autoStart) triggerScramble.current();

      return () => {
        gsap.killTweensOf(state);
        gsap.killTweensOf(node);
        if (tickListener) gsap.ticker.remove(tickListener);
      };
    }, { dependencies: [text, dictionary, speed, delay, resolvePerFrame, autoStart, onCompleteCb] });

    useImperativeHandle(ref, () => ({
      scramble: () => triggerScramble.current(),
    }));

    return (
      <Tag
        ref={textRef}
        className={cn(
          "font-mono tracking-widest",
          className,
        )}
        style={{
          filter: "contrast(1.2) brightness(0.9) sepia(0.3)",
        }}
        {...props}
      >
        {text}
      </Tag>
    );
  },
);
Cryptext.displayName = "Cryptext";
