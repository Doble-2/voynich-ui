import type { Meta, StoryObj } from "@storybook/react";
import { ScratchCard, type ScratchCardRef } from "../components/artifacts/ScratchCard";
import { useRef, useState } from "react";

const meta = {
  title: "Components/ScratchCard",
  component: ScratchCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScratchCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic winning ticket
export const WinningTicket: Story = {
  render: () => {
    const [won, setWon] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-zinc-100 rounded-xl relative">
        <h2 className="text-2xl font-bold text-zinc-800">Raspa para ganar</h2>
        <ScratchCard
          width={400}
          height={200}
          coverImage="#9ca3af" // Tailwind gray-400 equivalent
          brushSize={25}
          clearThreshold={0.5}
          onComplete={() => setWon(true)}
          className="rounded-xl shadow-inner border border-zinc-300"
        >
          <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
            <div className="text-center relative z-10">
              <span className="text-6xl filter drop-shadow-md">💰</span>
              <h3 className="text-3xl font-black text-white mt-2 drop-shadow-md">
                ¡$1,000,000!
              </h3>
            </div>
          </div>
        </ScratchCard>

        {won && (
          <p className="text-xl font-bold text-green-600 animate-bounce">
            ¡Felicidades!
          </p>
        )}
      </div>
    );
  },
};

// Revealing an archaic map
export const ArchaicMapReveal: Story = {
  render: () => {
    return (
      <div className="p-12 bg-neutral-950 flex flex-col items-center justify-center rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
        <h2 className="text-rose-500/80 font-serif text-xl mb-6 tracking-widest uppercase relative z-10">
          Despeja la ceniza
        </h2>

        <ScratchCard
          width={500}
          height={500}
          // Usamos un gris oscuro como 'ceniza'
          coverImage="#171717"
          brushSize={30}
          brushHardness={0.5} // Bordes suaves
          clearThreshold={0.7} // Requiere más esfuerzo para limpiar
          className="rounded-full shadow-2xl overflow-hidden ring-4 ring-rose-900/30"
        >
          {/* Un mapa viejo o un fractal debajo */}
          <img
            src="https://images.unsplash.com/photo-1584346893776-3b2d1c68e1ab?q=80&w=1000&auto=format&fit=crop"
            alt="Ancient Map"
            className="w-full h-full object-cover"
          />
        </ScratchCard>
      </div>
    );
  },
};

export const ControlExterno: Story = {
  render: () => {
    const cardRef = useRef<ScratchCardRef>(null);

    return (
      <div className="flex flex-col items-center gap-6 p-8 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
        <ScratchCard
          ref={cardRef}
          width={300}
          height={300}
          coverImage="#3b82f6" // blue-500
          brushSize={20}
          className="rounded-lg shadow-inner"
        >
          <div className="w-full h-full bg-white flex items-center justify-center">
            <span className="text-4xl">😎</span>
          </div>
        </ScratchCard>

        <div className="flex gap-4">
          <button
            onClick={() => cardRef.current?.reset()}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 font-medium transition-colors"
          >
            Resetear / Ocultar
          </button>
          <button
            onClick={() => cardRef.current?.clear()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-md transition-colors"
          >
            Revelar Todo Mágicamente
          </button>
        </div>
      </div>
    );
  },
};
