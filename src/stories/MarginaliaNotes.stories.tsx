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
  argTypes: {
    note: { control: 'text', description: 'Texto de la anotación marginal' },
    noteColor: { control: 'color', description: 'Color del texto de la nota' },
    noteBgColor: { control: 'color', description: 'Color de fondo de la nota' },
    noteBorderColor: { control: 'color', description: 'Color del borde de la nota' },
    trigger: { control: 'select', options: ['hover', 'click'], description: 'Modo de activación' },
  },
} satisfies Meta<typeof MarginaliaNotes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    note: "Nota del copista: No probar sin supervisión de un iniciado de 3er grado.",
    children: "esta sección ha sido alterada",
  },
  render: () => (
    <div className="max-w-2xl mx-auto font-serif text-base leading-loose text-[#eadbb6]/70 p-8"
      style={{ filter: 'sepia(0.1) contrast(1.05)' }}
    >
      <p>
        Los textos del manuscrito contienen múltiples referencias a procesos herbales
        que los investigadores modernos no han podido identificar. Una teoría sugiere que{' '}
        <MarginaliaNotes note="Nota del copista: No probar sin supervisión de un iniciado de 3er grado.">
          esta sección ha sido alterada
        </MarginaliaNotes>{' '}
        por un escriba posterior, posiblemente durante el siglo XV.
      </p>
      <p className="mt-4">
        El {' '}
        <MarginaliaNotes note="Cf. Folio 68r, sección de astrología. Los círculos concéntricos podrían representar órbitas planetarias.">
          diagrama circular del folio 68
        </MarginaliaNotes>{' '}
        presenta una complejidad inusual para la época, y su relación con la
        {' '}
        <MarginaliaNotes note="⚠ Roger Bacon (1214-1292) fue propuesto como autor, pero el análisis de carbono-14 descarta esta atribución.">
          autoría propuesta
        </MarginaliaNotes>{' '}
        sigue siendo objeto de intenso debate académico.
      </p>
    </div>
  ),
};

export const DenseAnnotation: Story = {
  args: {
    note: "Anotación marginal",
    children: "texto anotado",
  },
  render: () => (
    <div className="max-w-xl mx-auto font-serif text-sm leading-loose text-[#eadbb6]/60 p-8 border-l-2 border-[#5c331d]/20 ml-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-[#5c331d]/15" />
        <span className="text-[8px] text-[#5c331d]/30 uppercase tracking-[0.4em]">marginalia densa</span>
        <div className="h-px flex-1 bg-[#5c331d]/15" />
      </div>
      <p>
        Cada {' '}
        <MarginaliaNotes note="Los glifos del Voynich no corresponden a ningún sistema de escritura conocido. Se han identificado ~170.000 caracteres distribuidos en ~35 'letras' distintas.">
          glifo individual
        </MarginaliaNotes>{' '}
        ha sido catalogado, pero la {' '}
        <MarginaliaNotes note="Shannon entropy ≈ 10 bits por palabra. Comparable al latín y al inglés antiguo. No es aleatorio.">
          entropía del texto
        </MarginaliaNotes>{' '}
        sugiere estructura lingüística real, no cifrado arbitrario.
        La {' '}
        <MarginaliaNotes note="Ley de Zipf: la frecuencia de la n-ésima palabra más común es proporcional a 1/n. El texto del Voynich la cumple.">
          distribución de frecuencias
        </MarginaliaNotes>{' '}
        cumple con las leyes estadísticas de los idiomas naturales.
      </p>
    </div>
  ),
};
