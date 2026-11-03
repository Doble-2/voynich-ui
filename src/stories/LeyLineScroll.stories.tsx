import type { Meta, StoryObj } from '@storybook/react';
import { LeyLineScroll } from '../components/phenomena/LeyLineScroll';

const meta = {
  title: 'Ambiente/LeyLineScroll',
  component: LeyLineScroll,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color', description: 'Color de la línea base' },
    glowColor: { control: 'color', description: 'Color del resplandor activo' },
    strokeWidth: { control: { type: 'range', min: 1, max: 8, step: 0.5 }, description: 'Grosor del trazo (px)' },
  },
  decorators: [
    (Story) => (
      <div className="voy-leather flex relative min-h-screen text-voynich-vellum p-10 font-manuscript">
        <div className="flex-1 space-y-96 pl-24 pt-48 pb-[100vh]">
          <h1 className="text-6xl font-bold">Capítulo I: El Origen</h1>
          <p className="text-xl max-w-xl opacity-70">
            En 1912, el librero Wilfrid Voynich compró el manuscrito en una villa jesuita cerca de Roma.
            Sigue la línea hacia abajo.
          </p>
          <div className="h-96" />
          <h2 className="text-4xl font-bold text-voynich-gold">Capítulo II: Las manos</h2>
          <p className="text-xl max-w-xl opacity-70">
            Antes pasó por Praga: por el alquimista Georg Baresch, por Marci y, según la carta de este, por la
            corte del emperador Rodolfo II.
          </p>
          <div className="h-96" />
          <h2 className="text-4xl font-bold text-voynich-vermilion">Capítulo III: Beinecke MS 408</h2>
          <p className="text-xl max-w-xl opacity-70">
            Desde 1969 está en la Biblioteca Beinecke de Yale. Sigue sin leerse.
          </p>
        </div>
        <div className="w-1/3 pt-10 sticky top-0 h-screen overflow-hidden">
           <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof LeyLineScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

// The component tracks window scroll via ScrollTrigger automatically
export const Default: Story = {
  args: {
    height: '100%',
    color: '#30180d',
    glowColor: '#eadbb6',
    strokeWidth: 3,
  },
};