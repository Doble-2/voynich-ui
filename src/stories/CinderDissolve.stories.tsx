import type { Meta, StoryObj } from "@storybook/react";
import { CinderDissolve } from "../components/phenomena/CinderDissolve";

const meta = {
  title: "Revelar/CinderDissolve",
  component: CinderDissolve,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    docs: {
      description: {
        component:
          "Un folio que se quema: el borde avanza, la fibra se perfora y suelta ceniza. Sirve para destruir una pista " +
          "tras leerla, o para revelar lo que hay debajo. Usa el modo `burn`; el modo `evaporate` produce un efecto " +
          "digital que va contra el lenguaje de diseño y se retirará.",
      },
    },
  },
  args: { animate: true, duration: 5.5, loop: true, mode: "burn" },
  tags: ["autodocs"],
  argTypes: {
    progress: { control: { type: "range", min: 0, max: 1, step: 0.01 }, description: "Progreso de la combustión (0–1)" },
    animate: { control: "boolean", description: "Animación automática" },
    paused: { control: "boolean", description: "Pausar" },
    pauseAt: { control: { type: "range", min: 0, max: 1, step: 0.01 }, description: "Detenerse en un punto" },
    duration: { control: { type: "range", min: 1, max: 20, step: 0.5 }, description: "Duración (s)" },
    loop: { control: "boolean", description: "Repetir" },
    origin: { control: "select", options: ["top", "right", "bottom", "left"], description: "Por dónde empieza a arder" },
    mode: { table: { disable: true } },
    edgeWidth: { control: { type: "range", min: 0.05, max: 0.35, step: 0.01 }, description: "Ancho del borde encendido" },
    distortion: { control: { type: "range", min: 0, max: 60, step: 1 }, description: "Irregularidad del borde" },
    turbulence: { control: { type: "range", min: 0.005, max: 0.05, step: 0.001 }, description: "Turbulencia" },
    particleCount: { control: { type: "range", min: 0, max: 30, step: 1 }, description: "Ceniza" },
    flameVariant: { control: "select", options: ["front", "particles"], description: "Frente continuo o brasas sueltas" },
    burnPattern: { control: "select", options: ["center", "edge"], description: "Desde el centro o desde el borde" },
    glowColor: { control: "color", description: "Color del borde encendido" },
    emberColor: { control: "color", description: "Color de las brasas" },
    smokeColor: { control: "color", description: "Color del humo" },
    pointAmount: { control: { type: "range", min: 8, max: 60, step: 1 }, description: "Perforaciones" },
    burnSeed: { control: { type: "range", min: 0, max: 100, step: 1 }, description: "Semilla" },
  },
} satisfies Meta<typeof CinderDissolve>;

export default meta;
type Story = StoryObj<typeof meta>;

const Folio = ({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) => (
  <article className="voy-paper px-8 sm:px-10 py-10 text-voynich-inkDark">
    <p className="voy-label text-[11px] opacity-70">{kicker}</p>
    <h2 className="mt-3 text-4xl font-display">{title}</h2>
    <p className="mt-5 max-w-[40ch] text-lg leading-8">{children}</p>
  </article>
);

export const Default: Story = {
  args: { origin: "bottom", edgeWidth: 0.22, distortion: 20, turbulence: 0.02, flameVariant: "front", burnPattern: "center", pointAmount: 34, burnSeed: 17, duration: 4.8 },
  render: (args) => (
    <CinderDissolve {...args} className="w-[540px] max-w-full">
      <Folio kicker="Carta de Marci a Kircher, 1665" title="Léase y quémese">
        Os envío el libro que me legó mi amigo. Fue comprado por el emperador Rodolfo, según me contaron, por
        seiscientos ducados.
      </Folio>
    </CinderDissolve>
  ),
};

/** Brasas sueltas en lugar de un frente continuo, empezando por el borde. */
export const Brasas: Story = {
  args: { origin: "left", edgeWidth: 0.17, distortion: 21, turbulence: 0.024, particleCount: 18, flameVariant: "particles", burnPattern: "edge", pointAmount: 26, burnSeed: 7 },
  render: (args) => (
    <CinderDissolve {...args} className="w-[540px] max-w-full">
      <Folio kicker="Folio 86v" title="El mapa de las rosetas">
        La mayor hoja desplegable del códice: nueve círculos unidos por caminos y un castillo en una esquina.
      </Folio>
    </CinderDissolve>
  ),
};

/** `pauseAt` congela el fuego en un punto: un folio que sobrevivió a medias. */
export const QuemadoAMedias: Story = {
  args: { origin: "right", pauseAt: 0.63, paused: true, edgeWidth: 0.2, distortion: 18, turbulence: 0.02, particleCount: 14, flameVariant: "front", burnPattern: "center", pointAmount: 44, burnSeed: 25 },
  render: (args) => (
    <CinderDissolve {...args} className="w-[540px] max-w-full">
      <Folio kicker="Fragmento recuperado" title="Lo que no ardió">
        De la receta solo se conserva el principio: tómese la raíz en luna menguante, déjese secar a la sombra y…
      </Folio>
    </CinderDissolve>
  ),
};

/** Sin animación: el progreso lo controla quien usa el componente (un scroll, un temporizador…). */
export const ProgresoControlado: Story = {
  args: { animate: false, progress: 0.45, origin: "top", edgeWidth: 0.18, distortion: 14, turbulence: 0.015, particleCount: 9 },
  render: (args) => (
    <CinderDissolve {...args} className="w-[540px] max-w-full">
      <Folio kicker="Mueve el control «progress»" title="Al ritmo que tú marques">
        El borde se detiene donde lo dejes; útil para ligar la combustión al avance del lector.
      </Folio>
    </CinderDissolve>
  ),
};
