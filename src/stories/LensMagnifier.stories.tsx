import type { Meta, StoryObj } from "@storybook/react";
import {
  LensMagnifier,
  type LensMagnifierRef,
} from "../components/phenomena/LensMagnifier";
import { useRef } from "react";

const meta = {
  title: "Components/LensMagnifier",
  component: LensMagnifier,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    zoomLevel: { control: { type: 'range', min: 1, max: 6, step: 0.5 }, description: 'Nivel de zoom' },
    lensSize: { control: { type: 'range', min: 50, max: 400, step: 10 }, description: 'Tamaño de la lente (px)' },
    lensBorder: { control: { type: 'range', min: 0, max: 12, step: 1 }, description: 'Grosor del borde' },
    lensShape: { control: 'select', options: ['circle', 'square', 'rounded-square'], description: 'Forma de la lente' },
    filter: { control: 'select', options: ['none', 'sepia', 'grayscale', 'invert', 'vintage', 'x-ray'], description: 'Filtro visual' },
    showHandle: { control: 'boolean', description: 'Mostrar mango de lupa' },
    smoothFollowing: { control: 'boolean', description: 'Seguimiento suave del cursor' },
  },
} satisfies Meta<typeof LensMagnifier>;

export default meta;
type Story = StoryObj<typeof meta>;

// Usando una imagen confiable e impactante de Unsplash sobre manuscritos/libros antiguos.
// Evitamos Wikimedia/Wikipedia para no sufrir de hotlinking o CORS rotos en localhost.
const MANUSCRIPT_URL =
  "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop";

export const InspectionMode: Story = {
  args: {
    src: MANUSCRIPT_URL,
    zoomLevel: 2,
    lensSize: 180,
    lensBorder: 2,
    smoothFollowing: true,
  },
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-3xl">
      <h3 className="text-xl font-bold font-manuscript">
        Inspecciona el manuscrito
      </h3>
      <p className="text-voynich-vellum/60">
        Pasa el ratón sobre la imagen para revelar los detalles ocultos.
      </p>

      <div className="p-2 voy-paper rounded shadow-xl inline-block border border-voynich-inkMedium/40">
        <LensMagnifier {...args} className="w-[600px] max-w-full h-[400px] rounded-sm" />
      </div>
    </div>
  ),
};

export const DeepMicroscope: Story = {
  args: {
    src: MANUSCRIPT_URL,
    zoomLevel: 5, // Enorme
    lensSize: 120, // Pequeño y concentrado
    smoothFollowing: false, // Inmediato sin spring (sentimiento de máquina/hardware)
  },
  render: (args) => (
    <div className="flex flex-col gap-4 p-8 voy-panel text-voynich-vellum rounded relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-rose-500 to-voynich-vermilion" />
      <h3 className="text-sm font-smallcaps text-voynich-vermilion tracking-widest uppercase">
        &gt;&gt;&gt; MICRO_SCAN_LENS_ACTVO
      </h3>

      <div className="border-4 border-voynich-inkMedium/40 p-1 relative group">
        {/* Reticulo simulado */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity">
          <div className="w-full h-[1px] bg-voynich-vermilion/20 absolute" />
          <div className="h-full w-[1px] bg-voynich-vermilion/20 absolute" />
          <div className="w-16 h-16 border border-voynich-brass/40 rounded-full" />
        </div>

        <LensMagnifier
          {...args}
          className="w-[400px] max-w-full h-[400px] bg-black filter contrast-125 "
        />
      </div>
    </div>
  ),
};

export const ManualResetMode: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1524169358666-79f22534bc6e?q=80&w=1000&auto=format&fit=crop",
  },
  render: () => {
    const lensRef = useRef<LensMagnifierRef>(null);

    return (
      <div className="flex flex-col gap-6 items-center">
        <button
          onClick={() => lensRef.current?.resetZoom()}
          className="px-4 py-2 bg-emerald-600 text-voynich-vellum rounded shadow hover:bg-emerald-700"
        >
          Esconder Lente Temporalmente
        </button>

        <LensMagnifier
          ref={lensRef}
          src="https://images.unsplash.com/photo-1524169358666-79f22534bc6e?q=80&w=1000&auto=format&fit=crop"
          zoomLevel={2.5}
          lensSize={200}
          className="w-[500px] max-w-full h-[300px] rounded-lg shadow-2xl"
        />
      </div>
    );
  },
};

export const ClassicDetective: Story = {
  args: {
    src: MANUSCRIPT_URL,
    zoomLevel: 2.2,
    lensSize: 180,
    lensBorder: 8,
    lensShape: "circle",
    filter: "vintage",
    showHandle: true,
    lensColor: "border-[#5c3a21]", // Color madera pura para el contorno
    smoothFollowing: true,
  },
  render: (args) => (
    <div
      className="p-8 voy-paper rounded-xl shadow-inner border border-voynich-brass/40"
      style={{
        backgroundImage: "radial-gradient(#d4c4b7 1px, transparent 0)",
        backgroundSize: "20px 20px",
      }}
    >
      <h3 className="text-2xl font-manuscript text-[#5c3a21] mb-6 border-b-2 border-voynich-brass/40 pb-2 inline-block">
        El Lente de Holmes
      </h3>
      <p className="text-voynich-vermilion mb-4 font-manuscript italic text-sm">
        Una vista sepia cálida con marco circular clásico y mango integrado,
        revelando escritos del pasado.
      </p>
      <div className="p-3 voy-paper rounded shadow-xl border border-voynich-brass/40">
        <LensMagnifier {...args} className="w-[600px] max-w-full h-[400px] rounded-sm" />
      </div>
    </div>
  ),
};

export const SciFiScanner: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1524169358666-79f22534bc6e?q=80&w=1000&auto=format&fit=crop",
    zoomLevel: 4,
    lensSize: 220,
    lensBorder: 3,
    lensShape: "rounded-square",
    filter: "x-ray",
    showHandle: false,
    lensColor: "border-voynich-glow shadow-[0_0_20px_rgba(34,211,238,0.5)]",
    smoothFollowing: false, // Sin spring (sentimiento de hardware digital directo)
  },
  render: (args) => (
    <div className="p-8 voy-panel rounded-3xl relative overflow-hidden border border-voynich-inkMedium/40 shadow-2xl">
      <h3 className="text-voynich-glow font-smallcaps text-sm mb-4 tracking-[0.25em] animate-pulse flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        [X-RAY_SCANNER_ONLINE]
      </h3>
      <div className="relative">
        <LensMagnifier
          {...args}
          className="w-[600px] max-w-full h-[350px] rounded opacity-80"
        />
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_2px,#000_4px)]"></div>
      </div>
    </div>
  ),
};

export const TruthRevealer: Story = {
  args: {
    src: MANUSCRIPT_URL,
    zoomLevel: 1.5,
    lensSize: 300,
    lensBorder: 10,
    lensShape: "square",
    filter: "invert",
    showHandle: false,
    lensColor: "border-white",
  },
  render: (args) => (
    <div className="flex flex-col gap-3 items-center bg-black p-8 rounded-lg outline outline-1 outline-white/10">
      <p className="text-voynich-vellum/30 tracking-[0.5em] text-xs font-smallcaps">
        REVELACIÓN NEGATIVA CON LENTE CUADRADO
      </p>
      <LensMagnifier
        {...args}
        className="w-[600px] max-w-full h-[350px] rounded-md saturate-0"
      />
    </div>
  ),
};
