import React, { useState, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OuroborosSpinner } from '../components/phenomena/OuroborosSpinner';
import type { OuroborosSpinnerRef } from '../components/phenomena/OuroborosSpinner';

const meta = {
  title: 'Phenomena/OuroborosSpinner',
  component: OuroborosSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 32, max: 256, step: 8 }, description: 'Diámetro de la serpiente (px)' },
    loadingColor: { control: 'color', description: 'Color de la serpiente' },
    isProcessing: { control: 'boolean', description: 'Activa/desactiva la rotación' },
    trackColor: { control: 'color', description: 'Color de la pista base' },
    glowIntensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Intensidad del resplandor' },
    speed: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 }, description: 'Duración de una rotación (s)' },
    showScales: { control: 'boolean', description: 'Mostrar escamas' },
    showEye: { control: 'boolean', description: 'Mostrar ojo' },
    eyeColor: { control: 'color', description: 'Color del ojo' },
    strokeWidth: { control: { type: 'range', min: 1, max: 8, step: 0.5 }, description: 'Grosor del cuerpo' },
  },
} satisfies Meta<typeof OuroborosSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 80,
    loadingColor: '#5eead4',
    isProcessing: true,
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xs font-serif text-[#eadbb6]/40 uppercase tracking-[0.3em]">Procesando Ritual...</p>
      <OuroborosSpinner {...args} />
      <p className="text-[10px] text-[#5c331d] font-mono animate-pulse">
        ⟲ INVOCANDO ENTIDADES REMOTAS
      </p>
    </div>
  ),
};

export const BloodRitual: Story = {
  args: {
    size: 120,
    loadingColor: '#dc2626',
    isProcessing: true,
    trackColor: '#1a0505',
    glowIntensity: 0.8,
    speed: 4,
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-8 p-8 border border-red-900/30 rounded-full w-64 h-64 justify-center"
      style={{ background: 'radial-gradient(circle, #1a0505 0%, #0d0905 100%)' }}
    >
      <OuroborosSpinner {...args} />
      <p className="text-xs font-serif text-red-400/60 text-center italic">
        «El ouroboros devora su propia cola, <br/>consumando el ciclo eterno»
      </p>
    </div>
  ),
};

export const ScaleVariations: Story = {
  args: {
    isProcessing: true,
  },
  render: () => (
    <div className="flex items-end gap-12">
      {[32, 48, 64, 96, 128].map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <OuroborosSpinner size={size} isProcessing loadingColor="#5eead4" />
          <span className="text-[10px] text-[#5c331d] font-mono">{size}px</span>
        </div>
      ))}
    </div>
  ),
};

export const ImperativeControl = () => {
  const spinnerRef = useRef<OuroborosSpinnerRef>(null);
  const [cycles, setCycles] = useState(0);

  return (
    <div className="flex flex-col items-center gap-8">
      <OuroborosSpinner
        ref={spinnerRef}
        size={100}
        isProcessing
        loadingColor="#5eead4"
        onCycleComplete={() => setCycles((c) => c + 1)}
      />
      <p className="text-xs text-[#eadbb6]/50 font-mono">Ciclos completados: {cycles}</p>
      <div className="flex gap-3">
        <button
          onClick={() => spinnerRef.current?.start()}
          className="px-4 py-1.5 text-xs border border-[#5c331d] text-[#eadbb6] font-serif rounded"
        >
          ▶ Start
        </button>
        <button
          onClick={() => spinnerRef.current?.stop()}
          className="px-4 py-1.5 text-xs border border-[#5c331d] text-[#eadbb6] font-serif rounded"
        >
          ⏸ Stop
        </button>
        <button
          onClick={() => spinnerRef.current?.toggle()}
          className="px-4 py-1.5 text-xs border border-[#5c331d] text-[#eadbb6] font-serif rounded"
        >
          ⟲ Toggle
        </button>
      </div>
    </div>
  );
};
