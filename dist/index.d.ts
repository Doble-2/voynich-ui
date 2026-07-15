import React from 'react';

/** Configuración de un anillo individual en el RingPuzzle. */
interface Ring {
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
interface RingPuzzleRef {
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
interface RingPuzzleProps {
    rings: Ring[];
    onChange?: (locked: Record<string, boolean>, rotations: Record<string, number>) => void;
    onSolve?: () => void;
    /** Render prop opcional para controlar cómo se dibuja cada item individual (útil para tooltips, 3D, condicionales extras) */
    renderItem?: (item: React.ReactNode, index: number, ring: Ring, isLocked: boolean) => React.ReactNode;
    size?: number;
    className?: string;
    snapTolerance?: number;
    showCenterPivot?: boolean;
    disabled?: boolean;
}
declare const RingPuzzle: React.ForwardRefExoticComponent<RingPuzzleProps & React.RefAttributes<RingPuzzleRef>>;

/**
 * Propiedades del componente RefractiveFractal.
 * Extiende las propiedades nativas de HTML para permitir el paso
 * de eventos (onClick, onMouseEnter, etc) y atributos estándar.
 */
interface RefractiveFractalProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Permite inyectar un nodo subyacente personalizado.
     * Útil para accesibilidad o integración con librerías de enrutamiento/animación.
     * @default 'div'
     * @example as="button" // Renderiza una etiqueta boton
     * @example as={motion.div} // Framer motion wrap
     */
    as?: React.ElementType;
    /**
     * Determina la resolución y el nivel de detalle matemático del ruido de perlin generado.
     * @default 5
     * @range Rango recomendado: 1 (Formas suaves/blandas) a 10 (Texturas rugosas/Mandelbrot pesado)
     */
    complexity?: number;
    /**
     * La escala de la distorsión, fuerza con la que la onda "rompe" la silueta del hijo.
     * Valores altos causan derrames de color y formas abstractas extremas.
     * @default 30
     * @range Valores útiles: 0 a 300+
     */
    refractionFactor?: number;
    /**
     * Escala de acercamiento a la ecuación generadora fractal.
     * Un valor bajo crea manchas gigantes; un valor alto crea un granulado apretado o rasguños.
     * Puedes pasar dos valores en string como "X Y" para crear vetas horizontales/verticales asimétricas.
     * @default 0.02
     * @example 0.005 // Distorsión a macro-escala fluida.
     * @example "0.2 0.001" // Ruido tipo fallo analógico (glitch o madera).
     */
    frequency?: string | number;
    /**
     * Semilla lógica del random mathizer. Garantiza que obtendrás exactamente
     * el mismo patrón visual para los mismos valores. O te permite cambiar la identidad si se repite.
     * @default 0
     */
    seed?: number;
    /**
     * Define si el fractal debe mutar con el tiempo.
     * Al habilitarse, inyecta un tag `<animate>` optimizado por hardware manipulando el atributo `baseFrequency`.
     * @default false
     */
    animate?: boolean;
    /**
     * Si `animate` está activo, establece la duración (en segundos) de un ciclo respiratorio completo.
     * @default 10
     */
    speed?: number;
}
/**
 * `RefractiveFractal`
 *
 * Un componente envoltura polimórfico que inyecta filtros nativos SVG avanzados (feTurbulence y feDisplacementMap)
 * a cualquier contenido que le pongas dentro (textos, degradados o imágenes).
 * Perfecto para crear fluidos abstractos con TailwindCSS, texturas de lienzo al óleo, manchas orgánicas y botones amorfos que reaccionan.
 *
 * Está construido sobre `forwardRef` para tener control del DOM directo.
 */
declare const RefractiveFractal: React.ForwardRefExoticComponent<RefractiveFractalProps & React.RefAttributes<HTMLElement>>;

type DissolveMode = "burn" | "evaporate";
type DissolveOrigin = "top" | "right" | "bottom" | "left";
type BurnFlameVariant = "front" | "particles";
type BurnPattern = "center" | "edge";
interface CinderDissolveProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    progress?: number;
    animate?: boolean;
    paused?: boolean;
    pauseAt?: number;
    duration?: number;
    loop?: boolean;
    origin?: DissolveOrigin;
    mode?: DissolveMode;
    edgeWidth?: number;
    distortion?: number;
    turbulence?: number;
    particleCount?: number;
    flameVariant?: BurnFlameVariant;
    burnPattern?: BurnPattern;
    glowColor?: string;
    emberColor?: string;
    smokeColor?: string;
    pointAmount?: number;
    burnSeed?: number;
}
declare const CinderDissolve: React.ForwardRefExoticComponent<CinderDissolveProps & React.RefAttributes<HTMLElement>>;

interface CryptextRef {
    /** Reinicia la animación de decodificación desde cero programáticamente. */
    scramble: () => void;
}
/**
 * Propiedades de configuración para el componente de animación de texto.
 */
