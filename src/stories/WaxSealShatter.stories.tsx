import type { Meta, StoryObj } from '@storybook/react';
import { WaxSealShatter } from '../components/artifacts/WaxSealShatter';

const meta = {
  title: 'Revelar/WaxSealShatter',
  component: WaxSealShatter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    revealText: { control: 'text', description: 'Texto bajo el sello' },
    sealColor: { control: 'color', description: 'Color del sello de cera' },
    sealSize: { control: { type: 'range', min: 48, max: 200, step: 4 }, description: 'Tamaño del sello (px)' },
    emblem: { control: 'text', description: 'Carácter del emblema central' },
    holdDuration: { control: { type: 'range', min: 0.3, max: 5, step: 0.1 }, description: 'Duración de presión para romper (s)' },
    particleCount: { control: { type: 'range', min: 5, max: 50, step: 1 }, description: 'Número de partículas' },
    shatterIntensity: { control: { type: 'range', min: 50, max: 400, step: 10 }, description: 'Intensidad de la explosión (px)' },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] max-w-full h-[500px] flex items-center justify-center voy-panel p-12 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WaxSealShatter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LacreRojo: Story = {
  args: {
    revealText: 'Mantén presionado para romper el sello',
    sealColor: '#8b0000',
    children: (
      <div className="font-manuscript">
        <h3 className="text-xl font-bold border-b border-voynich-inkDark/20 pb-2 mb-4">Carta de Marci a Kircher</h3>
        <p className="opacity-80">
          «Reverendo y distinguido señor, padre en Cristo: este libro, que me legó un amigo íntimo, lo destiné a vos
          en cuanto llegó a mis manos, convencido de que solo vos podríais leerlo.»
        </p>
      </div>
    ),
  },
};

export const LacreNegro: Story = {
  args: {
    revealText: 'Romper el sello del boticario',
    sealColor: '#1a1a1a',
    children: (
      <div className="font-manuscript text-sm opacity-80">
        <p>Tres partes de ruda, una de salvia.</p>
        <p>Macérese nueve días en vino blanco.</p>
        <p className="mt-4 text-xs italic opacity-60">No se dé a mujer encinta.</p>
      </div>
    ),
  },
};