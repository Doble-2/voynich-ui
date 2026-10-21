import type { Meta, StoryObj } from '@storybook/react';
import { TarotSpreadGrid } from '../components/artifacts/TarotSpreadGrid';

const meta = {
  title: 'Artifacts/TarotSpreadGrid',
  component: TarotSpreadGrid,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    spreadType: { control: 'select', options: ['fan', 'cross', 'grid'], description: 'Tipo de distribución' },
  },
  decorators: [
    (Story) => (
      <div className="bg-[#0a0604] min-h-screen py-20 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TarotSpreadGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_CARDS = [
  { id: '1', title: 'The Docker', description: 'El contenedor aísla tus pecados del mundo.', frontImage: <div className="absolute inset-4 border-2 border-dashed border-[#5c331d] flex items-center justify-center font-bold text-4xl opacity-50">🐳</div> },
  { id: '2', title: 'The Typescript', description: 'Ataduras y contratos fuertes que aseguran tu camino al Cielo compilar.', frontImage: <div className="absolute inset-4 border-2 border-dotted border-[#5c331d] flex items-center justify-center font-bold text-4xl opacity-50">TS</div> },
  { id: '3', title: 'The CI/CD', description: 'La rueda eterna de integración rompe toda inmutabilidad.', frontImage: <div className="absolute inset-4 border-4 rounded-full border-[#5c331d] flex items-center justify-center font-bold text-4xl opacity-50">⚙️</div> },
  { id: '4', title: 'The Legacy Code', description: 'Espíritus del pasado que aún acechan y tiran abajo el performance.', frontImage: <div className="absolute inset-4 border-2 bg-[#30180d] border-[#5c331d] flex items-center justify-center font-bold text-4xl">👻</div> },
];

export const FanSpread: Story = {
  args: {
    cards: DEMO_CARDS,
    spreadType: 'fan',
  },
};

export const CelticCross: Story = {
  args: {
    cards: DEMO_CARDS,
    spreadType: 'cross',
  },
};

export const GridInventory: Story = {
  args: {
    cards: DEMO_CARDS,
    spreadType: 'grid',
  },
};