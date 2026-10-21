import type { Meta, StoryObj } from "@storybook/react";
import { CinderDissolve } from "../components/phenomena/CinderDissolve";
import { useEffect, useState } from "react";

const meta = {
  title: "Effects/CinderDissolve",
  component: CinderDissolve,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    docs: {
      description: {
        component: `
**Lore: Origen del Glifo - "El Pergamino Ignis"**
En los registros perdidos del Códice, los alquimistas debían destruir pruebas botánicas compromeditas antes de ser detectadas. *CinderDissolve* recrea las reacciones exótermicas de vitelas encriptadas interactuando con su entorno, ya sea a nivel atómico en un vacío, o quemándose por componentes biológicos en contacto con el aire.

## Arquitectura Voynich
- **Geometría de lo Imperfecto:** Los bordes base reaccionan simétricamente mediante un recorte tipo mask-image que varía por los inputs.
- **Filtros de Tinta:** La iluminación del componente posee una base de opacidad (sepia/contrast/brightness) dándole a su tipografía aspecto de carbón.
- **Arquetipo Vellum Container:** Efectos orgánicos aplicados a un contenedor delimitado para representar la desaparición asimétrica o el revelado de lo oculto en el tiempo.
        `.trim(),
      },
    },
  },
  args: {
    animate: true,
    duration: 5.5,
    loop: true,
  },
  tags: ["autodocs"],
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 }, description: 'Progreso de combustión (0–1)' },
    animate: { control: 'boolean', description: 'Activar animación automática' },
    paused: { control: 'boolean', description: 'Pausar la animación' },
    pauseAt: { control: { type: 'range', min: 0, max: 1, step: 0.01 }, description: 'Detener en progreso específico' },
    duration: { control: { type: 'range', min: 1, max: 20, step: 0.5 }, description: 'Duración del ciclo (s)' },
    loop: { control: 'boolean', description: 'Repetir en bucle' },
    origin: { control: 'select', options: ['top', 'right', 'bottom', 'left'], description: 'Dirección del efecto' },
    mode: { control: 'select', options: ['burn', 'evaporate'], description: 'Modo visual' },
    edgeWidth: { control: { type: 'range', min: 0.05, max: 0.35, step: 0.01 }, description: 'Ancho del borde' },
    distortion: { control: { type: 'range', min: 0, max: 60, step: 1 }, description: 'Distorsión orgánica' },
    turbulence: { control: { type: 'range', min: 0.005, max: 0.05, step: 0.001 }, description: 'Turbulencia del ruido' },
    particleCount: { control: { type: 'range', min: 0, max: 30, step: 1 }, description: 'Cantidad de partículas' },
    flameVariant: { control: 'select', options: ['front', 'particles'], description: 'Variante de llama' },
    burnPattern: { control: 'select', options: ['center', 'edge'], description: 'Patrón de quemado' },
    glowColor: { control: 'color', description: 'Color del resplandor' },
    emberColor: { control: 'color', description: 'Color de las brasas' },
    smokeColor: { control: 'color', description: 'Color del humo' },
    pointAmount: { control: { type: 'range', min: 8, max: 60, step: 1 }, description: 'Puntos de perforación' },
    burnSeed: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Semilla aleatoria' },
  },
  decorators: [
    (Story) => (
      <div className="relative p-12 overflow-hidden flex items-center justify-center min-h-[400px]">
        {/* Decorador de textura de pergamino de fondo */}
        <div className="pointer-events-none absolute inset-0 bg-[#f4e8d3] opacity-20 bg-[radial-gradient(#e0cda7_1px,transparent_1px)] [background-size:16px_16px] blur-[1px]"></div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CinderDissolve>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ManuscritoConsumido: Story = {
  args: {
    mode: "burn",
    origin: "bottom",
    edgeWidth: 0.22,
    distortion: 20,
    turbulence: 0.02,
    flameVariant: "front",
    burnPattern: "center",
    pointAmount: 34,
    burnSeed: 17,

    duration: 4.8,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Recrea un papiro antiguo siendo destruido, emitiendo humo y distorsión. El pergamino conserva una firma mineral y las marcas de una combustión lenta.",
      },
    },
  },
  render: (args) => (
    <div className="relative w-[560px] overflow-hidden rounded-[2rem] border border-[#5c331d] bg-[radial-gradient(circle_at_top,_#6f4122,_#21120a_58%,_#120906_100%)] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,_rgba(255,222,157,0.2),_transparent_24%),radial-gradient(circle_at_72%_88%,_rgba(255,98,36,0.16),_transparent_20%),linear-gradient(180deg,rgba(255,173,92,0.06),transparent_34%,rgba(19,8,5,0.44)_100%)]" />
      <CinderDissolve {...args} className="rounded-[1.5rem]">
        <article className="relative overflow-hidden rounded-[1.5rem] border border-amber-900/50 bg-[#eadbb6] px-10 py-12 text-[#30180d] shadow-[inset_0_0_40px_rgba(97,52,24,0.2),0_18px_45px_rgba(0,0,0,0.18)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_35%,_rgba(95,55,28,0.18)_120%)] mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(57,25,12,0),rgba(57,25,12,0.16)_45%,rgba(28,10,5,0.34)_100%)]" />
          <div className="relative space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#8f5835]">
                Archivo Recuperado
              </p>
              <h2 className="mt-3 text-5xl font-serif font-bold tracking-tight">
                Codex Ignis
              </h2>
            </div>

            <p className="max-w-[38ch] text-lg leading-8 text-[#4a2717]">
              El pergamino conserva una firma mineral y las marcas de una
              combustion lenta. El borde activo asciende como si la tinta
              estuviera abandonando la fibra hoja por hoja.
            </p>

            <div className="flex items-center justify-between border-t border-[#6d4026]/25 pt-6 text-sm uppercase tracking-[0.3em] text-[#8f5835]">
              <span>Sector 04</span>
              <span>Observacion termica</span>
            </div>
          </div>
        </article>
      </CinderDissolve>
    </div>
  ),
};

