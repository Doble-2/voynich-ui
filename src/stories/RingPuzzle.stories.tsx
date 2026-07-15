import type { Meta, StoryObj } from "@storybook/react";
import { RingPuzzle, type RingPuzzleRef } from "../components/rituals/RingPuzzle";
import { useState, useRef, useEffect } from "react";

const meta = {
  title: "Components/RingPuzzle",
  component: RingPuzzle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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
        items: ["A", "B", "C", "D", "E", "F", "G", "H"],
        initialRotation: 0,
        targetRotation: 0,
      },
      {
        id: "inner",
        radius: 120,
        thickness: 60,
        items: ["1", "2", "3", "4", "5", "6"],
        initialRotation: 45,
        targetRotation: 0,
      },
    ],
  },
  render: (args) => (
    <div className="p-12 w-full flex justify-center bg-background rounded-lg border border-border">
      <RingPuzzle {...args} />
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

export const AdvancedDynamicRings: Story = {
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
      <div className="flex flex-col items-center gap-10 bg-[#0a0d14] border-[12px] border-[#311b0e] p-12 rounded-[100%] shadow-[0_0_80px_rgba(0,0,0,1)] relative w-[800px] h-[800px] justify-center mx-auto scale-[0.85]">
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
            className={`absolute bottom-[-60px] text-2xl font-serif text-center w-full max-w-[600px] z-10 transition-all duration-700 ${solved ? "text-[#ffefa0] drop-shadow-[0_0_15px_rgba(255,200,100,1)]" : "text-[#a27e53]"}`}
          >
            {message}
          </div>
        )}
      </div>
    );
  },
};

