import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HomunculusVessel } from '../components/phenomena/HomunculusVessel';

const meta = {
  title: 'Phenomena/HomunculusVessel',
  component: HomunculusVessel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-[#050302] p-12 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HomunculusVessel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    progress: 45,
    label: 'Compilando...',
    loadingColor: '#00d2ff'
  },
};

export const BloodAlchemy: Story = {
  args: {
    progress: 88,
    label: 'Inyectando Mutación...',
    loadingColor: '#a02020'
  },
};

export const InteractiveProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return <HomunculusVessel progress={progress} label="Destilando Código..." loadingColor="#5eead4" />;
};