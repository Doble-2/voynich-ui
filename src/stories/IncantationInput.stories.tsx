import type { Meta, StoryObj } from '@storybook/react';
import { IncantationInput } from '../components/rituals/IncantationInput';

const meta = {
  title: 'Rituals/IncantationInput',
  component: IncantationInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean', description: 'Estado de error' },
    placeholder: { control: 'text', description: 'Texto placeholder' },
    glowColor: { control: 'color', description: 'Color del resplandor al focus' },
    errorColor: { control: 'color', description: 'Color del borde de error' },
    sparkColor: { control: 'color', description: 'Color de las chispas' },
    textColor: { control: 'color', description: 'Color del texto' },
    bgColor: { control: 'color', description: 'Color de fondo' },
    label: { control: 'text', description: 'Etiqueta superior' },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] p-8 bg-[#0d0905] rounded-xl shadow-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IncantationInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Escribe el conjuro de búsqueda...',
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: 'Sintaxis inválida...',
    error: true,
  },
};