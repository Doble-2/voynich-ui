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

const Numeral = ({ n }: { n: string }) => (
  <div className="absolute inset-4 border border-voynich-inkMedium/50 flex items-center justify-center">
    <span style={{ fontFamily: "var(--voynich-font-display)" }} className="text-5xl text-voynich-vermilion">
      {n}
    </span>
  </div>
);

const SECCIONES = [
  { id: "herbario", title: "El Herbario", description: "Plantas que ningún botánico ha sabido identificar.", frontImage: <Numeral n="I" /> },
  { id: "astros", title: "Los Astros", description: "Círculos de estrellas y signos del zodiaco.", frontImage: <Numeral n="II" /> },
  { id: "banos", title: "Los Baños", description: "Figuras en piscinas unidas por tubos.", frontImage: <Numeral n="III" /> },
  { id: "recetas", title: "Las Recetas", description: "Párrafos breves, cada uno marcado con una estrella.", frontImage: <Numeral n="IV" /> },
];

export const Abanico: Story = { args: { cards: SECCIONES, spreadType: "fan" } };

export const Cruz: Story = { args: { cards: SECCIONES, spreadType: "cross" } };

export const Rejilla: Story = { args: { cards: SECCIONES, spreadType: "grid" } };
