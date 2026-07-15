import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TypewriterStutter } from '../components/artifacts/TypewriterStutter';

const meta = {
  title: 'Artifacts/TypewriterStutter',
  component: TypewriterStutter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-[#050302] p-12 text-[#eadbb6] w-full max-w-2xl mx-auto rounded-lg shadow-2xl h-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TypewriterStutter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "INICIANDO INSERCIÓN... MÚLTIPLES VULNERABILIDADES DETECTADAS... REESCRIBIENDO HISTORIAL...",
    speed: 60,
    textColor: "#eadbb6"
  },
};

export const CursedMessage: Story = {
  args: {
    text: "He leído tu código fuente. Está lleno de promesas que jamás se cumplirán.",
    speed: 100,
    textColor: "#ff4444"
  },
};

export const InteractiveTrigger = () => {
    const [msgs, setMsgs] = useState<string[]>([]);
    
    return (
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setMsgs([...msgs, "Comunicativo desde el Abismo (Petición HTTP completada) \n"])}
          className="text-xs bg-[#21120a] border border-[#5c331d] px-4 py-2 w-fit text-[#eadbb6]"
        >
          Canalizar Mensaje
        </button>
        <div className="border-l-2 border-[#5c331d] pl-4 flex flex-col gap-2">
            {msgs.map((m, i) => (
              <TypewriterStutter key={i} text={m} speed={40} textColor="#5eead4" />
            ))}
        </div>
      </div>
    );
  };