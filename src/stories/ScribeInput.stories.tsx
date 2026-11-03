import type { Meta, StoryObj } from '@storybook/react';
import { ScribeInput } from '../components/rituals/ScribeInput';

const meta = {
  title: 'Descifrar/ScribeInput',
  component: ScribeInput,
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
      <div className="w-[400px] max-w-full p-8 voy-panel rounded-xl shadow-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScribeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Busca una palabra en EVA…',
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: 'Esa palabra no aparece en el folio',
    error: true,
  },
};