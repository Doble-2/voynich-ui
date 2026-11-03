import React, { useRef } from 'react';
import { Button } from '../components/rituals/Button';
import type { Meta, StoryObj } from '@storybook/react';
import { StrikeButton } from '../components/rituals/StrikeButton';
import type { StrikeButtonRef } from '../components/rituals/StrikeButton';

const meta = {
  title: 'Actuar/StrikeButton',
  component: StrikeButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Texto del botón' },
    sacrificedLabel: { control: 'text', description: 'Texto post-sacrificio' },
    bloodColor: { control: 'color', description: 'Color del efecto de sangre' },
    duration: { control: { type: 'range', min: 0.3, max: 5, step: 0.1 }, description: 'Duración del efecto (s)' },
    scrambleSpeed: { control: { type: 'range', min: 10, max: 100, step: 5 }, description: 'Velocidad del scramble (ms)' },
    scrambleDictionary: { control: 'text', description: 'Glifos custom para scramble' },
    resetable: { control: 'boolean', description: 'Permitir restaurar tras sacrificio' },
  },
} satisfies Meta<typeof StrikeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Firmar el folio',
    sacrificedLabel: 'Firmado',
  },
};

/** Una acción que no se deshace: la rúbrica sangra en el pergamino y el botón queda inutilizado. */
export const Irreversible: Story = {
  args: {
    label: 'Raspar el folio',
    sacrificedLabel: 'Raspado',
    bloodColor: 'rgba(163, 74, 51, 0.7)',
    duration: 2,
  },
};

export const Resetable: Story = {
  args: {
    label: 'Sellar la carta',
    sacrificedLabel: 'Sellada',
    resetable: true,
    bloodColor: 'rgba(90, 138, 118, 0.6)',
  },
};

export const ImperativeControl = () => {
  const buttonRef = useRef<StrikeButtonRef>(null);

  return (
    <div className="flex flex-col items-center gap-6">
      <StrikeButton
        ref={buttonRef}
        label="Tachar el renglón"
        sacrificedLabel="Tachado"
        bloodColor="rgba(47, 74, 122, 0.6)"
      />
      <div className="flex gap-3">
        <Button size="sm" variant="outline" onClick={() => buttonRef.current?.sacrifice()}>Tachar</Button>
        <Button size="sm" variant="outline" onClick={() => buttonRef.current?.reset()}>Restaurar</Button>
      </div>
    </div>
  );
};