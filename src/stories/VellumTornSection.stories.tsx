import type { Meta, StoryObj } from "@storybook/react";
import { VellumTornSection } from "../components/phenomena/VellumTornSection";

const meta = {
  title: "Leer/VellumTornSection",
  component: VellumTornSection,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Una sección de pergamino con los bordes rasgados a mano. El borde es determinista (`seed`), así que es " +
          "igual en el servidor y en el cliente.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    topTorn: { control: "boolean", description: "Rasgar el borde superior" },
    bottomTorn: { control: "boolean", description: "Rasgar el borde inferior" },
    tearIntensity: { control: { type: "range", min: 0, max: 40, step: 1 }, description: "Profundidad del rasgado (px)" },
    seed: { control: { type: "range", min: 0, max: 100, step: 1 }, description: "Semilla del borde" },
  },
} satisfies Meta<typeof VellumTornSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tearIntensity: 15, seed: 7 },
  render: (args) => (
    <div className="max-w-2xl mx-auto py-10">
      <VellumTornSection {...args} className="px-8 sm:px-12 py-12">
        <h2 className="text-3xl font-display mb-4">Un trozo arrancado</h2>
        <p className="text-lg leading-relaxed">
          Faltan folios en el manuscrito: la numeración salta y algunos cuadernillos están incompletos. Lo que se
          perdió, se perdió antes de que nadie supiera leerlo.
        </p>
      </VellumTornSection>
    </div>
  ),
};

/** Solo el borde inferior rasgado: un encabezado que continúa en la página. */
export const SoloAbajo: Story = {
  args: { topTorn: false, bottomTorn: true, tearIntensity: 22, seed: 31 },
  render: (args) => (
    <div className="max-w-2xl mx-auto py-10">
      <VellumTornSection {...args} className="px-8 sm:px-12 py-10">
        <p className="voy-label text-[11px] opacity-70">Cuadernillo VIII</p>
        <h2 className="text-3xl font-display mt-2">Sección astronómica</h2>
      </VellumTornSection>
    </div>
  ),
};
