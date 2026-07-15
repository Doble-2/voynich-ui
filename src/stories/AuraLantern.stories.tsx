import type { Meta, StoryObj } from '@storybook/react';
import { AuraLantern } from '../components/phenomena/AuraLantern';

const meta = {
  title: 'Phenomena/AuraLantern',
  component: AuraLantern,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuraLantern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 200,
    children: (
      <div className="font-serif text-3xl">
        <p>No todo lo escrito puede ser leído bajo la luz del sol del Mediodía.</p>
        <p>Pasa el cursor por estos lares para encender la luz de tu conciencia.</p>
      </div>
    ),
    revealContent: (
      <div className="font-mono text-sm tracking-widest text-[#5eead4] mt-10 ml-20 drop-shadow-[0_0_5px_rgba(94,234,212,0.8)]">
        <p>{"function unlockTruth() {"}</p>
        <p>{"  return 'El verdadero sistema está escrito en CSS.';"}</p>
        <p>{"}"}</p>
      </div>
    ),
  },
};