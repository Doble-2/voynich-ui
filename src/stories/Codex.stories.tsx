import type { Meta, StoryObj } from "@storybook/react";
import { Codex } from "../components/artifacts/Codex";
import { IlluminatedDropcap } from "../components/artifacts/IlluminatedDropcap";
import { FOLIO_SRC } from "./assets/folio";

const meta = {
  title: "Leer/Codex",
  component: Codex,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Lector de páginas. La hoja gira sobre el lomo al pasar de folio, y el canto de las hojas a cada lado crece o " +
          "mengua según lo leído y lo que falta. Se maneja con los botones, con ← → y deslizando el dedo.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Codex>;

export default meta;
type Story = StoryObj<typeof meta>;

const Texto = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="text-voynich-inkDark">
    <h3 className="font-display text-2xl mb-3">{title}</h3>
    <p className="text-lg leading-relaxed">{children}</p>
  </div>
);

const FOLIOS = [
  <img key="f" src={FOLIO_SRC} alt="Folio de herbario con una planta y renglones en EVA" className="w-full h-auto block" />,
  <Texto key="1" title="Sobre la planta">
    Raíz bulbosa, tallo recto, seis hojas lanceoladas y una flor de nueve pétalos. Ningún herbario de la época
    registra una especie así.
  </Texto>,
  <IlluminatedDropcap key="2" letter="E" text="l texto que acompaña al dibujo no se ha leído nunca. Algunos ven en él una lengua natural escrita con un alfabeto inventado; otros, un cifrado; otros, un engaño." />,
  <Texto key="3" title="Datación">El pergamino se fechó por radiocarbono entre 1404 y 1438.</Texto>,
  <Texto key="4" title="Hoy">Se conserva en la Biblioteca Beinecke de Yale con la signatura MS 408.</Texto>,
];

export const Default: Story = {
  args: { label: "Herbario", children: FOLIOS },
  render: (args) => (
    <div className="w-[560px] max-w-full px-3">
      <Codex {...args} />
    </div>
  ),
};

/** A mitad de lectura: el canto de la izquierda (lo leído) ya es tan grueso como el de la derecha. */
export const AMitad: Story = {
  args: { label: "Herbario", defaultPage: 2, children: FOLIOS },
  render: Default.render!,
};
