import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/rituals/Button";
import React from "react";

const meta = {
  title: "Voynich UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Lore: El Sello de Cera (Wax Seal)**
Un botón en el ecosistema Voynich no es un simple rectángulo digital, es un trozo de vitela recocida con interacciones orgánicas. Su irregularidad (bordes "Vellum") demuestra que ha sido rasgado a mano, y sus colores se basan en tintas vegetales y minerales. Funciona como un sello de cera, aprobando transacciones arcanas o revelando códices.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"],
      description:
        "El arquetipo visual del botón. Primary simula vitela gruesa, Secondary es tinta densa.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Tamaño predefinido del botón.",
    },
    noAnimation: {
      control: "boolean",
      description: "Desactivar micro-animaciones GSAP (útil para contextos estáticos).",
    },
    borderRadius: {
      control: "text",
      description: 'Override del border-radius orgánico. Usa "none" para esquinas rectas.',
    },
    disabled: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div className="relative p-12 overflow-hidden flex items-center justify-center min-h-[200px] bg-[#f4e8d3]">
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#e0cda7_1px,transparent_1px)] [background-size:16px_16px] blur-[1px]"></div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Firmar Tratado",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Botón principal de alta jerarquía. Simula un trozo de pergamino iluminado.",
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Sellar en Tinta",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Acciones secundarias que simulan una masa de tinta densa y oscura, usada para ocultar texto marginal.",
      },
    },
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Invocación Sutil",
  },
  parameters: {
    docs: {
      description: {
        story: "Un mero trazo imperfecto de tinta de pluma.",
      },
    },
  },
};
