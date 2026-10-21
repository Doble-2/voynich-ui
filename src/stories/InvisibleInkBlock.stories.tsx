import type { Meta, StoryObj } from '@storybook/react';
import { InvisibleInkBlock } from '../components/artifacts/InvisibleInkBlock';

const meta = {
  title: 'Artifacts/InvisibleInkBlock',
  component: InvisibleInkBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text', description: 'Texto oculto' },
    revealColor: { control: 'color', description: 'Color de la tinta revelada' },
    interaction: { control: 'select', options: ['hover', 'click'], description: 'Modo de interacción' },
    revealed: { control: 'boolean', description: 'Control externo del estado revelado' },
    revealDuration: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 }, description: 'Duración de revelación (s)' },
    hideDuration: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 }, description: 'Duración de ocultamiento (s)' },
    blurAmount: { control: { type: 'range', min: 0, max: 20, step: 1 }, description: 'Intensidad del blur oculto (px)' },
  },
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