import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfinementCircle } from '../components/rituals/ConfinementCircle';
import { Button } from '../components/rituals/Button';

const meta = {
  title: 'Rituals/ConfinementCircle',
  component: ConfinementCircle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-[#1b120c] p-20 rounded-xl w-[600px] h-[500px] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConfinementCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultInteractive = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Invocar Entidad (Modal)</Button>
      <ConfinementCircle 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          console.log("Asimilado");
          setIsOpen(false);
        }}
        title="Contrato Vinculante"
      >
        <p className="mb-4">
          Al aceptar este pacto, ofreces los recursos de tu navegador para mantener 
          esta ilusión. Cualquier caída de frames resultará en la corrupción de 
          tus variables de entorno.
        </p>
        <p className="opacity-50 text-xs">
          ¿Deseas romper el sello de seguridad de esta API?
        </p>
      </ConfinementCircle>
    </>
  );
};