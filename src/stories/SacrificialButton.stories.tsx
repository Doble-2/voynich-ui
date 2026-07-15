import type { Meta, StoryObj } from '@storybook/react';
import { SacrificialButton } from '../components/rituals/SacrificialButton';

const meta = {
  title: 'Rituals/SacrificialButton',
  component: SacrificialButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SacrificialButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Commit Changes',
    sacrificedLabel: 'Committed',
  },
};

export const DangerousAction: Story = {
  args: {
    label: 'Drop Database',
    sacrificedLabel: 'Obliterated',
  },
};