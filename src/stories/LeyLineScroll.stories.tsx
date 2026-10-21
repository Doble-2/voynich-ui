import type { Meta, StoryObj } from '@storybook/react';
import { LeyLineScroll } from '../components/phenomena/LeyLineScroll';

const meta = {
  title: 'Phenomena/LeyLineScroll',
  component: LeyLineScroll,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color', description: 'Color de la línea base' },
    glowColor: { control: 'color', description: 'Color del resplandor activo' },
    strokeWidth: { control: { type: 'range', min: 1, max: 8, step: 0.5 }, description: 'Grosor del trazo (px)' },
  },
  decorators: [
    (Story) => (
      <div className="bg-[#050302] flex relative min-h-screen text-[#eadbb6] p-10 font-serif">
        <div className="flex-1 space-y-96 pl-24 pt-48 pb-[100vh]">
          <h1 className="text-6xl font-bold">Capítulo I: El Origen</h1>
          <p className="text-xl max-w-xl opacity-70">
            Nuestros ancestros no escribían código, escribían constelaciones de silicio.
            Sigue la línea dorada hacia abajo para iniciar el compilador estelar.
          </p>
          <div className="h-96" />
          <h2 className="text-4xl font-bold text-[#5eead4]">Nodo 2: Recursividad</h2>
          <p className="text-xl max-w-xl opacity-70">
            Todo aquello que desciende debe volver a llamarse a sí mismo hasta que
            los recursos de memoria quiebren o la lógica encuentre su salvación en
            la condición base.
          </p>
          <div className="h-96" />
          <h2 className="text-4xl font-bold text-[#a02020]">El Final del Stack</h2>
          <p className="text-xl max-w-xl opacity-70">
            Has vaciado el buffer.
          </p>
        </div>
        <div className="w-1/3 pt-10 sticky top-0 h-screen overflow-hidden">
           <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof LeyLineScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

// The component tracks window scroll via ScrollTrigger automatically
export const Default: Story = {
  args: {
    height: '100%',
    color: '#30180d',
    glowColor: '#eadbb6',
    strokeWidth: 3,
  },
};