export const EvaporacionHolografica: Story = {
  args: {
    mode: "evaporate",
    origin: "top",
    edgeWidth: 0.18,
    distortion: 11,
    turbulence: 0.012,
    duration: 6.8,
    particleCount: 10,
  },
  parameters: {
    docs: {
      description: {
        story:
          "La información encriptada se transforma a estado vaporoso usando el modo 'evanescencia' del componente. Como un nodo botánico perdiendo masa en el vacío.",
      },
    },
  },
  render: (args) => (
    <div className="relative flex w-[580px] items-center justify-center overflow-hidden rounded-[2rem] border border-slate-700/70 bg-[linear-gradient(145deg,_#030712,_#0f172a_55%,_#1e293b)] p-10 shadow-[0_30px_90px_rgba(2,6,23,0.65)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(125,211,252,0.18),_transparent_22%),radial-gradient(circle_at_82%_70%,_rgba(226,232,240,0.12),_transparent_20%)]" />
      <CinderDissolve {...args} className="w-full max-w-[440px] rounded-[28px]">
        <section className="relative overflow-hidden rounded-[28px] border border-sky-200/20 bg-slate-900/70 p-8 backdrop-blur-md">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(125,211,252,0.18),_transparent_30%,_rgba(255,255,255,0.08)_100%)]" />
          <div className="relative space-y-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-sky-200/75">
                  Nodo atmosferico
                </p>
                <h3 className="mt-3 text-4xl font-semibold tracking-tight text-slate-50">
                  Vapor Protocol
                </h3>
              </div>
              <div className="rounded-full border border-sky-200/20 px-4 py-1 text-xs uppercase tracking-[0.35em] text-sky-100/80">
                Phase 03
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Densidad 0.84
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Ionizacion 72%
              </div>
            </div>

            <p className="max-w-[34ch] text-base leading-7 text-slate-300/90">
              El panel se desmaterializa en capas frias y niebla luminosa, como
              si estuviera perdiendo masa en una camara de vacio.
            </p>
          </div>
        </section>
      </CinderDissolve>
    </div>
  ),
};

export const RetratoIncinerado: Story = {
  args: {
    mode: "burn",
    origin: "left",
    edgeWidth: 0.16,
    distortion: 22,
    turbulence: 0.02,
    duration: 4.8,
    loop: false,
    pauseAt: 1,
    particleCount: 11,
    flameVariant: "front",
    burnPattern: "edge",
    pointAmount: 40,
    burnSeed: 29,
  },
  render: (args) => (
    <div className="rounded-[2rem] bg-[#120b09] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
      <CinderDissolve
        {...args}
        className="overflow-hidden rounded-[1.75rem] border border-orange-500/20"
      >
        <img
          src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=1800&auto=format&fit=crop"
          alt="Retrato abstracto"
          className="h-[520px] w-[380px] object-cover"
        />
      </CinderDissolve>
    </div>
  ),
};

