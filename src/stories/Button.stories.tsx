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
**Lore: El Taco de Imprenta**
Un botón en el ecosistema Voynich es un taco de imprenta entintado. El **pan de oro** (primary) es la acción principal, la **rúbrica** (secondary) es la tinta bermellón con que los copistas marcaban lo solemne y la **regla doble** (outline) solo señala el gesto. Al pulsar, el taco baja contra el papel. Respeta prefers-reduced-motion.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"],
      description:
        "El material del botón: latón (primary), lacre (secondary) o regla de escriba (outline).",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Tamaño predefinido del botón.",
    },
    motion: {
      control: "select",
      options: ["auto", "none"],
      description: "`auto` respeta prefers-reduced-motion; `none` fuerza un botón estático.",
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
      <div className="voy-paper relative p-12 overflow-hidden flex items-center justify-center min-h-[200px]">
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
          "Acción principal. Pan de oro plano con filete de tinta y hachura.",
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
          "Acción solemne o irreversible. Rúbrica: tinta bermellón de copista.",
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
        story: "Acción discreta. Doble regla de escriba sobre el pergamino.",
      },
    },
  },
};
