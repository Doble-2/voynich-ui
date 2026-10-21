import type { Meta, StoryObj } from '@storybook/react';
import { PalimpsestText } from '../components/artifacts/PalimpsestText';

const meta = {
  title: 'Artifacts/PalimpsestText',
  component: PalimpsestText,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    ancientText: { control: 'text', description: 'Texto antiguo (capa inferior)' },
    translatedText: { control: 'text', description: 'Texto traducido (capa superior)' },
    ancientColor: { control: 'color', description: 'Color del texto antiguo' },
    translatedColor: { control: 'color', description: 'Color del texto traducido' },
    transitionSpeed: { control: { type: 'range', min: 0.3, max: 5, step: 0.1 }, description: 'Velocidad de transición (s)' },
    interaction: { control: 'select', options: ['click', 'hover'], description: 'Modo de interacción' },
  },
  decorators: [
    (Story) => (
      <div className="bg-[#1b120c] p-24 rounded-lg shadow-inner max-w-2xl mx-auto mt-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PalimpsestText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CodeTranslation: Story = {
  args: {
    ancientText: (
      <div>
        <p className="mb-2 w-[400px]">char *str = malloc(sizeof(char) * 10);</p>
        <p className="mb-2">strcpy(str, "Alquimia");</p>
        <p>free(str);</p>
      </div>
    ),
    translatedText: (
      <div>
        <p className="mb-2 font-mono drop-shadow-[0_0_5px_#eadbb6] w-[400px]">
          const str: string = "Alquimia";
        </p>
        <p className="opacity-50 text-sm italic">
          // La gestión manual de memoria se disuelve al amanecer.
        </p>
      </div>
    ),
  },
};

export const LoreText: Story = {
  args: {
    ancientText: (
      <div className="font-serif italic text-2xl text-justify w-[500px]">
        "Ita ut sub divo lumen e mundo caecorum subreptum est."
      </div>
    ),
    translatedText: (
      <div className="font-serif font-bold text-xl text-[#5eead4] w-[500px]">
        "Así como la luz es arrebatada del mundo de los ciegos."
      </div>
    ),
  },
};