interface CryptextProps extends React.HTMLAttributes<HTMLSpanElement> {
    /**
     * El texto final a revelar.
     * @example "VOYNICH_PROTOCOL"
     */
    text: string;
    /**
     * Caracteres que se rotarán al azar durante la fase de encriptación.
     * @default "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];,./"
     */
    dictionary?: string;
    /**
     * Velocidad en milisegundos a la que mutan los caracteres o se actualiza cada frame.
     * @default 50
     */
    speed?: number;
    /**
     * Retraso total (en ms) antes de que el componente empiece a fijar progresivamente las letras correctas.
     * @default 800
     */
    delay?: number;
    /**
     * Cantidad de caracteres reales que se "resuelven" por cada ciclo/frame después del delay inicial.
     * @default 1
     */
    resolvePerFrame?: number;
    /**
     * El elemento o etiqueta HTML subyacente para renderizar.
     * @default "span"
     */
    as?: React.ElementType;
}
/**
 * `Cryptext`
 *
 * Un componente envoltura polimórfico de texto que muestra una animación de "desencriptado"
 * matricial. Transiciona desde caracteres aleatorios hasta revelar la información.
 * Puede ser reiniciado mediante referencias (ref) para interactividad UI.
 */
declare const Cryptext: React.ForwardRefExoticComponent<CryptextProps & React.RefAttributes<CryptextRef>>;

interface RadialMenuItem {
    id: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
}
interface RadialMenuRef {
    /** Abre visualmente el menú disparando la animación matemática hacia el exterior. */
    open: () => void;
    /** Cierra y colapsa los nodos del menú regresándolos a su punto de origen. */
    close: () => void;
    /** Alterna entre abierto/cerrado según el estado anterior. */
    toggle: () => void;
}
interface RadialMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Lista de elementos del menú con sus respectivos callbacks, íconos y etiquetas de texto.
     */
    icon?: React.ReactNode;
    items: RadialMenuItem[];
    /**
     * Distancia en píxeles hacia la cual se desplazarán los botones hijos desde el centro al florecer.
     * @default 40
     */
    radius?: number;
    /**
     * El nodo visual React central (trigger). Puede ser el avatar de un usuario o un botón nativo.
     * @default Un botón "+" provisto por defecto si no es sustituido.
     */
    centerNode?: React.ReactNode;
    /**
     * Retraso fraccional (en milisegundos) entre la aparición correlativa de cada ítem (Stagger animation).
     * @default 50
     */
    staggerDelay?: number;
    /**
     * Ángulo (en grados polares) desde donde el arco o semicírculo de los botones inicializa.
     * `0` apunta a la derecha, `-90` arriba, `90` abajo, `180` a la izquierda.
     * @default -90
     */
    startAngle?: number;
    /**
     * Ángulo final absoluto del recorrido. Si se define, se transforma internamente en `arc`.
     * Tiene prioridad menor que `arc`.
     */
    endAngle?: number;
    /**
     * El arco total (en grados) donde se distribuirán equitativamente los componentes dentro.
     * Si no se define, se calcula automáticamente en función del espacio disponible del wrapper.
     * @example 180 // Formará un arco de medio círculo.
     */
    arc?: number;
    /**
     * Clases extra para el botón central por defecto.
     */
    buttonClassName?: string;
}
/**
 * `RadialMenu`
 *
 * Un menú contextual esférico que despliega opciones alrededor de un punto central.
 * Utiliza matemáticas euclidianas nativas (Seno y Coseno) para distribuir dinámicamente
 * un Array de ítems según el ángulo inicial y el arco delimitado, garantizando distribución perfecta
 * sin importar el número inyectado.
 */
declare const RadialMenu: React.ForwardRefExoticComponent<RadialMenuProps & React.RefAttributes<RadialMenuRef>>;

interface ScratchCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
interface ScratchCardRef {
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
declare const ScratchCard: React.ForwardRefExoticComponent<ScratchCardProps & React.RefAttributes<ScratchCardRef>>;

type LensShape = "circle" | "square" | "rounded-square";
type LensFilter = "none" | "sepia" | "grayscale" | "invert" | "vintage" | "x-ray";
interface LensMagnifierProps extends React.HTMLAttributes<HTMLDivElement> {
    src: string;
    alt?: string;
    zoomLevel?: number;
    lensSize?: number;
    lensBorder?: number;
    lensShape?: LensShape;
    lensColor?: string;
    filter?: LensFilter;
    showHandle?: boolean;
    smoothFollowing?: boolean;
}
interface LensMagnifierRef {
    resetZoom: () => void;
}
declare const LensMagnifier: React.ForwardRefExoticComponent<LensMagnifierProps & React.RefAttributes<LensMagnifierRef>>;

export { CinderDissolve, type CinderDissolveProps, Cryptext, type CryptextProps, type CryptextRef, LensMagnifier, type LensMagnifierProps, type LensMagnifierRef, RadialMenu, type RadialMenuItem, type RadialMenuProps, RefractiveFractal, type RefractiveFractalProps, type Ring, type Ring as RingConfig, RingPuzzle, type RingPuzzleProps, ScratchCard, type ScratchCardProps, type ScratchCardRef };
