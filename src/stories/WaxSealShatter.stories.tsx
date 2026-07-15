import type { Meta, StoryObj } from '@storybook/react';
import { WaxSealShatter } from '../components/artifacts/WaxSealShatter';

const meta = {
  title: 'Artifacts/WaxSealShatter',
  component: WaxSealShatter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[500px] h-[500px] flex items-center justify-center bg-[#1b120c] p-12 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WaxSealShatter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RoyalRed: Story = {
  args: {
    revealText: 'Mantén presionado para romper el sello',
    sealColor: '#8b0000',
    children: (
      <div className="font-serif">
        <h3 className="text-xl font-bold border-b border-[#30180d]/20 pb-2 mb-4">Decreto de Merge</h3>
        <p className="opacity-80">
          Por el presente documento se certifica que los conflictos de git han sido resueltos mediante
          intervención manual. Cualquier divagación en la rama principal tras este acto será castigada 
          con la desmantelación del servidor.
        </p>
      </div>
    ),
  },
};

export const InquisitorBlack: Story = {
  args: {
    revealText: 'Romper para confesar secretos',
    sealColor: '#1a1a1a',
    children: (
      <div className="font-mono text-sm opacity-80">
        <p>API_KEY_EXPOSED=true</p>
        <p>DB_PASSWORD=0p3nS3sam3</p>
        <p className="mt-4 text-xs italic opacity-50">Rotar estas claves hoy tarde.</p>
      </div>
    ),
  },
};