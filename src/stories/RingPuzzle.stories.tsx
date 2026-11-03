import type { Meta, StoryObj } from "@storybook/react";
import { RingPuzzle, type RingPuzzleRef } from "../components/rituals/RingPuzzle";
import { AstrolabeRete } from "../components/phenomena/AstrolabeRete";
import { useState, useRef, useEffect } from "react";

const meta = {
  title: "Descifrar/RingPuzzle",
  component: RingPuzzle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    snapTolerance: { control: { type: 'range', min: 1, max: 30, step: 1 }, description: 'Tolerancia de encaje (grados)' },
    showCenterPivot: { control: 'boolean', description: 'Mostrar pivote central' },
    size: { control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Tamaño del puzzle (px)' },
    disabled: { control: 'boolean', description: 'Desactivar interacción' },
  },
} satisfies Meta<typeof RingPuzzle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rings: [
      {
        id: "outer",
        radius: 180,
        thickness: 60,
        items: ["☿", "♀", "♁", "♂", "♃", "♄", "♅", "♆"],
        initialRotation: 90,
        targetRotation: 0,
        ringClassName: "text-2xl",
        itemOrientation: "upright" as const,
        engraveText: "SOL · LVNA · MERCVRIVS · VENVS · MARS · IVPITER · SATVRNVS",
      },
      {
        id: "inner",
        radius: 120,
        thickness: 60,
        items: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ"],
        initialRotation: 45,
        targetRotation: 0,
        ringClassName: "text-xl font-manuscript",
        bgContent: <AstrolabeRete radius={120} innerRadius={58} />,
      },
    ],
  },
  render: (args) => (
    <div className="p-12 w-full flex flex-col items-center gap-6">
      <h3 className="font-smallcaps text-lg text-voynich-vellum/70 tracking-[0.3em]">Alineamiento Planetario</h3>
      <RingPuzzle {...args} />
      <p className="font-manuscript text-base text-voynich-vellum/55 italic max-w-sm text-center">
        Gira los anillos para alinear los símbolos alquímicos con sus numerales romanos correspondientes.
      </p>
    </div>
  ),
};

// Custom center SVG to replicate the Sun Face details
const SunFaceGraphic = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    style={{ fill: "#c05c2a" }}
  >
    <defs>
      <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffeba1" />
        <stop offset="60%" stopColor="#e2a03f" />
        <stop offset="100%" stopColor="#9a4d1a" />
      </radialGradient>
      <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#43b593" />
        <stop offset="100%" stopColor="#1e5f80" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#sunGrad)" />
    {/* Sun rays or mandala petals */}
    {Array.from({ length: 16 }).map((_, i) => (
      <polygon
        key={`ray-${i}`}
        points="50,12 56,0 44,0"
        fill={i % 2 === 0 ? "#9c341a" : "#ca6e28"}
        transform={`rotate(${i * (360 / 16)} 50 50)`}
      />
    ))}
    {/* Center Ocean/Face placeholder (matching image 2 & 3 hybrid) */}
    <circle
      cx="50"
      cy="50"
      r="30"
      fill="url(#oceanGrad)"
      stroke="#4a180b"
      strokeWidth="2"
    />

    {/* Simple Ship vector (inspired by image 3) */}
    <g transform="translate(15, 10)">
      <path d="M 30 65 L 50 65 L 45 45 L 35 45 Z" fill="#2b1a10" />
      <path d="M 15 60 Q 30 75 55 60 Q 60 55 65 50 L 10 50 Z" fill="#4a2a1b" />
      {/* Ship Masts */}
      <line
        x1="25"
        y1="50"
        x2="25"
        y2="25"
        stroke="#2b1a10"
        strokeWidth="1.5"
      />
      <line
        x1="40"
        y1="50"
        x2="40"
        y2="20"
        stroke="#2b1a10"
        strokeWidth="1.5"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="30"
        stroke="#2b1a10"
        strokeWidth="1.5"
      />
      {/* Sails */}
      <path
        d="M 25 30 Q 30 40 25 45"
        stroke="#e4d5b7"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 40 25 Q 48 35 40 45"
        stroke="#e4d5b7"
        strokeWidth="2"
        fill="none"
      />
    </g>
  </svg>
);

