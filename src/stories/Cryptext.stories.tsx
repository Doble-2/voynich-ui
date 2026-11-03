import type { Meta, StoryObj } from "@storybook/react";
import { Cryptext, type CryptextRef } from "../components/artifacts/Cryptext";
import { Button } from "../components/rituals/Button";
import { useRef } from "react";

const meta = {
  title: "Descifrar/Cryptext",
  component: Cryptext,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "El texto aparece cifrado y se resuelve letra a letra, como un copista que transcribe un folio que aún no entiende. " +
          "Los lectores de pantalla leen siempre el texto claro.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text", description: "Texto final a revelar" },
    dictionary: { control: "text", description: "Glifos que se alternan antes de resolver" },
    speed: { control: { type: "range", min: 10, max: 200, step: 5 }, description: "Velocidad de mutación (ms)" },
    delay: { control: { type: "range", min: 0, max: 3000, step: 100 }, description: "Retraso antes de revelar (ms)" },
    resolvePerFrame: { control: { type: "range", min: 1, max: 5, step: 1 }, description: "Glifos resueltos por ciclo" },
    autoStart: { control: "boolean", description: "Iniciar al montar" },
  },
} satisfies Meta<typeof Cryptext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "Beinecke MS 408 · folio 1r", speed: 55, delay: 600 },
  render: (args) => (
    <div className="voy-paper px-10 py-8 text-center">
      <p className="voy-label text-[11px] opacity-60 mb-3">Signatura</p>
      <span className="text-2xl text-voynich-inkDark">
        <Cryptext {...args} />
      </span>
    </div>
  ),
};

/** El alfabeto EVA es el que usan los investigadores para transcribir los glifos del Voynich a letras latinas. */
export const TranscripcionEVA: Story = {
  args: {
    text: "fachys ykal ar ataiin shol shory",
    dictionary: "acdefhiklmnopqrsty",
    speed: 70,
    delay: 1200,
  },
  render: (args) => (
    <div className="voy-paper px-10 py-8 max-w-xl">
      <p className="voy-label text-[11px] opacity-60 mb-3">Primer renglón del folio 1r, en EVA</p>
      <span className="text-2xl italic text-voynich-inkDark">
        <Cryptext {...args} className="normal-case" />
      </span>
    </div>
  ),
};

/** `scramble()` vuelve a cifrar y resolver el texto: aquí, al pasar el cursor por el botón. */
export const AlPasarLaPluma: Story = {
  args: { text: "Rodolfo II · 600 ducados" },
  render: (args) => {
    const ref = useRef<CryptextRef>(null);
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="voy-label text-[11px] opacity-60">Pasa el cursor para volver a descifrar</p>
        <Button variant="outline" onMouseEnter={() => ref.current?.scramble()} onFocus={() => ref.current?.scramble()}>
          <Cryptext ref={ref} {...args} delay={0} speed={40} resolvePerFrame={2} dictionary="☿♀♁♂♃♄☉☽" />
        </Button>
      </div>
    );
  },
};
