import type { Meta, StoryObj } from '@storybook/react';
import { InvisibleInkBlock } from '../components/artifacts/InvisibleInkBlock';

const meta = {
  title: 'Artifacts/InvisibleInkBlock',
  component: InvisibleInkBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-[#1b120c] p-20 flex text-center justify-center font-serif text-[#eadbb6] text-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InvisibleInkBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HoverReveal: Story = {
  args: {
    text: "La sangre del servidor fue derramada en Producción.",
    revealColor: "#ff4444",
    interaction: "hover",
  },
  decorators: [
    (Story) => (
      <p>
        Los registros antiguos dicen que aquel día, <Story /> Pero nadie quiso escuchar hasta que el caché estuvo lleno.
      </p>
    )
  ]
};

export const ClickReveal: Story = {
  args: {
    text: "Pasa el token por la función de hash.",
    revealColor: "#5eead4",
    interaction: "click",
  },
  decorators: [
    (Story) => (
      <p>
        Para entrar a la sala secreta debes: <Story /> (Haz click para revelar)
      </p>
    )
  ]
};