export const AstrolabioPlanetario: Story = {
  args: {
    rings: [],
  },
  render: () => {
    const [message, setMessage] = useState(
      "Gira las constelaciones, mareas y la nave al unísono...",
    );
    const [solved, setSolved] = useState(false);

    const handleChange = (
      locked: Record<string, boolean>,
      rotations: Record<string, number>,
    ) => {
      if (solved) return;

      const count = Object.values(locked).filter(Boolean).length;
      if (count === 1) setMessage("1/4 Anillos encajados...");
      if (count === 2) setMessage("2/4 Anillos en resonancia...");
      if (count === 3) setMessage("3/4 Muy cerca del alineamiento estelar...");
      if (count === 0)
        setMessage("Gira las constelaciones, mareas y la nave al unísono...");
    };

    const handleSolve = () => {
      setSolved(true);
      setMessage("✨ ¡Gran Conjunción! El códice está resuelto. ✨");
    };

    return (
      <div className="flex flex-col items-center gap-10 bg-[#0a0d14] border-[12px] border-[#311b0e] p-12 rounded-[100%] shadow-[0_0_80px_rgba(0,0,0,1)] relative w-[800px] max-w-full h-[800px] justify-center mx-auto scale-[0.85]">
        {/* Fake Wood/Parchment Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_#211611_0%,_#090503_100%)] opacity-90 pointer-events-none" />

        <RingPuzzle
          size={650}
          onChange={handleChange}
          onSolve={handleSolve}
          snapTolerance={10}
          disabled={solved} // Se bloqueará entero una vez resuelto
          showCenterPivot={false} // Quitamos la púa usando el SVG como centro del todo
          rings={[
            // --- TIER 1: Anillo exterior Cósmico (Fases de la luna) ---
            {
              id: "moon-outer",
              radius: 325,
              thickness: 85,
              items: [
                "🌑",
                "🌒",
                "🌓",
                "🌔",
                "🌕",
                "🌖",
                "🌗",
                "🌘",
                "🌑",
                "🌒",
                "🌓",
                "🌔",
                "🌕",
                "🌖",
                "🌗",
                "🌘",
              ],
              itemOrientation: "radial",
              ringClassName: "bg-[#151c24] border-[#d4a362]",
              // Añadiendo gradiente/fondo para imitar un anillo oscuro con lunas
              bgContent: (
                <div className="w-full h-full bg-[radial-gradient(circle,_#1e293b_0%,_#070a10_100%)] opacity-80" />
              ),
              hideDividers: true,
              initialRotation: 130,
              targetRotation: 0,
            },
            // --- TIER 2: Anillo Calaveras/Mandalas (Imagen 3) ---
            {
              id: "skulls-middle",
              radius: 240,
              thickness: 65,
              items: [
                "💀",
                "密",
                "💀",
                "地",
                "💀",
                "獄",
                "💀",
                "密",
                "💀",
                "地",
                "💀",
                "獄",
              ],
              itemOrientation: "radial", // Texto orientado hacia la circunferencia
              ringClassName: "border-[#5e2715]",
              bgContent: (
                <div className="w-full h-full bg-[#9e3a1f] opacity-40 mix-blend-multiply" />
              ),
              initialRotation: -55,
              targetRotation: 90,
            },
            // --- TIER 3: Anillo Códice Zodiacal (Imagen 2) ---
            {
              id: "zodiac-inner",
              radius: 175,
              thickness: 45,
              items: [
                "♈",
                "♉",
                "♊",
                "♋",
                "♌",
                "♍",
                "♎",
                "♏",
                "♐",
                "♑",
                "♒",
                "♓",
              ],
              itemOrientation: "upright",
              hideDividers: false,
              step: 30, // Gira en encajes dentados de 30°
              initialRotation: 210,
              targetRotation: 180,
            },
            // --- TIER 4: Núcleo Sólido (El barco/Sol de la Imagen 3/2) ---
            // Un anillo donde `thickness` == `radius` se convierte en un disco completo puro
            {
              id: "sun-core",
              radius: 130, // Centro macizo
              thickness: 130,
              hideDividers: true,
              bgContent: <SunFaceGraphic />, // Renderizamos un SVG a medida que girará como fondo
              initialRotation: 45,
              targetRotation: 0,
            },
          ]}
        />

        {message && (
          <div
            className={`absolute bottom-[-60px] text-2xl font-manuscript text-center w-[600px] max-w-full z-10 transition-all duration-700 ${solved ? "text-voynich-gold" : "text-[#a27e53]"}`}
          >
            {message}
          </div>
        )}
      </div>
    );
  },
};

export const CofreConPalabra: Story = {
  args: {
    rings: [],
  },
  render: () => {
    const puzzleRef = useRef<RingPuzzleRef>(null);
    const [inputValue, setInputValue] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Contraseña secreta
    const SECRET_CODE = "VOYNICH";

    const rings = [
      {
        id: "outer",
        radius: 180,
        thickness: 60,
        items: ["V", "X", "Y", "Z", "A", "B", "C", "D"],
        initialRotation: 80,
        targetRotation: 0,
        ringClassName: "bg-voynich-leather text-voynich-vellum border-voynich-inkMedium/40",
      },
      {
        id: "middle",
        radius: 120,
        thickness: 60,
        items: ["O", "P", "Q", "R", "S", "T", "U", "W"],
        initialRotation: 190,
        targetRotation: 0,
        ringClassName: "bg-voynich-leather text-voynich-vellum border-voynich-inkMedium/40",
      },
      {
        id: "inner",
        radius: 60,
        thickness: 60,
        items: ["Y", "N", "I", "C", "H", "!"],
        initialRotation: -120,
        targetRotation: 0,
        ringClassName: "bg-slate-600 text-voynich-vellum border-voynich-inkMedium/40",
      },
    ];

    useEffect(() => {
      // Si el usuario escribe la contraseña correctamente
      if (
        inputValue.toUpperCase() === SECRET_CODE &&
        !isUnlocked &&
        !isAnimating
      ) {
        setIsAnimating(true);
        // Llama al método imperativo para resolver el puzzle automáticamente con la animación
        puzzleRef.current?.solve();
      } else if (inputValue.toUpperCase() !== SECRET_CODE && isUnlocked) {
        // Reset opcional si borra el texto
        setIsUnlocked(false);
        setIsAnimating(false);
        puzzleRef.current?.reset();
      }
    }, [inputValue, isUnlocked, isAnimating]);

    return (
      <div className="flex flex-col items-center gap-8 p-6 sm:p-12 w-full max-w-2xl voy-paper font-manuscript">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display text-voynich-inkDark">
            {isUnlocked ? "El cofre se abre" : "Cofre del boticario"}
          </h2>
          <p className="text-voynich-inkMedium italic max-w-sm mx-auto">
            {isUnlocked
              ? "Dentro hay un folio doblado en cuatro."
              : "Escribe la palabra o alinea los anillos a mano."}
          </p>
        </div>

        <div className="w-full max-w-sm relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isUnlocked || isAnimating}
            placeholder="Palabra…"
            className="w-full px-4 py-3 rounded-md border-2 border-voynich-inkMedium/40 voy-panel text-voynich-vellum text-center font-smallcaps text-xl uppercase tracking-widest focus:outline-none focus:border-voynich-gold disabled:opacity-50 transition-colors"
          />
          <span className="absolute -bottom-6 left-0 right-0 text-center text-xs text-voynich-inkMedium font-smallcaps">
            Pista: VOYNICH
          </span>
        </div>

        <div className="relative mt-6 w-full transition-all duration-1000 ease-in-out">
          <div
            className={`transition-all duration-1000 ${isUnlocked ? "scale-105" : "scale-100"}`}
          >
            <RingPuzzle
              ref={puzzleRef}
              size={400}
              rings={rings}
              disabled={isUnlocked || isAnimating}
              onSolve={() => {
                // Se ejecuta cuando los anillos alcanzan su objetivo (ya sea manual o por auto-solve)
                setIsUnlocked(true);
                setIsAnimating(false);
                // Auto-completa el input si se resolvió manualmente
                if (inputValue.toUpperCase() !== SECRET_CODE) {
                  setInputValue(SECRET_CODE);
                }
              }}
            />
          </div>

          {/* Nuevo Módulo UI que aparece flotando encima */}
          <div
            className={`absolute inset-0 flex items-center justify-center voy-panel backdrop-blur-md rounded-full transition-all duration-1000 pointer-events-none custom-transition ${isUnlocked ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          >
            <div className="text-center p-8 bg-voynich-leather text-voynich-vellum rounded-full h-80 w-80 flex flex-col items-center justify-center border-4 border-voynich-gold shadow-2xl transform transition-transform duration-700 delay-300">
              <svg
                className="w-20 h-20 mb-4 text-voynich-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-smallcaps text-2xl tracking-wider mb-2 text-voynich-gold">Abierto</h3>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const DiscoDeCifrado: Story = {
  args: { rings: [] },
  render: () => {
    // Generar alfabeto A-Z
    const alphabet = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i),
    );
    const [shift, setShift] = useState(0);
    const [message, setMessage] = useState("ALEA IACTA EST");

    const handleChange = (
      _: Record<string, boolean>,
      rotations: Record<string, number>,
    ) => {
      const outer = rotations["cipher-outer"] || 0;
      const inner = rotations["cipher-inner"] || 0;
      // Calcular la diferencia de rotación relativa
      // Cada letra ocupa 360/26 = 13.846 grados
      const diffGrados = (outer - inner + 360) % 360;
      const shiftIndex = Math.round(diffGrados / (360 / 26)) % 26;
      setShift(shiftIndex);
    };

    const encrypt = (text: string) => {
      return text
        .toUpperCase()
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
          }
          return c;
        })
        .join("");
    };

    return (
      <div className="flex flex-col items-center gap-8 p-12 voy-panel rounded-xl border border-voynich-inkMedium/40 shadow-2xl text-voynich-vellum">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-smallcaps text-voynich-brass">Cifrador César</h2>
          <p className="text-voynich-vellum/60 text-sm">
            Gira el anillo interior para cambiar la clave (+{shift})
          </p>
        </div>

        <RingPuzzle
          size={450}
          onChange={handleChange}
          showCenterPivot={true}
          rings={[
            {
              id: "cipher-outer",
              radius: 200,
              thickness: 50,
              items: alphabet,
              itemOrientation: "upright",
              step: 360 / 26,
              ringClassName:
                "bg-voynich-leather text-voynich-brass border-voynich-inkMedium/40 font-smallcaps text-xl",
            },
            {
              id: "cipher-inner",
              radius: 150,
              thickness: 50,
              items: alphabet,
              itemOrientation: "upright",
              step: 360 / 26, // Snap a las letras exactas
              ringClassName:
                "bg-voynich-brass text-voynich-inkDark border-voynich-inkMedium/40 font-smallcaps font-bold text-lg",
              initialRotation: 0,
            },
          ]}
        />

        <div className="w-full max-w-sm flex flex-col gap-4 bg-voynich-leather p-6 rounded-lg border border-voynich-inkMedium/40">
          <div>
            <label className="text-xs text-voynich-vellum/60 uppercase tracking-widest block mb-1">
              Texto Original
            </label>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full voy-panel text-voynich-vellum px-3 py-2 rounded focus:outline-none focus:border-voynich-brass border border-transparent font-smallcaps"
            />
          </div>
          <div>
            <label className="text-xs text-voynich-brass uppercase tracking-widest block mb-1">
              Texto Cifrado
            </label>
            <div className="w-full bg-voynich-brass/30 text-voynich-brass px-3 py-2 rounded font-smallcaps text-xl tracking-widest border border-voynich-brass/50">
              {encrypt(message) || "..."}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const CerraduraDeCombinacion: Story = {
  args: { rings: [] },
  render: () => {
    const [unlocked, setUnlocked] = useState(false);
    // Caja fuerte de 3 combinaciones. 360/10 números = 36 grados por paso
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
      <div className="flex flex-col items-center gap-6 p-12 bg-voynich-leather rounded-3xl border-8 border-voynich-inkMedium/40 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Pestillo: lacre (cerrado) o verdigrís (abierto). Cambia el material, no se enciende una luz. */}
        <div className="flex gap-4 voy-panel px-6 py-3 rounded-t-xl border-t border-x border-voynich-inkMedium/40 shadow-inner">
          <div className={`w-4 h-4 rounded-full ${!unlocked ? "bg-voynich-vermilion" : "bg-voynich-vermilion/20"} transition-colors`} />
          <div className={`w-4 h-4 rounded-full ${unlocked ? "bg-voynich-verdigris" : "bg-voynich-verdigris/20"} transition-colors`} />
        </div>

        <RingPuzzle
          size={380}
          onSolve={() => setUnlocked(true)}
          disabled={unlocked}
          snapTolerance={18} // Más restrictivo
          rings={[
            {
              id: "safe-1",
              radius: 160,
              thickness: 50,
              items: digits,
              itemOrientation: "upright",
              step: 36, // Saltos estrictos de los números
              targetRotation: 36 * 7, // Código: 7
              initialRotation: 36 * 2,
              ringClassName:
                "bg-voynich-vellumAged text-voynich-inkDark font-bold text-2xl border-4 border-voynich-inkMedium/40 shadow-2xl",
            },
            {
              id: "safe-2",
              radius: 110,
              thickness: 50,
              items: digits,
              itemOrientation: "upright",
              step: 36,
              targetRotation: 36 * 3, // Código: 3
              initialRotation: 36 * 8,
              ringClassName:
                "bg-voynich-vellumShade text-voynich-inkDark font-bold text-2xl border-4 border-voynich-inkMedium/40",
            },
            {
              id: "safe-3",
              radius: 60,
              thickness: 50,
              items: digits,
              itemOrientation: "upright",
              step: 36,
              targetRotation: 36 * 9, // Código: 9
              initialRotation: 36 * 1,
              ringClassName:
                "bg-voynich-vellumDark text-voynich-inkDark font-bold text-2xl border-4 border-voynich-inkMedium/40",
            },
          ]}
        />

        {unlocked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            <div className="text-voynich-gold text-3xl font-smallcaps border-2 border-voynich-gold p-6 rounded-sm voy-leather">
              Abierto
            </div>
          </div>
        )}
      </div>
    );
  },
};
