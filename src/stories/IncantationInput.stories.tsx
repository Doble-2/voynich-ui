import type { Meta, StoryObj } from '@storybook/react';
import { IncantationInput } from '../components/rituals/IncantationInput';

const meta = {
  title: 'Rituals/IncantationInput',
  component: IncantationInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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