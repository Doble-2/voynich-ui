import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/rituals/Button";
import { StrikeButton, type StrikeButtonRef } from "../components/rituals/StrikeButton";

const meta = {
  title: "Actuar/StrikeButton",
  component: StrikeButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Para acciones que no se deshacen. Al pulsarlo, un trazo de pluma tacha el rótulo, como el escriba anula un " +
          "renglón. Si das `struckLabel`, se escribe la corrección en su lugar; si no, el rótulo queda tachado.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Rótulo" },
    struckLabel: { control: "text", description: "Rótulo tras tachar (opcional)" },
    inkColor: { control: "color", description: "Color de la tinta del tachón" },
    duration: { control: { type: "range", min: 0.1, max: 2, step: 0.05 }, description: "Duración del trazo (s)" },
    resetable: { control: "boolean", description: "Permitir deshacer con otro clic" },
    sacrificedLabel: { table: { disable: true } },
    bloodColor: { table: { disable: true } },
    onSacrifice: { table: { disable: true } },
    scrambleDictionary: { table: { disable: true } },
    scrambleSpeed: { table: { disable: true } },
  },
} satisfies Meta<typeof StrikeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sin corrección: el renglón queda anulado. */
export const Default: Story = {
  args: { label: "Anular el renglón" },
};

/** Con corrección: la pluma tacha y escribe el nuevo rótulo. */
export const ConCorreccion: Story = {
  args: { label: "Firmar el folio", struckLabel: "Firmado" },
};

/** Tachón en rúbrica, la tinta roja de los copistas. */
export const Rubrica: Story = {
  args: { label: "Raspar el folio", struckLabel: "Raspado", inkColor: "rgb(var(--voynich-vermilion))" },
};

export const Resetable: Story = {
  args: { label: "Sellar la carta", struckLabel: "Sellada", resetable: true },
};

/** `strike()` y `reset()` desde fuera del componente. */
export const ControlImperativo = () => {
  const ref = useRef<StrikeButtonRef>(null);
  return (
    <div className="flex flex-col items-center gap-6">
      <StrikeButton ref={ref} label="Tachar el renglón" />
      <div className="flex gap-3">
        <Button size="sm" variant="outline" onClick={() => ref.current?.strike()}>Tachar</Button>
        <Button size="sm" variant="outline" onClick={() => ref.current?.reset()}>Restaurar</Button>
      </div>
    </div>
  );
};
