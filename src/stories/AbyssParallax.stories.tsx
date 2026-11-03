import type { Meta, StoryObj } from '@storybook/react';
import { AbyssParallax } from '../components/phenomena/AbyssParallax';

const meta = {
  title: 'Ambiente/AbyssParallax',
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
      <div className="voy-leather text-voynich-vellum">
        <div className="h-screen flex items-center justify-center border-b border-voynich-inkMedium font-manuscript text-3xl opacity-50">
          Desplázate hacia abajo
        </div>
        <Story />
        <div className="h-screen flex flex-col items-center justify-center border-t border-voynich-inkMedium font-smallcaps opacity-50">
          <p>Fin del folio.</p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof AbyssParallax>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Capas a distinta velocidad: los folios de fondo se mueven despacio y el de delante, rápido. */
export const FoliosSuperpuestos: Story = {
  args: {
    layers: [
      {
        speed: 0.2,
        scale: 0.5,
        blur: 10,
        opacity: 0.1,
        content: <h1 className="text-[150px] font-display text-voynich-alchBrown">MCDIV</h1>,
      },
      {
        speed: 0.5,
        scale: 0.7,
        blur: 4,
        opacity: 0.3,
        content: <h1 className="text-[120px] font-display text-voynich-vermilion">ƒ 1r</h1>,
      },
      {
        speed: 1, // Base speed
        scale: 1,
        opacity: 0.8,
        content: (
          <div className="voy-panel p-12 border border-voynich-inkMedium rounded-xl shadow-2xl backdrop-blur-sm">
            <h2 className="text-4xl font-manuscript mb-4">Un códice, muchas manos</h2>
            <p className="text-lg max-w-md">
              Bajo el texto que lees hay otros: el del copista, el de quien lo corrigió y el de quien lo raspó para
              escribir encima.
            </p>
          </div>
        ),
      },
      {
        speed: 2, // Moves much faster
        scale: 1.2,
        opacity: 1,
        content: <div className="text-8xl p-5 font-display text-voynich-gold opacity-60 mt-96">✦</div>,
      },
    ],
  },
};