import React, { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HomunculusVessel } from '../components/phenomena/HomunculusVessel';
import type { HomunculusVesselRef } from '../components/phenomena/HomunculusVessel';

const meta = {
  title: 'Phenomena/HomunculusVessel',
  component: HomunculusVessel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Nivel del líquido (0–100%)' },
    label: { control: 'text', description: 'Etiqueta inferior del recipiente' },
    loadingColor: { control: 'color', description: 'Color del líquido alquímico' },
    glassColor: { control: 'color', description: 'Color del contorno del frasco' },
    corkColor: { control: 'color', description: 'Color del tapón' },
    bgColor: { control: 'color', description: 'Fondo interior del frasco' },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Tamaño del recipiente' },
    showCork: { control: 'boolean', description: 'Mostrar tapón' },
    showBubbles: { control: 'boolean', description: 'Activar burbujas' },
    waveAmplitude: { control: { type: 'range', min: 0, max: 8, step: 0.5 }, description: 'Amplitud de la onda' },
    waveSpeed: { control: { type: 'range', min: 1, max: 20, step: 0.5 }, description: 'Velocidad de la onda (s)' },
    showLabel: { control: 'boolean', description: 'Mostrar etiqueta' },
    showPercent: { control: 'boolean', description: 'Mostrar porcentaje' },
    bubbleRate: { control: { type: 'range', min: 50, max: 500, step: 10 }, description: 'Frecuencia de burbujas (ms)' },
    glowIntensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Intensidad del resplandor' },
  },
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
    loadingColor: '#00d2ff',
  },
};

export const BloodAlchemy: Story = {
  args: {
    progress: 70,
    label: 'Destilando esencia...',
    loadingColor: '#dc2626',
    glassColor: '#8b0000',
    corkColor: '#2a1010',
    showBubbles: true,
    waveAmplitude: 4,
    glowIntensity: 0.5,
  },
};

export const InteractiveProgress = () => {
  const [progress, setProgress] = useState(0);
  const vesselRef = useRef<HomunculusVesselRef>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <HomunculusVessel
        ref={vesselRef}
        progress={progress}
        label="Transmutando..."
        loadingColor="#5eead4"
        size="lg"
        onComplete={() => console.log('✦ Transmutación completa')}
        onEmpty={() => console.log('⊘ Recipiente vacío')}
      />
      <div className="flex gap-3">
        <button
          onClick={() => vesselRef.current?.pulse()}
          className="px-4 py-1.5 text-xs border border-[#5c331d] text-[#eadbb6] font-serif rounded"
        >
          ✦ Pulso
        </button>
        <button
          onClick={() => vesselRef.current?.reset()}
          className="px-4 py-1.5 text-xs border border-[#5c331d] text-[#eadbb6] font-serif rounded"
        >
          ⊘ Vaciar
        </button>
        <button
          onClick={() => vesselRef.current?.fill(100, 2)}
          className="px-4 py-1.5 text-xs border border-[#5c331d] text-[#eadbb6] font-serif rounded"
        >
          ▲ Llenar
        </button>
      </div>
    </div>
  );
};