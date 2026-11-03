import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SacrificialButton } from '../components/rituals/SacrificialButton';
import type { SacrificialButtonRef } from '../components/rituals/SacrificialButton';

const meta = {
  title: 'Rituals/SacrificialButton',
  component: SacrificialButton,
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
} satisfies Meta<typeof SacrificialButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Commit Changes',
    sacrificedLabel: 'Committed',
  },
};

export const DangerousAction: Story = {
  args: {
    label: 'Drop Database',
    sacrificedLabel: 'Obliterated',
    bloodColor: 'rgba(163, 74, 51, 0.7)',
    duration: 2,
  },
};

export const Resetable: Story = {
  args: {
    label: 'Deploy to Prod',
    sacrificedLabel: 'Deployed ✦',
    resetable: true,
    bloodColor: 'rgba(90, 138, 118, 0.6)',
  },
};

export const ImperativeControl = () => {
  const buttonRef = useRef<SacrificialButtonRef>(null);

  return (
    <div className="flex flex-col items-center gap-6">
      <SacrificialButton
        ref={buttonRef}
        label="Sacrifice Programmatically"
        sacrificedLabel="Done ☠"
        bloodColor="rgba(47, 74, 122, 0.6)"
      />
      <div className="flex gap-3">
        <button
          onClick={() => buttonRef.current?.sacrifice()}
          className="px-4 py-1.5 text-xs border border-voynich-inkMedium text-voynich-vellum font-manuscript rounded voy-panel"
        >
          ☠ Sacrificar
        </button>
        <button
          onClick={() => buttonRef.current?.reset()}
          className="px-4 py-1.5 text-xs border border-voynich-inkMedium text-voynich-vellum font-manuscript rounded voy-panel"
        >
          ↺ Restaurar
        </button>
      </div>
    </div>
  );
};