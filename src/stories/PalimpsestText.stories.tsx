import type { Meta, StoryObj } from "@storybook/react";
import { PalimpsestText } from "../components/artifacts/PalimpsestText";

const meta = {
  title: "Revelar/PalimpsestText",
  component: PalimpsestText,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Un palimpsesto es un pergamino raspado y vuelto a escribir. El texto de abajo nunca desaparece del todo: " +
          "este componente alterna entre la capa antigua y la nueva.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    ancientText: { control: "text", description: "Texto antiguo (capa inferior)" },
    translatedText: { control: "text", description: "Texto nuevo (capa superior)" },
    ancientColor: { control: "color", description: "Color del texto antiguo" },
    translatedColor: { control: "color", description: "Color del texto nuevo" },
    transitionSpeed: { control: { type: "range", min: 0.3, max: 5, step: 0.1 }, description: "Velocidad de transición (s)" },
    interaction: { control: "select", options: ["click", "hover"], description: "Modo de interacción" },
  },
  decorators: [
    (Story) => (
      <div className="voy-panel p-8 sm:p-24 rounded-lg shadow-inner max-w-2xl mx-auto mt-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PalimpsestText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** El caso real más famoso: el «Método» de Arquímedes, raspado en 1229 para copiar encima un libro de oraciones. */
export const PalimpsestoDeArquimedes: Story = {
  args: {
    ancientText: (
      <div className="font-manuscript italic text-xl w-[500px] max-w-full">
        Περὶ τῶν μηχανικῶν θεωρημάτων πρὸς Ἐρατοσθένη ἔφοδος
      </div>
    ),
    translatedText: (
      <div className="font-manuscript text-xl w-[500px] max-w-full">
        «El método de los teoremas mecánicos, para Eratóstenes»: copiado en el siglo X, raspado en 1229.
      </div>
    ),
  },
};

export const Glosa: Story = {
  args: {
    ancientText: (
      <div className="font-manuscript italic text-2xl text-justify w-[500px] max-w-full">
        «Ita ut sub divo lumen e mundo caecorum subreptum est.»
      </div>
    ),
    translatedText: (
      <div className="font-manuscript font-bold text-xl w-[500px] max-w-full">
        «Así como la luz es arrebatada del mundo de los ciegos.»
      </div>
    ),
  },
};
