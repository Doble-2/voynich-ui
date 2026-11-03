import React, { useState, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OuroborosSpinner } from '../components/phenomena/OuroborosSpinner';
import type { OuroborosSpinnerRef } from '../components/phenomena/OuroborosSpinner';
import { Button } from '../components/rituals/Button';

const meta = {
  title: 'Esperar/OuroborosSpinner',
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
    isProcessing: true,
    label: 'Cotejando folios…',
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-6">
      <OuroborosSpinner {...args} />
      <p className="text-sm italic text-voynich-vellum/70">Cotejando folios…</p>
    </div>
  ),
};

export const ScaleVariations: Story = {
  args: {
    isProcessing: true,
  },
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-12">
      {[32, 48, 64, 96, 128].map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <OuroborosSpinner size={size} isProcessing />
          <span className="text-[10px] text-voynich-inkMedium font-smallcaps">{size}px</span>
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
        onCycleComplete={() => setCycles((c) => c + 1)}
      />
      <p className="text-xs text-voynich-vellum/50 font-smallcaps">Vueltas completas: {cycles}</p>
      <div className="flex gap-3">
        <Button size="sm" variant="outline" onClick={() => spinnerRef.current?.start()}>Girar</Button>
        <Button size="sm" variant="outline" onClick={() => spinnerRef.current?.stop()}>Detener</Button>
        <Button size="sm" variant="outline" onClick={() => spinnerRef.current?.toggle()}>Alternar</Button>
      </div>
    </div>
  );
};
