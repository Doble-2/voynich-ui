import type { Meta, StoryObj } from '@storybook/react';
import { FrequencyTuner } from '../components/rituals/FrequencyTuner';

const meta = {
  title: 'Rituals/FrequencyTuner',
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
      <div className="w-[300px] mt-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FrequencyTuner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    value: 30,
    step: 0.5,
  },
};

export const GhostFrequency: Story = {
  args: {
    min: 80,
    max: 120,
    value: 100, // Pre-tuned to default middle
    step: 0.1,
  },
};