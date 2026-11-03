import type { Meta, StoryObj } from "@storybook/react";
import { TarotSpreadGrid } from "../components/artifacts/TarotSpreadGrid";

const meta = {
  title: "Revelar/TarotSpreadGrid",
  component: TarotSpreadGrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Cartas que se reparten boca abajo y se voltean. El tarot nace en el norte de Italia hacia 1440, " +
          "la misma época del manuscrito. Aquí, cada carta es una de las secciones del Voynich.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    spreadType: { control: "select", options: ["fan", "cross", "grid"], description: "Tipo de distribución" },
  },
  decorators: [
    (Story) => (
      <div className="voy-leather min-h-screen py-20 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TarotSpreadGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Anverso al modo de los naipes del siglo XV: doble filete fino, numeral pequeño arriba y nombre abajo. */
const Numeral = ({ n, name }: { n: string; name: string }) => (
  <div className="absolute inset-3 flex flex-col items-center justify-between py-3 border border-voynich-inkMedium/40 outline outline-1 outline-offset-[3px] outline-voynich-inkMedium/25">
    <span className="font-display text-base tracking-[0.2em] text-voynich-inkDark/80">{n}</span>
    <span className="w-8 border-t border-voynich-inkMedium/40" />
    <span className="voy-label text-[10px] text-voynich-inkDark/70">{name}</span>
  </div>
);

const SECCIONES = [
  { id: "herbario", title: "El Herbario", description: "Plantas que ningún botánico ha sabido identificar.", frontImage: <Numeral n="I" name="Herbario" /> },
  { id: "astros", title: "Los Astros", description: "Círculos de estrellas y signos del zodiaco.", frontImage: <Numeral n="II" name="Astros" /> },
  { id: "banos", title: "Los Baños", description: "Figuras en piscinas unidas por tubos.", frontImage: <Numeral n="III" name="Baños" /> },
  { id: "recetas", title: "Las Recetas", description: "Párrafos breves, cada uno marcado con una estrella.", frontImage: <Numeral n="IV" name="Recetas" /> },
];

export const Abanico: Story = { args: { cards: SECCIONES, spreadType: "fan" } };

export const Cruz: Story = { args: { cards: SECCIONES, spreadType: "cross" } };

export const Rejilla: Story = { args: { cards: SECCIONES, spreadType: "grid" } };
