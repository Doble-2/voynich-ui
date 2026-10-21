import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TypewriterStutter } from '../components/artifacts/TypewriterStutter';

const meta = {
  title: 'Artifacts/TypewriterStutter',
  component: TypewriterStutter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text', description: 'Texto a escribir' },
    speed: { control: { type: 'range', min: 20, max: 300, step: 10 }, description: 'Velocidad de escritura (ms)' },
    startDelay: { control: { type: 'range', min: 0, max: 3000, step: 100 }, description: 'Retraso inicial (ms)' },
    textColor: { control: 'color', description: 'Color del texto' },
    cursorColor: { control: 'color', description: 'Color del cursor (por defecto = textColor)' },
    showCursor: { control: 'boolean', description: 'Mostrar cursor parpadeante' },
    loop: { control: 'boolean', description: 'Repetir escritura en bucle' },
    glitchRate: { control: { type: 'range', min: 0, max: 0.5, step: 0.01 }, description: 'Probabilidad de glitch (0-1)' },
  },
} satisfies Meta<typeof TypewriterStutter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "INICIANDO INSERCIÓN... MÚLTIPLES VULNERABILIDADES DETECTADAS... REESCRIBIENDO HISTORIAL...",
    speed: 60,
    textColor: "#eadbb6"
  },
  render: (args) => (
    <div className="relative p-8 max-w-2xl mx-auto rounded border border-[#5c331d]/20"
      style={{ background: 'linear-gradient(170deg, #0d0905 0%, #1a120b 50%, #0d0905 100%)' }}
    >
      {/* Terminal scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded opacity-10"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(94,234,212,0.03) 2px, rgba(94,234,212,0.03) 4px)' }}
      />
      {/* Top status bar */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#5c331d]/20">
        <div className="w-2 h-2 rounded-full bg-[#5eead4] animate-pulse shadow-[0_0_6px_rgba(94,234,212,0.5)]" />
        <span className="text-[10px] font-mono text-[#5c331d] uppercase tracking-wider">terminal voynich — sesión activa</span>
      </div>
      <div className="pl-4 border-l-2 border-[#5eead4]/20">
        <span className="text-[10px] font-mono text-[#5eead4]/30 mr-2">{'>>'}</span>
        <TypewriterStutter {...args} />
      </div>
    </div>
  ),
};

export const CursedMessage: Story = {
  args: {
    text: "He leído tu código fuente. Está lleno de promesas que jamás se cumplirán.",
    speed: 100,
    textColor: "#dc2626"
  },
  render: (args) => (
    <div className="relative p-10 max-w-xl mx-auto text-center"
      style={{ background: 'radial-gradient(ellipse at center, rgba(139,0,0,0.08) 0%, transparent 70%)' }}
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-red-800/20 text-6xl select-none pointer-events-none">⚠</div>
      <div className="mt-12 font-serif text-lg leading-loose">
        <TypewriterStutter {...args} />
      </div>
      <div className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
    </div>
  ),
};

export const ManuscriptTranscription: Story = {
  args: {
    text: "...y el copista anotó en el margen: las hojas de la planta borrosa no corresponden a ninguna especie conocida. El pigmento utilizado emite un resplandor tenue bajo la luz lunar. Los glifos del folio 68 permanecen sin descifrar...",
    speed: 80,
    textColor: "#c4a97d"
  },
  render: (args) => (
    <div className="relative max-w-lg mx-auto p-10 border border-[#5c331d]/15"
      style={{ 
        background: 'linear-gradient(135deg, #1a140e 0%, #211a10 50%, #1a140e 100%)',
        borderRadius: '2px 12px 4px 8px',
      }}
    >
      <div className="absolute top-3 right-4 text-[8px] font-mono text-[#5c331d]/30 italic">folio XLVII r</div>
      <div className="font-serif text-base leading-loose italic"
        style={{ filter: 'sepia(0.3) contrast(1.1) brightness(0.95)' }}
      >
        <TypewriterStutter {...args} />
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="h-px flex-1 bg-gradient-to-r from-[#5c331d]/30 to-transparent" />
        <span className="px-3 text-[10px] text-[#5c331d]/40 font-serif">☽ Anno Domini MCDIV ☽</span>
        <div className="h-px flex-1 bg-gradient-to-l from-[#5c331d]/30 to-transparent" />
      </div>
    </div>
  ),
};

export const InteractiveTrigger = () => {
    const [msgs, setMsgs] = useState<string[]>([]);
    
    return (
      <div className="flex flex-col gap-6 max-w-lg mx-auto">
        <button 
          onClick={() => setMsgs([...msgs, "Comunicativo desde el Abismo (Petición HTTP completada) \n"])}
          className="self-start text-xs bg-[#21120a] border border-[#5c331d] px-5 py-2.5 text-[#eadbb6] font-serif uppercase tracking-wider hover:bg-[#30180d] hover:border-[#8b4a2a] transition-all duration-300"
          style={{ borderRadius: '40% 10% 80% 20% / 20% 60% 40% 90%' }}
        >
          ✦ Canalizar Mensaje
        </button>
        <div className="border-l-2 border-[#5c331d]/30 pl-5 flex flex-col gap-3 min-h-[60px]">
          {msgs.length === 0 && (
            <p className="text-xs text-[#5c331d]/30 italic font-serif">Esperando transmisión...</p>
          )}
          {msgs.map((m, i) => (
            <TypewriterStutter key={i} text={m} speed={40} textColor="#5eead4" />
          ))}
        </div>
      </div>
    );
  };