export const SenalTerminal: Story = {
  args: {},
  render: () => {
    const [shutdown, setShutdown] = useState(0);

    useEffect(() => {
      let raf = 0;
      let start = 0;
      const durationMs = 2300;

      const frame = (timestamp: number) => {
        if (!start) {
          start = timestamp;
        }

        const t = Math.min((timestamp - start) / durationMs, 1);
        // Cierre tipo CRT: casi toda la compresion al final.
        const eased =
          t < 0.68 ? t * 0.22 : 0.15 + ((t - 0.68) / 0.32) ** 2 * 0.85;
        setShutdown(clampValue(eased, 0, 1));

        if (t < 1) {
          raf = requestAnimationFrame(frame);
        }
      };

      raf = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(raf);
    }, []);

    const inset = `${(shutdown * 49).toFixed(2)}% 0 ${(shutdown * 49).toFixed(2)}% 0`;
    const lineOpacity = shutdown > 0.5 ? 1 - (shutdown - 0.5) / 0.5 : 0;
    const glowOpacity = shutdown > 0.4 ? 1 - (shutdown - 0.4) / 0.6 : 0;

    return (
      <div className="w-[620px] rounded-[1.75rem] border border-zinc-600/40 bg-[#040404] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
        <div className="relative overflow-hidden rounded-[1.2rem] border border-zinc-500/35 bg-black">
          <div
            className="relative min-h-[240px] px-8 py-7 font-mono text-emerald-300 shadow-[inset_0_0_40px_rgba(16,185,129,0.08)] transition-[clip-path,opacity] duration-100"
            style={{
              clipPath: `inset(${inset})`,
              opacity: 1 - shutdown * 0.92,
            }}
          >
            <div className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-emerald-400/65">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              CRT SIGNAL
            </div>
            <div className="space-y-3 text-sm leading-7">
              <p>&gt; syncing phosphor grid...</p>
              <p>&gt; vertical hold unstable...</p>
              <p>&gt; beam collapsing to center line...</p>
              <p className="text-amber-300">&gt; shutdown complete</p>
            </div>
          </div>

          <div
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-emerald-200"
            style={{
              opacity: lineOpacity,
              boxShadow: "0 0 16px rgba(167,243,208,0.9)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: glowOpacity,
              background:
                "radial-gradient(circle at center, rgba(167,243,208,0.24) 0%, rgba(167,243,208,0.05) 30%, rgba(0,0,0,0) 72%)",
            }}
          />
        </div>
      </div>
    );
  },
};

export const DisolucionManual: Story = {
  args: {
    mode: "evaporate",
    origin: "right",
    progress: 0.52,
    animate: false,
    edgeWidth: 0.18,
    distortion: 14,
    turbulence: 0.015,
    particleCount: 9,
  },
  render: (args) => (
    <div className="relative rounded-[2rem] border border-slate-300 bg-[linear-gradient(135deg,_#f8fafc,_#e2e8f0)] p-10 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <CinderDissolve {...args} className="rounded-[1.5rem]">
        <div className="w-[480px] rounded-[1.5rem] border border-slate-300 bg-white px-8 py-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Snapshot
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-900">
                Fase intermedia
              </h3>
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white">
              52%
            </div>
          </div>
          <p className="mt-8 max-w-[36ch] text-base leading-7 text-slate-600">
            Esta historia deja el progreso fijo para inspeccionar el borde,
            ajustar la densidad del humo y comprobar el acabado del mask en un
            punto concreto de la desintegracion.
          </p>
        </div>
      </CinderDissolve>
    </div>
  ),
};

