import type { Meta, StoryObj } from '@storybook/react';
import { InvisibleInkBlock } from '../components/artifacts/InvisibleInkBlock';

const meta = {
  title: 'Revelar/InvisibleInkBlock',
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
      <div className="voy-panel p-20 flex text-center justify-center font-manuscript text-voynich-vellum text-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InvisibleInkBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HoverReveal: Story = {
  args: {
    text: "el libro pasó a manos del emperador Rodolfo",
    revealColor: "#8b4a2a",
    interaction: "hover",
  },
  decorators: [
    (Story) => (
      <p>
        Según la carta de Marci, <Story />, que pagó por él una suma considerable.
      </p>
    )
  ]
};

export const ClickReveal: Story = {
  args: {
    text: "busca la tercera planta del folio 9.",
    revealColor: "#a34a33",
    interaction: "click",
  },
  decorators: [
    (Story) => (
      <p>
        La tinta de limón solo aparece con calor. La nota dice: <Story /> (haz clic para calentarla)
      </p>
    )
  ]
};