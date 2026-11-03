import type { Meta, StoryObj } from '@storybook/react';
import { FrequencyTuner } from '../components/rituals/FrequencyTuner';

const meta = {
  title: 'Descifrar/FrequencyTuner',
  component: FrequencyTuner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: { control: { type: 'number' }, description: 'Valor mínimo' },
    max: { control: { type: 'number' }, description: 'Valor máximo' },
    step: { control: { type: 'number' }, description: 'Incremento' },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Valor actual' },
  },
  decorators: [
    (Story) => (
      <div className="w-[300px] max-w-full mt-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FrequencyTuner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** La alidada de un astrolabio: gira hasta la altura de la estrella (52°) y queda sintonizada. */
export const Default: Story = {
  args: {
    min: 0,
    max: 90,
    value: 30,
    step: 0.5,
    tunedValue: 52,
    unit: "°",
    "aria-label": "Altura de la estrella",
  },
};

/** Escala estrecha con paso fino: hay que buscar la marca con cuidado. */
export const AjusteFino: Story = {
  args: {
    min: 80,
    max: 120,
    value: 96,
    step: 0.1,
    tunedValue: 100.4,
    unit: "°",
  },
};