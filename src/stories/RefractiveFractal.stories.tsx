import type { Meta, StoryObj } from "@storybook/react";
import { RefractiveFractal } from "../components/phenomena/RefractiveFractal";
import { useState } from "react";
import { cn } from "../lib/utils";

const meta = {
  title: "Effects/RefractiveFractal",
  component: RefractiveFractal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    complexity: { control: { type: 'range', min: 1, max: 10, step: 1 }, description: 'Octavas del ruido Perlin (1=suave, 10=rugoso)' },
    refractionFactor: { control: { type: 'range', min: 0, max: 300, step: 5 }, description: 'Fuerza de distorsión' },
    frequency: { control: { type: 'range', min: 0.001, max: 0.2, step: 0.001 }, description: 'Escala del ruido fractal' },
    seed: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Semilla del patrón' },
    animate: { control: 'boolean', description: 'Activar respiración orgánica' },
    speed: { control: { type: 'range', min: 1, max: 30, step: 1 }, description: 'Duración del ciclo (s)' },
    isDisturbed: { control: 'boolean', description: 'Forzar estado de caos' },
  },
} satisfies Meta<typeof RefractiveFractal>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- 1. MANCHA MANDELBROT / FONDO ABSTRACTO ---
export const ManchaFondo: Story = {
  args: {
    complexity: 6,
    refractionFactor: 120,
    frequency: 0.015,
    animate: true,
    speed: 15,
  },
  render: (args) => (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center bg-slate-950 rounded-3xl overflow-hidden border border-slate-800">
      <RefractiveFractal
        {...args}
        // Creamos una bola base con degradados múltiples. El componente la distorsionará hasta el caos.
        className="absolute inset-0 m-auto w-[350px] h-[350px] bg-gradient-to-tr from-rose-500 via-fuchsia-600 to-indigo-500 rounded-full blur-[20px]"
      />
      <div className="relative z-10 text-center pointer-events-none">
        <h2 className="text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Fluido Dinámico
        </h2>
        <p className="text-slate-300 drop-shadow-md">
          Patrón derivado tipo Mandelbrot
        </p>
      </div>
    </div>
  ),
};

// --- 2. BOTÓN INTERACTIVO ---
export const BotonInteractivo: Story = {
  args: {},
  render: () => {
    const [hover, setHover] = useState(false);

    return (
      <div className="p-20 bg-[#0a0a0a] rounded-3xl flex items-center justify-center">
        <button
          className="relative inline-flex items-center justify-center border-none bg-transparent outline-none cursor-pointer group"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Aquí el botón *es* el fractal directamente. Su forma está definida por el ruido */}
          <RefractiveFractal
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700 ease-out",
              hover ? "scale-125" : "scale-100",
            )}
            style={{ borderRadius: "2rem" }}
            complexity={4}
            // Aumentamos el factor considerablemente en hover para que se deforme y rompa sus bordes
            refractionFactor={hover ? 60 : 15}
            frequency={0.03}
            animate={true}
            speed={2}
          />

          {/* El texto va superpuesto para que sea legible y no sea distorsionado por el filtro SVG */}
          <span className="relative z-10 px-12 py-5 text-white font-mono font-bold text-xl tracking-[0.2em] pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            EJECUTAR_SEC
          </span>
        </button>
      </div>
    );
  },
};

// --- 3. CRISTAL ROTO / PINTURA AL ÓLEO ---
// Aplicando el filtro directamente a una imagen para que los píxeles se refracten
export const DistorsionImagen: Story = {
  args: {
    complexity: 4,
    refractionFactor: 40,
    frequency: 0.02,
    seed: 42,
  },
  render: (args) => (
    <RefractiveFractal
      {...args}
      className="w-[400px] h-[500px] rounded-2xl overflow-hidden shadow-2xl"
    >
      <img
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2464"
        alt="Abstract"
        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
      />
    </RefractiveFractal>
  ),
};

// --- 4. CÓDIGO BARRAS / RUIDO ALIENÍGENA ---
export const TexturaAlien: Story = {
  args: {
    complexity: 10, // Máxima complejidad
    refractionFactor: 200, // Hiper distorsion
    frequency: "0.2 0.001", // Frecuencia asimétrica (estira el ruido vertical u horizontalmente)
    animate: true,
    speed: 5,
  },
  render: (args) => (
    <RefractiveFractal
      {...args}
      className="w-[500px] h-[300px] bg-gradient-to-r from-lime-400 to-green-900 rounded-xl"
    />
  ),
};

