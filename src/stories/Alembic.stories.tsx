import React, { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alembic } from '../components/phenomena/Alembic';
import type { AlembicRef } from '../components/phenomena/Alembic';
import { Button } from '../components/rituals/Button';

const meta = {
  title: 'Esperar/Alembic',
  component: Alembic,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Indicador de progreso: un matraz de alquimista que se llena. Es una barra de progreso accesible (`role="progressbar"`).' } },
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
  },
  decorators: [
    (Story) => (
      <div className="voy-panel p-12 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alembic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    progress: 45,
    label: 'Destilando…',
  },
};

export const InteractiveProgress = () => {
  const [progress, setProgress] = useState(0);
  const vesselRef = useRef<AlembicRef>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <Alembic
        ref={vesselRef}
        progress={progress}
        label="Destilando…"
        size="lg"
      />
      <div className="flex gap-3">
        <Button size="sm" variant="outline" onClick={() => vesselRef.current?.pulse()}>Agitar</Button>
        <Button size="sm" variant="outline" onClick={() => vesselRef.current?.reset()}>Vaciar</Button>
        <Button size="sm" variant="outline" onClick={() => vesselRef.current?.fill(100, 2)}>Llenar</Button>
      </div>
    </div>
  );
};