export const TextInputVariant: Story = {
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
        ringClassName: "bg-slate-800 text-white border-slate-600",
      },
      {
        id: "middle",
        radius: 120,
        thickness: 60,
        items: ["O", "P", "Q", "R", "S", "T", "U", "W"],
        initialRotation: 190,
        targetRotation: 0,
        ringClassName: "bg-slate-700 text-white border-slate-500",
      },
      {
        id: "inner",
        radius: 60,
        thickness: 60,
        items: ["Y", "N", "I", "C", "H", "!"],
        initialRotation: -120,
        targetRotation: 0,
        ringClassName: "bg-slate-600 text-white border-slate-400",
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
      <div className="flex flex-col items-center gap-8 p-12 w-full max-w-2xl bg-background rounded-xl border border-border shadow-lg font-sans">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {isUnlocked ? "¡Módulo Desbloqueado!" : "Portal de Seguridad"}
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            {isUnlocked
              ? "Acceso concedido al sanctum interior."
              : "Introduce la contraseña o alinea los anillos manualmente para acceder."}
          </p>
        </div>

        <div className="w-full max-w-sm relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isUnlocked || isAnimating}
            placeholder="Contraseña..."
            className="w-full px-4 py-3 rounded-md border-2 border-slate-700 bg-slate-900 text-white text-center font-mono text-xl uppercase tracking-widest focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
          />
          <span className="absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground opacity-50 font-mono">
            Pista: VOYNICH
          </span>
        </div>

        <div className="relative mt-6 transition-all duration-1000 ease-in-out">
          <div
            className={`transition-all duration-1000 ${isUnlocked ? "scale-110 drop-shadow-[0_0_40px_rgba(56,189,248,0.4)]" : "scale-100"}`}
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
            className={`absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-md rounded-full transition-all duration-1000 pointer-events-none custom-transition ${isUnlocked ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          >
            <div className="text-center p-8 bg-slate-800 text-white rounded-full h-80 w-80 flex flex-col items-center justify-center border-4 border-emerald-500 shadow-2xl transform transition-transform duration-700 delay-300">
              <svg
                className="w-20 h-20 mb-4 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
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
              <h3 className="font-bold text-2xl tracking-wider mb-2 text-emerald-300">
                ACCESO
                <br />
                CONCEDIDO
              </h3>
              <div className="h-1 w-16 bg-emerald-500/50 rounded animate-pulse mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const CaesarCipher: Story = {
  args: { rings: [] },
  render: () => {
    // Generar alfabeto A-Z
    const alphabet = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i),
    );
    const [shift, setShift] = useState(0);
    const [message, setMessage] = useState("HOLA MUNDO");

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
      <div className="flex flex-col items-center gap-8 p-12 bg-neutral-900 rounded-xl border border-neutral-700 shadow-2xl text-neutral-100">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-mono text-amber-500">Cifrador César</h2>
          <p className="text-neutral-400 text-sm">
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
                "bg-neutral-800 text-amber-500 border-neutral-600 font-mono text-xl",
            },
            {
              id: "cipher-inner",
              radius: 150,
              thickness: 50,
              items: alphabet,
              itemOrientation: "upright",
              step: 360 / 26, // Snap a las letras exactas
              ringClassName:
                "bg-amber-700 text-neutral-900 border-neutral-500 font-mono font-bold text-lg",
              initialRotation: 0,
            },
          ]}
        />

        <div className="w-full max-w-sm flex flex-col gap-4 bg-neutral-800 p-6 rounded-lg border border-neutral-700">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">
              Texto Original
            </label>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-neutral-950 text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-amber-500 border border-transparent font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-amber-600 uppercase tracking-widest block mb-1">
              Texto Cifrado
            </label>
            <div className="w-full bg-amber-950/30 text-amber-500 px-3 py-2 rounded font-mono text-xl tracking-widest border border-amber-900/50">
              {encrypt(message) || "..."}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const SafeLock: Story = {
  args: { rings: [] },
  render: () => {
    const [unlocked, setUnlocked] = useState(false);
    // Caja fuerte de 3 combinaciones. 360/10 números = 36 grados por paso
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
      <div className="flex flex-col items-center gap-6 p-12 bg-zinc-800 rounded-3xl border-8 border-zinc-950 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Luces led */}
        <div className="flex gap-4 bg-zinc-900 px-6 py-3 rounded-t-xl border-t border-x border-zinc-700 shadow-inner">
          <div
            className={`w-4 h-4 rounded-full ${!unlocked ? "bg-red-500 shadow-[0_0_10px_red]" : "bg-red-950"} transition-colors`}
          />
          <div
            className={`w-4 h-4 rounded-full ${unlocked ? "bg-green-500 shadow-[0_0_10px_green]" : "bg-green-950"} transition-colors`}
          />
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
                "bg-zinc-300 text-zinc-900 font-bold text-2xl border-4 border-zinc-400 shadow-2xl",
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
                "bg-zinc-400 text-zinc-950 font-bold text-2xl border-4 border-zinc-500",
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
                "bg-zinc-500 text-zinc-900 font-bold text-2xl border-4 border-zinc-600",
            },
          ]}
        />

        {unlocked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            <div className="text-green-400 text-3xl font-mono font-bold uppercase drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] border-2 border-green-500 p-6 rounded-lg bg-green-950/50">
              Abierto
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const TimePicker: Story = {
  args: { rings: [] },
  render: () => {
    const hours = Array.from({ length: 12 }, (_, i) =>
      (i === 0 ? 12 : i).toString(),
    );
    const minutes = Array.from({ length: 12 }, (_, i) =>
      (i * 5).toString().padStart(2, "0"),
    );
    const ampm = ["AM", "PM"];

    const [time, setTime] = useState({ h: "12", m: "00", p: "AM" });

    const handleChange = (
      _: Record<string, boolean>,
      rotations: Record<string, number>,
    ) => {
      // Calcular índices basado en rotación actual (cada hora es 30 grados)
      const hRot = (((rotations["hours"] || 0) % 360) + 360) % 360;
      const mRot = (((rotations["minutes"] || 0) % 360) + 360) % 360;
      const pRot = (((rotations["ampm"] || 0) % 360) + 360) % 360;

      const hIndex = Math.round((360 - hRot) / 30) % 12;
      const mIndex = Math.round((360 - mRot) / 30) % 12;
      const pIndex = Math.round((360 - pRot) / 180) % 2;

      setTime({
        h: hours[hIndex],
        m: minutes[mIndex],
        p: ampm[pIndex],
      });
    };

    return (
      <div className="flex flex-col items-center gap-6 p-8 bg-white text-slate-800 rounded-3xl shadow-xl w-96">
        <div className="text-5xl font-light tabular-nums tracking-tighter">
          {time.h}:{time.m}{" "}
          <span className="text-xl text-slate-400 ml-1">{time.p}</span>
        </div>

        <RingPuzzle
          size={320}
          onChange={handleChange}
          showCenterPivot={false}
          rings={[
            {
              id: "hours",
              radius: 140,
              thickness: 45,
              items: hours,
              itemOrientation: "upright",
              step: 30, // 360 / 12
              ringClassName:
                "bg-blue-50 text-blue-900 font-medium border-white/50",
            },
            {
              id: "minutes",
              radius: 95,
              thickness: 45,
              items: minutes,
              itemOrientation: "upright",
              step: 30,
              ringClassName:
                "bg-blue-100 text-blue-800 font-medium text-sm border-white/50",
            },
            {
              id: "ampm",
              radius: 50,
              thickness: 50,
              items: ampm,
              itemOrientation: "upright",
              step: 180, // Solo dos lados AM/PM
              ringClassName: "bg-blue-600 text-white font-bold text-xs",
            },
          ]}
        />
      </div>
    );
  },
};

export const ColorMixer: Story = {
  args: { rings: [] },
  render: () => {
    return (
      <div className="flex flex-col items-center gap-6 p-12 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative">
        <h2 className="text-xl font-medium text-slate-500">
          Alinea los colores
        </h2>
        {/* Aquí usaremos bgContent y mix-blend-mode */}
        <RingPuzzle
          size={400}
          showCenterPivot={false}
          rings={[
            {
              id: "cyan",
              radius: 180,
              thickness: 60,
              // Un bloque de cyan que cubre la mitad del anillo
              bgContent: (
                <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-400 opacity-80 mix-blend-multiply rounded-r-full" />
              ),
              hideDividers: true,
              ringClassName: "border-transparent bg-transparent",
            },
            {
              id: "magenta",
              radius: 120,
              thickness: 60,
              bgContent: (
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-fuchsia-500 opacity-80 mix-blend-multiply rounded-b-full" />
              ),
              hideDividers: true,
              ringClassName: "border-transparent bg-transparent",
              initialRotation: 120,
            },
            {
              id: "yellow",
              radius: 60,
              thickness: 60,
              bgContent: (
                <div className="absolute top-0 left-0 w-1/2 h-full bg-yellow-400 opacity-80 mix-blend-multiply rounded-l-full" />
              ),
              hideDividers: true,
              ringClassName: "border-transparent bg-transparent",
              initialRotation: -120,
            },
          ]}
        />
      </div>
    );
  },
};
