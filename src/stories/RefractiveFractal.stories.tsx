import type { Meta, StoryObj } from "@storybook/react";
import { RefractiveFractal } from "../components/phenomena/RefractiveFractal";

const meta = {
  title: "Ambiente/RefractiveFractal",
  component: RefractiveFractal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Deforma lo que envuelve con ruido orgánico. Su uso en esta librería es el **desgaste del pergamino**: " +
          "tinta que se corre con la humedad y manchas que crecen en la fibra. Con valores extremos produce efectos " +
          "digitales (glitch, líquido) que van contra el lenguaje de diseño; evita esos rangos.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    complexity: { control: { type: "range", min: 1, max: 10, step: 1 }, description: "Octavas del ruido (1 = suave, 10 = rugoso)" },
    refractionFactor: { control: { type: "range", min: 0, max: 40, step: 1 }, description: "Fuerza de la deformación" },
    frequency: { control: { type: "range", min: 0.005, max: 0.2, step: 0.005 }, description: "Escala del ruido" },
    seed: { control: { type: "range", min: 0, max: 100, step: 1 }, description: "Semilla del patrón" },
    animate: { control: "boolean", description: "Que la mancha avance lentamente" },
    speed: { control: { type: "range", min: 5, max: 40, step: 1 }, description: "Duración del ciclo (s)" },
    isDisturbed: { control: "boolean", description: "Forzar la deformación máxima" },
  },
} satisfies Meta<typeof RefractiveFractal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Poca deformación y ruido muy fino: el borde de cada letra se come, como tinta absorbida por papel húmedo. */
export const TintaCorrida: Story = {
  args: { complexity: 10, refractionFactor: 5, frequency: 0.15, seed: 123, animate: false },
  render: (args) => (
    <div className="voy-paper p-8 sm:p-14 w-[460px] max-w-full">
      <RefractiveFractal {...args}>
        <h2 className="text-4xl text-voynich-inkDark mb-4" style={{ fontFamily: "var(--voynich-font-display)" }}>
          De herbis
        </h2>
        <p className="text-lg text-voynich-inkDark leading-relaxed text-justify">
          Esta raíz se recoge en luna menguante y se deja secar a la sombra. Su jugo, mezclado con vino, alivia el
          dolor de cabeza; pero el copista advierte que la planta del dibujo no se parece a ninguna conocida.
        </p>
      </RefractiveFractal>
    </div>
  ),
};

/** Una mancha de humedad bajo el texto: la mancha se deforma; el texto queda intacto encima. */
export const ManchaDeHumedad: Story = {
  args: { complexity: 6, refractionFactor: 30, frequency: 0.015, animate: true, speed: 20 },
  render: (args) => (
    <div className="voy-paper relative w-[460px] max-w-full h-[340px] overflow-hidden flex items-center justify-center p-10">
      <RefractiveFractal
        {...args}
        className="absolute right-[-40px] bottom-[-40px] w-[260px] h-[260px] rounded-full blur-[14px]"
        style={{ background: "rgb(var(--voynich-alch-brown) / 0.35)" }}
      />
      <p className="relative text-lg text-voynich-inkDark leading-relaxed italic">
        «El agua entró por la esquina inferior y se llevó la mitad de la receta; lo que queda dice: tres partes de
        ruda, una de…»
      </p>
    </div>
  ),
};