export const PausaEnPunto: Story = {
  args: {
    mode: "burn",
    origin: "right",
    animate: true,
    pauseAt: 0.63,
    paused: true,
    edgeWidth: 0.2,
    distortion: 18,
    turbulence: 0.02,
    particleCount: 14,
    flameVariant: "front",
    burnPattern: "center",
    pointAmount: 44,
    burnSeed: 25,
  },
  render: (args) => (
    <div className="relative w-[620px] overflow-hidden rounded-[2rem] border border-amber-900/40 bg-[radial-gradient(circle_at_top,_#5a341f,_#180d07_62%)] p-10 shadow-[0_28px_80px_rgba(0,0,0,0.5)]">
      <CinderDissolve {...args} className="rounded-[1.5rem]">
        <div className="rounded-[1.5rem] border border-amber-800/40 bg-[#eadbb6] p-10 text-[#2f190f] shadow-[inset_0_0_35px_rgba(88,48,24,0.2)]">
          <p className="text-xs uppercase tracking-[0.4em] text-[#8f5835]">
            Modo Pausa
          </p>
          <h3 className="mt-4 text-4xl font-serif font-bold">
            Frame Congelado
          </h3>
          <p className="mt-5 max-w-[42ch] text-lg leading-8">
            Esta variante deja el burn detenido en un punto exacto. Las llamas,
            el humo y las chispas quedan congeladas en el mismo instante visual.
          </p>
        </div>
      </CinderDissolve>
    </div>
  ),
};

export const LlamasParticuladas: Story = {
  args: {
    mode: "burn",
    origin: "left",
    animate: true,
    edgeWidth: 0.17,
    distortion: 21,
    turbulence: 0.024,
    particleCount: 18,
    flameVariant: "particles",
    burnPattern: "edge",
    pointAmount: 26,
    burnSeed: 7,
  },
  render: (args) => (
    <div className="relative w-[580px] overflow-hidden rounded-[2rem] border border-[#5f3019] bg-[radial-gradient(circle_at_top,_#5d341d,_#160b06_64%)] p-10 shadow-[0_28px_80px_rgba(0,0,0,0.5)]">
      <CinderDissolve {...args} className="rounded-[1.5rem]">
        <div className="rounded-[1.5rem] border border-amber-800/40 bg-[#eadbb6] p-10 text-[#2f190f] shadow-[inset_0_0_35px_rgba(88,48,24,0.2)]">
          <p className="text-xs uppercase tracking-[0.4em] text-[#8f5835]">
            Variante Alterna
          </p>
          <h3 className="mt-4 text-4xl font-serif font-bold">
            Llamas por particulas
          </h3>
          <p className="mt-5 max-w-[42ch] text-lg leading-8">
            Variante agresiva en la que el frente no es una lengua continua,
            sino estallidos puntuales con mayor turbulencia y ceniza lateral.
          </p>
        </div>
      </CinderDissolve>
    </div>
  ),
};

export const BonanzaTransition: Story = {
  args: {
    mode: "burn",
    animate: true,
    duration: 3,
    edgeWidth: 0.2,
    distortion: 14,
    turbulence: 0.014,
    flameVariant: "front",
    burnPattern: "center",
    pointAmount: 48,
    burnSeed: 33,
  },
  render: (args) => (
    <div className="relative w-[760px] h-[440px] overflow-hidden rounded-[2rem] border border-[#5b311a] bg-[radial-gradient(circle_at_50%_35%,_#783f1d,_#1a0d07_62%)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
      <CinderDissolve {...args} className="w-full h-full rounded-[1.5rem]">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#e6d5b1]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0),rgba(0,0,0,0.18)_74%)]" />
          <h2 className="relative text-6xl font-serif font-bold text-[#2b180f] tracking-tight text-center">
            BURNING
            <br />
            PAPER
          </h2>
        </div>
      </CinderDissolve>
    </div>
  ),
};

export const SplashRevealCenter: Story = {
  args: {
    mode: "evaporate",
    animate: true,
    duration: 2.2,
    edgeWidth: 0.24,
    distortion: 10,
    turbulence: 0.01,
    burnPattern: "center",
    pointAmount: 20,
    burnSeed: 41,
  },
  render: (args) => (
    <div className="relative w-[640px] h-[360px] overflow-hidden rounded-[1.5rem] border border-[#4a2815] bg-[#130b07] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
      <CinderDissolve {...args} className="w-full h-full rounded-[1.25rem]">
        <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] bg-[linear-gradient(145deg,#f8e7c9,#d6b98b)]">
          <p className="text-5xl font-serif font-bold text-[#2c170e]">
            VOYNICH UI
          </p>
        </div>
      </CinderDissolve>
    </div>
  ),
};

const clampValue = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
