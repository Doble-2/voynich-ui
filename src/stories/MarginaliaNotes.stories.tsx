import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MarginaliaNotes } from '../components/artifacts/MarginaliaNotes';

const meta = {
  title: 'Artifacts/MarginaliaNotes',
  component: MarginaliaNotes,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-[#050302] p-24 text-[#eadbb6] w-full max-w-2xl mx-auto rounded-lg shadow-2xl h-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MarginaliaNotes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="leading-loose">
        <p>
            El texto principal describe el ritual. Sin embargo, hay un detalle importante que considerar... {' '}
            <MarginaliaNotes note="Nota del copista: No probar sin supervisión de un iniciado de 3er grado.">
                esta sección ha sido alterada
            </MarginaliaNotes>
            {' '} por un autor posterior.
        </p>
    </div>
  )
};
