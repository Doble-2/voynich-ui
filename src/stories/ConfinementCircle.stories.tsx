import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfinementCircle } from '../components/rituals/ConfinementCircle';
import { Button } from '../components/rituals/Button';

const meta = {
  title: 'Actuar/ConfinementCircle',
  component: ConfinementCircle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean', description: '¿Está abierto el círculo?' },
    title: { control: 'text', description: 'Título del diálogo' },
    dismissLabel: { control: 'text', description: 'Texto del botón de rechazo' },
    confirmLabel: { control: 'text', description: 'Texto del botón de confirmación' },
  },
  decorators: [
    (Story) => (
      <div className="voy-panel p-20 rounded-xl w-[600px] max-w-full h-[500px] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConfinementCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir el aviso</Button>
      <ConfinementCircle 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onConfirm={() => setIsOpen(false)}
        title="Antes de pasar la hoja"
        confirmLabel="Pasar la hoja"
        dismissLabel="Volver"
      >
        <p className="mb-4">
          El folio siguiente está muy dañado: al abrirlo, parte del pigmento puede desprenderse.
        </p>
        <p className="opacity-60 text-xs">¿Quieres continuar?</p>
      </ConfinementCircle>
    </>
  );
};