// --- 5. TEXTO LIQUIDO / GELATINOSO ---
export const TextoLiquido: Story = {
  args: {
    complexity: 3,
    refractionFactor: 12, // Factor bajo para que el texto siga siendo (más o menos) legible
    frequency: 0.04,
    animate: true,
    speed: 3,
  },
  render: (args) => (
    <div className="flex items-center justify-center p-24 bg-black rounded-xl">
      <RefractiveFractal {...args} className="text-center">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 w-full inline-block pb-4">
          LIQUID
        </h1>
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 mt-[-20px] w-full inline-block">
          STATE
        </h1>
      </RefractiveFractal>
    </div>
  ),
};

// --- 6. GLITCH ANALÓGICO / INTERFERENCIA ---
export const GlitchEffect: Story = {
  args: {
    complexity: 1, // Baja complejidad para que sean bloques sólidos
    refractionFactor: 40,
    frequency: "0.5 0.0001", // Frecuencia X altísima y Y bajísima crea líneas horizontales de ruido
    animate: true,
    speed: 0.5, // Muy rápido
  },
  render: (args) => (
    <div className="relative p-12 bg-zinc-950 flex flex-col items-center gap-6 rounded-md border border-zinc-800">
      <RefractiveFractal {...args}>
        <div className="text-6xl font-mono font-bold text-red-500 tracking-tighter">
          SYSTEM_FAILURE
        </div>
      </RefractiveFractal>
      <RefractiveFractal
        {...args}
        refractionFactor={60}
        frequency={"0.8 0.0001"}
        speed={0.2}
      >
        <img
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000"
          className="w-[400px] h-[250px] object-cover filter grayscale contrast-150"
        />
      </RefractiveFractal>
    </div>
  ),
};

// --- 7. CRISTAL ESMERILADO (FROSTED GLASS) ---
export const CristalEsmerilado: Story = {
  args: {
    complexity: 8,
    refractionFactor: 15, // Poca refracción, simulando granulado fino del cristal
    frequency: 0.8, // Frecuencia MUY alta para hacer el ruido diminuto
  },
  render: (args) => (
    <div className="relative w-[500px] h-[400px] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl">
      {/* Fondo nítido */}
      <img
        src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Background"
      />

      {/* El panel de cristal encima */}
      <div className="relative z-10 w-[80%] h-[70%] bg-white/10 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* El fractal que se aplica *solamente* al div envolvente simulando la textura física en la superficie del cristal */}
        <RefractiveFractal
          {...args}
          className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] opacity-50 backdrop-blur-sm"
        />

        <div className="relative z-20 text-center">
          <h3 className="text-2xl text-white font-light tracking-widest drop-shadow-md">
            FROSTED
          </h3>
          <p className="text-white/70 font-mono text-sm mt-1">G L A S S</p>
        </div>
      </div>
    </div>
  ),
};

// --- 8. TINTA CORRIDA / MANUSCRITO ANTIGUO ---
export const TintaManuscrito: Story = {
  args: {
    complexity: 10, // Máxima rugosidad en los bordes
    refractionFactor: 5, // Muy poca desviación espacial, solo lo suficiente para comerse los perfiles
    frequency: 0.15, // Frecuencia alta para que simule el sangrado microscópico capilar del papel húmedo
    seed: 123,
    animate: false,
  },
  render: (args) => (
    <div className="p-16 bg-[#eaddc4] max-w-sm border-[12px] border-[#311b0e] shadow-[inset_0_0_80px_rgba(100,50,20,0.2)] rounded-sm relative overflow-hidden flex flex-col gap-6">
      {/* Decoloración falsa del papel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,_#c6a982_150%)] pointer-events-none mix-blend-multiply opacity-60" />

      {/* Nuestro componente simulando la sangría de la pluma de un escriba */}
      <RefractiveFractal {...args} className="relative z-10">
        <h2 className="text-5xl font-serif text-[#2a1309] font-bold tracking-tight mb-2">
          Codex Vol. IV
        </h2>
        <p className="text-xl font-serif text-[#3b1f11] leading-relaxed text-justify opacity-90">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui
          mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor
          neque eu tellus rhoncus ut eleifend nibh porttitor.
        </p>

        {/* Un elemento gráfico extra también distorsionado como sello de cera/tinta seca */}
        <div className="my-6 w-16 h-16 bg-[#781f14] rounded-full mx-auto opacity-80 mix-blend-multiply flex items-center justify-center">
          <span className="text-[#eaddc4] text-xs font-serif italic">
            Secreto
          </span>
        </div>

        <p className="text-lg font-serif text-[#3b1f11] font-bold italic tracking-widest text-center">
          Incipit Vita Nova
        </p>
      </RefractiveFractal>
    </div>
  ),
};
