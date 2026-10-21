import type { Meta, StoryObj } from '@storybook/react';
import { AbyssParallax } from '../components/phenomena/AbyssParallax';

const meta = {
  title: 'Phenomena/AbyssParallax',
  component: AbyssParallax,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    layers: {
      description: 'Array de capas parallax. Cada capa tiene: content (ReactNode), speed (multiplicador Y), scale?, blur?, opacity?',
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-[#050302] text-[#eadbb6]">
        <div className="h-screen flex items-center justify-center border-b border-[#5c331d] font-serif text-3xl opacity-50">
          Haz scroll hacia el abismo (↓)
        </div>
        <Story />
        <div className="h-screen flex flex-col items-center justify-center border-t border-[#5c331d] font-mono opacity-50">
          <h3>EOF</h3>
          <p>Has escapado de las profundidades del Kernel.</p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof AbyssParallax>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DeepKernel: Story = {
  args: {
    layers: [
      {
        speed: 0.2,
        scale: 0.5,
        blur: 10,
        opacity: 0.1,
        content: <h1 className="text-[150px] font-bold text-[#402010]">ASSEMBLY</h1>,
      },
      {
        speed: 0.5,
        scale: 0.7,
        blur: 4,
        opacity: 0.3,
        content: <h1 className="text-[120px] font-bold text-[#603020]">C</h1>,
      },
      {
        speed: 1, // Base speed
        scale: 1,
        opacity: 0.8,
        content: (
          <div className="bg-[#21120a] p-12 border border-[#5c331d] rounded-xl shadow-2xl backdrop-blur-sm">
            <h2 className="text-4xl font-serif mb-4">La Capa Observable: RUST</h2>
            <p className="font-mono text-sm max-w-md">
              Cientos de abstracciones nos separan del silicio en combustión.
              El Frontend solo es la pintura en la corteza de la Tierra.
            </p>
          </div>
        ),
      },
      {
        speed: 2, // Moves much faster
        scale: 1.2,
        opacity: 1,
        content: <div className="text-8xl p-5 backdrop-blur-sm font-black text-[#5eead4] mix-blend-screen opacity-50 mt-96 blur-[1px]">REACT</div>,
      },
    ],
  },
};