import type { Meta, StoryObj } from "@storybook/react";
import { RadialMenu, type RadialMenuItem } from "../components/rituals/RadialMenu";

const meta = {
  title: "Components/RadialMenu",
  component: RadialMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    radius: { control: { type: 'range', min: 20, max: 120, step: 5 }, description: 'Radio de dispersión (px)' },
  },
} satisfies Meta<typeof RadialMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Icons placeholders
const StarIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);
const GemIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);
const MoonIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);
const SunIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);
const EyeIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const MYSTIC_ITEMS: RadialMenuItem[] = [
  { id: "1", icon: <StarIcon />, label: "Astros" },
  { id: "2", icon: <MoonIcon />, label: "Lunar" },
  { id: "3", icon: <SunIcon />, label: "Solar" },
  { id: "4", icon: <GemIcon />, label: "Reliquia" },
  { id: "5", icon: <EyeIcon />, label: "Ojo" },
];

export const FullCircleMenu: Story = {
  args: {
    items: MYSTIC_ITEMS,
    radius: 120,
    startAngle: 0,
    endAngle: 360, // Círculo completo
    staggerDelay: 50, // Animación rápida en cadena
  },
  render: (args) => (
    <div className="h-[400px] w-[400px] flex items-center justify-center p-8 bg-zinc-900 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)] mix-blend-screen" />
      <RadialMenu {...args} />
    </div>
  ),
};

export const HalfMoonArc: Story = {
  args: {
    items: MYSTIC_ITEMS,
    staggerDelay: 100,
    icon: "☾", // Icono de luna para el botón central
    //arc: 180, // Limitar el arco a 180 grados para que forme una media luna y no se superpongan los botones
  },
  render: (args) => (
    <div className="h-[300px] w-[500px] flex items-end justify-center pb-12 bg-indigo-950 rounded-b-none rounded-t-[1000px] border-t border-indigo-500/30">
      <RadialMenu
        {...args}
        buttonClassName="bg-indigo-600 text-indigo-50 border-indigo-400/50 hover:bg-indigo-500 hover:scale-110 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
      />
    </div>
  ),
};

export const MonoculoOculto: Story = {
  args: {
    items: MYSTIC_ITEMS.slice(0, 3), // Solo 3 items
    radius: 80,
    startAngle: 90,

    staggerDelay: 80,
  },
  render: (args) => (
    <div className="h-[300px] w-[300px] relative border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
      {/* Posicionado en la esquina superior izquierda (Absolute context) */}
      <RadialMenu
        {...args}
        className="absolute top-8 left-8"
        buttonClassName="w-10 h-10 bg-slate-800 text-slate-100 hover:bg-slate-700 shadow-xl"
      />
    </div>
  ),
};
