import type { Meta, StoryObj } from "@storybook/react";
import { ScratchCard, type ScratchCardRef } from "../components/artifacts/ScratchCard";
import { Button } from "../components/rituals/Button";
import { FOLIO_SRC } from "./assets/folio";
import { useRef, useState } from "react";

const meta = {
  title: "Revelar/ScratchCard",
  component: ScratchCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Una capa que se raspa con el cursor o el dedo para descubrir lo de debajo. Por defecto la capa es pan de oro. " +
          "Con teclado, el botón «Revelar contenido» (visible al enfocar) la retira de una vez.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    width: { control: { type: "range", min: 100, max: 600, step: 10 }, description: "Ancho máximo (px)" },
    height: { control: { type: "range", min: 100, max: 400, step: 10 }, description: "Alto a ese ancho (px)" },
    brushSize: { control: { type: "range", min: 5, max: 60, step: 1 }, description: "Tamaño del raspador (px)" },
    brushHardness: { control: { type: "range", min: 0, max: 1, step: 0.1 }, description: "Dureza del borde (0 = suave)" },
    clearThreshold: { control: { type: "range", min: 0.1, max: 1, step: 0.05 }, description: "Cuánto raspar antes de revelar todo" },
    coverImage: { control: "color", description: "Color o imagen de la capa" },
  },
} satisfies Meta<typeof ScratchCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Inscription = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full voy-paper flex items-center justify-center p-6 text-center">
    <p className="text-2xl italic text-voynich-inkDark">{children}</p>
  </div>
);

/** Bajo el pan de oro de una capital había una nota del iluminador. */
export const PanDeOro: Story = {
  render: () => {
    const [done, setDone] = useState(false);
    return (
      <div className="voy-paper p-6 sm:p-8 flex flex-col items-center gap-4">
        <p className="voy-label text-[11px] opacity-70">Raspa el oro</p>
        <ScratchCard width={400} height={200} brushSize={25} clearThreshold={0.5} onComplete={() => setDone(true)}>
          <Inscription>«Aquí va una A azul, no roja.»</Inscription>
        </ScratchCard>
        <p className="italic text-voynich-inkMedium min-h-[1.5em]">{done ? "Una instrucción del copista al iluminador." : ""}</p>
      </div>
    );
  },
};

/** Una capa de hollín sobre el folio: hay que limpiar bastante (`clearThreshold` alto) y el borde es suave. */
export const Hollin: Story = {
  render: () => (
    <div className="voy-panel p-6 sm:p-10 flex flex-col items-center gap-5">
      <p className="voy-label text-[11px] text-voynich-vellum/70">Despeja el hollín</p>
      <ScratchCard width={450} height={315} coverImage="rgb(28, 23, 16)" brushSize={30} brushHardness={0.5} clearThreshold={0.7}>
        <img src={FOLIO_SRC} alt="Folio de herbario" className="w-full h-full object-cover" />
      </ScratchCard>
    </div>
  ),
};

/** `clear()` y `reset()` permiten revelar u ocultar desde fuera. */
export const ControlExterno: Story = {
  render: () => {
    const ref = useRef<ScratchCardRef>(null);
    return (
      <div className="voy-paper p-6 sm:p-8 flex flex-col items-center gap-6">
        <ScratchCard ref={ref} width={300} height={300} brushSize={20}>
          <Inscription>Folio 116v: la última página, con unas líneas escritas por otra mano.</Inscription>
        </ScratchCard>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => ref.current?.reset()}>Volver a cubrir</Button>
          <Button size="sm" onClick={() => ref.current?.clear()}>Revelar todo</Button>
        </div>
      </div>
    );
  },
};
