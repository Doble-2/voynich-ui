import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IlluminatedDropcap } from '../components/artifacts/IlluminatedDropcap';

const meta = {
  title: 'Artifacts/IlluminatedDropcap',
  component: IlluminatedDropcap,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    letter: { control: 'text', description: 'Letra capital iluminada' },
    text: { control: 'text', description: 'Texto del cuerpo' },
    letterColor: { control: 'color', description: 'Color de la letra' },
    borderColor: { control: 'color', description: 'Color del borde ornamental' },
    bgColor: { control: 'color', description: 'Color de fondo de la caja' },
    fontSize: { control: 'text', description: 'Tamaño de la letra (CSS)' },
    glowColor: { control: 'color', description: 'Color del resplandor' },
  },
} satisfies Meta<typeof IlluminatedDropcap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    letter: "E",
    text: "n el principio fue la Tinta, y la Tinta estaba sobre la Vitela, y la Tinta era el Glifo. Todo fue creado por medio de ella, y sin ella nada de lo encriptado fue encriptado. En ella estaba la Iluminación, y la Iluminación era la luz de los copistas.",
  },
  render: (args) => (
    <div className="max-w-lg mx-auto p-8 border border-[#5c331d]/10"
      style={{ 
        background: 'linear-gradient(180deg, #1a140e 0%, #15100a 100%)',
        borderRadius: '3px 8px 3px 6px',
      }}
    >
      <IlluminatedDropcap {...args} />
    </div>
  ),
};

export const GoldenFolio: Story = {
  args: {
    letter: "Ω",
    text: "mega, la última letra del alfabeto antiguo, marca el fin y el principio simultáneo. Los alquimistas la usaban para representar la Gran Obra completada, la transmutación final del plomo en oro, de lo mortal en eterno.",
  },
  render: (args) => (
    <div className="max-w-lg mx-auto p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800/30 to-transparent" />
        <span className="text-[9px] text-amber-700/40 font-serif uppercase tracking-[0.3em]">folio aureum</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800/30 to-transparent" />
      </div>
      <IlluminatedDropcap {...args} />
    </div>
  ),
};
