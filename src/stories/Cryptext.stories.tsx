import type { Meta, StoryObj } from "@storybook/react";
import { Cryptext, type CryptextRef } from "../components/artifacts/Cryptext";
import { useRef } from "react";
import React from "react";

const meta = {
  title: "Components/Cryptext",
  component: Cryptext,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Lore: Traducción Oculta - "Decodificador Alquímico"**
El texto manuscrito de Voynich requiere transliteración. Cryptext interviene este proceso aplicando símbolos alquímicos/astrológicos ciclándolos rápidamente antes de su traducción real. Su apariencia y contrastes se alinean al soporte de \`vitela\`, evitando el aspecto hacker genérico.
        `.trim(),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    text: { control: 'text', description: 'Texto final a revelar' },
    dictionary: { control: 'text', description: 'Glifos de encriptación' },
    speed: { control: { type: 'range', min: 10, max: 200, step: 5 }, description: 'Velocidad de mutación (ms)' },
    delay: { control: { type: 'range', min: 0, max: 3000, step: 100 }, description: 'Retraso antes de revelar (ms)' },
    resolvePerFrame: { control: { type: 'range', min: 1, max: 5, step: 1 }, description: 'Glifos resueltos por frame' },
    autoStart: { control: 'boolean', description: 'Iniciar automáticamente la animación' },
  },
  decorators: [
    (Story) => (
      <div className="relative p-12 overflow-hidden flex items-center justify-center min-h-[300px] bg-[#f4e8d3]">
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#e0cda7_1px,transparent_1px)] [background-size:16px_16px] blur-[1px]"></div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Cryptext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultHackerTerminal: Story = {
  args: {
    text: "MANUSCRIPT.DECRYPTED",
    speed: 55,
    delay: 600,
  },
  parameters: {
    docs: {
      description: {
        story: "Decodifica usando glifos astrológicos y runas (default).",
      },
    },
  },
  render: (args) => (
    <div className="p-8 bg-[#21120a] border border-[#5c331d]/30 rounded-[40%_10%_80%_20%/20%_60%_40%_90%] lg:w-[400px] shadow-[inset_0_0_10px_rgba(97,52,24,0.1),0_4px_12px_rgba(0,0,0,0.2)]">
      <div className="text-[#eadbb6] text-opacity-90 font-serif text-lg tracking-widest uppercase flex flex-col gap-2 filter contrast-[1.1] brightness-[0.95] sepia-[0.3]">
        <span>&gt; Aplicando solventes...</span>
        <span>&gt; Revelando tintas simpáticas...</span>
        <span className="text-[#8f5835] font-bold mt-4 font-mono">
          <Cryptext {...args} />
        </span>
      </div>
    </div>
  ),
};

export const RunasAlienigena: Story = {
  args: {
    text: "THE TRUTH IS IN THE ROOT",
    dictionary: "⍙⍣⍜⍨⍓⍝⍢⍟⍱⍲⍭⍡⍐⍗⍌⍚⍯ᚠᚢᚦᚩᚱᚳᚷᚹᚻᚾᛁᛄ",
    speed: 60,
    delay: 1500,
    resolvePerFrame: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Personalizando los glifos con un diccionario de símbolos paganos prolongando el retraso antes de la legibilidad.",
      },
    },
  },
  render: (args) => (
    <div className="p-16 bg-[#180d07] flex flex-col items-center justify-center rounded-[2rem] border border-[#5c331d]/20 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#0a0503] opacity-80" />
      <span className="relative z-10 text-4xl text-[#dfcda2] font-mono tracking-[0.3em] font-light max-w-xl text-center drop-shadow-[0_0_4px_rgba(223,205,162,0.4)] filter contrast-[1.2] brightness-[0.9] sepia-[0.3]">
        <Cryptext {...args} />
      </span>
    </div>
  ),
};

export const DecodificarHover: Story = {
  args: { text: "VOYNICH CODEX" },
  parameters: {
    docs: {
      description: {
        story:
          "Interactuando con Cryptext programáticamente mediante el uso de refs para disparar su animación onHover.",
      },
    },
  },
  render: () => {
    const cryptexRef = useRef<CryptextRef>(null);

    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-6">
        <p className="text-sm font-serif text-[#8f5835]">
          Pasa la vela (hover) para revelar
        </p>

        <button
          onMouseEnter={() => cryptexRef.current?.scramble()}
          className="px-8 py-4 bg-[#eadbb6] text-[#30180d] border border-[#5c331d]/40 rounded-[40%_10%_80%_20%/20%_60%_40%_90%] shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_0_15px_rgba(97,52,24,0.1)] hover:rotate-[0.5deg] active:scale-95 transition-all flex items-center gap-3 filter contrast-[1.1] brightness-[0.95] sepia-[0.3]"
        >
          <svg
            className="w-5 h-5 text-[#8f5835]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
          <Cryptext
            ref={cryptexRef}
            text="EXPEDIENTE 404"
            delay={0}
            speed={40}
            resolvePerFrame={2}
            className="font-bold tracking-widest font-mono"
            dictionary="☿♀♁♂♃♄♅♆♇"
          />
        </button>
      </div>
    );
  },
};
