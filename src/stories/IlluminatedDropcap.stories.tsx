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
  decorators: [
    (Story) => (
      <div className="bg-[#050302] p-12 text-[#eadbb6] w-full max-w-2xl mx-auto rounded-lg shadow-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IlluminatedDropcap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    letter: "L",
    text: "orem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
};
