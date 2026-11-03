import type { Meta, StoryObj } from '@storybook/react';
import { AuraLantern } from '../components/phenomena/AuraLantern';

const meta = {
  title: 'Revelar/AuraLantern',
  component: AuraLantern,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 50, max: 400, step: 10 }, description: 'Diámetro de la linterna reveladora (px)' },
    glowColor: { control: 'color', description: 'Color del resplandor' },
    followSpeed: { control: { type: 'range', min: 0.01, max: 1, step: 0.01 }, description: 'Velocidad de seguimiento (s)' },
    intensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Intensidad del brillo' },
    bgColor: { control: 'color', description: 'Color de fondo' },
  },
} satisfies Meta<typeof AuraLantern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 200,
    className: "min-h-[260px]",
    children: (
      <div className="font-manuscript text-2xl sm:text-3xl">
        <p>La receta parece completa a la luz del día.</p>
        <p>Acerca la vela al margen.</p>
      </div>
    ),
    revealContent: (
      <div className="font-manuscript italic text-lg mt-24">
        <p>«…y añádase una dracma de sal de la piedra que el boticario guarda bajo llave.»</p>
      </div>
    ),
  },
};