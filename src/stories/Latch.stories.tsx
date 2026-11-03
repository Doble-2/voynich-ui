import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Latch } from "../components/rituals/Latch";

const meta = {
  title: "Actuar/Latch",
  component: Latch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Interruptor de sí/no: un pestillo de latón cuyo cerrojo corre por la ranura. Echado, el cerrojo pasa de " +
          "latón a pan de oro. Es un `<button role=\"switch\">`: funciona con Espacio y Enter.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean", description: "Estado (controlado)" },
    disabled: { control: "boolean", description: "Desactivado" },
  },
} satisfies Meta<typeof Latch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Mostrar la transcripción EVA" },
  render: (args) => (
    <div className="voy-paper px-8 py-6 text-voynich-inkDark">
      <Latch {...args} />
    </div>
  ),
};

/** Varios pestillos en un panel de cuero, como los cierres de un arcón. */
export const Preferencias = () => {
  const [state, setState] = useState({ eva: true, glosas: false, sonido: false });
  const set = (k: keyof typeof state) => (v: boolean) => setState((s) => ({ ...s, [k]: v }));
  return (
    <fieldset className="voy-leather px-8 py-6 flex flex-col gap-4 text-voynich-vellum border-0">
      <legend className="voy-label text-[11px] opacity-70 mb-2 float-left w-full">Ajustes de lectura</legend>
      <Latch checked={state.eva} onCheckedChange={set("eva")}>Transcripción EVA</Latch>
      <Latch checked={state.glosas} onCheckedChange={set("glosas")}>Glosas al margen</Latch>
      <Latch checked={state.sonido} onCheckedChange={set("sonido")} disabled>Sonido (no disponible)</Latch>
    </fieldset>
  );
};
