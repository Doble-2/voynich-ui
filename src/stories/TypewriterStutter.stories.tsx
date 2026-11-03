import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TypewriterStutter } from "../components/artifacts/TypewriterStutter";
import { Button } from "../components/rituals/Button";

const meta = {
  title: "Leer/TypewriterStutter",
  component: TypewriterStutter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Un escriba copiando: el texto aparece letra a letra, con algún error que se corrige al momento y algún " +
          "retroceso. El texto completo está siempre disponible para lectores de pantalla.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text", description: "Texto a copiar" },
    speed: { control: { type: "range", min: 20, max: 300, step: 10 }, description: "Velocidad (ms por letra)" },
    startDelay: { control: { type: "range", min: 0, max: 3000, step: 100 }, description: "Retraso inicial (ms)" },
    textColor: { control: "color", description: "Color de la tinta" },
    cursorColor: { control: "color", description: "Color de la pluma (por defecto, el de la tinta)" },
    showCursor: { control: "boolean", description: "Mostrar la pluma" },
    loop: { control: "boolean", description: "Repetir" },
    glitchRate: { control: { type: "range", min: 0, max: 0.5, step: 0.01 }, description: "Probabilidad de error por letra" },
  },
} satisfies Meta<typeof TypewriterStutter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Este libro fue datado por radiocarbono entre 1404 y 1438. Nadie ha sabido leerlo.",
    speed: 60,
  },
  render: (args) => (
    <div className="voy-paper max-w-xl mx-auto p-8 sm:p-10 text-xl text-voynich-inkDark">
      <TypewriterStutter {...args} />
    </div>
  ),
};

export const Transcripcion: Story = {
  args: {
    text: "…y el copista anotó en el margen: las hojas de la planta no corresponden a ninguna especie conocida. Los glifos del folio 68 permanecen sin descifrar.",
    speed: 80,
  },
  render: (args) => (
    <div className="voy-paper relative max-w-lg mx-auto p-8 sm:p-10">
      <div className="absolute top-3 right-4 text-xs italic text-voynich-inkMedium">folio 68r</div>
      <div className="text-lg leading-loose italic text-voynich-inkDark">
        <TypewriterStutter {...args} />
      </div>
    </div>
  ),
};

/** Cada pulsación añade una línea dictada al escriba. */
export const AlDictado = () => {
  const LINEAS = [
    "Ítem: una raíz como de nabo, con hojas anchas.",
    "Ítem: una flor azul de ocho pétalos.",
    "Ítem: no se halla en ningún herbario conocido.",
  ];
  const [n, setN] = useState(0);
  return (
    <div className="voy-paper max-w-lg mx-auto p-8 flex flex-col gap-5">
      <Button size="sm" className="self-start" disabled={n >= LINEAS.length} onClick={() => setN(n + 1)}>
        Dictar la siguiente
      </Button>
      <div className="flex flex-col gap-2 min-h-[6rem] text-voynich-inkDark">
        {n === 0 && <p className="italic text-voynich-inkMedium">El escriba espera.</p>}
        {LINEAS.slice(0, n).map((l) => (
          <TypewriterStutter key={l} text={l} speed={45} />
        ))}
      </div>
    </div>
  );
};
