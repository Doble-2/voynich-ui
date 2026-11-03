import type { Meta, StoryObj } from "@storybook/react";
import { LensMagnifier, type LensMagnifierRef } from "../components/phenomena/LensMagnifier";
import { Button } from "../components/rituals/Button";
import { FOLIO_SRC } from "./assets/folio";
import { useRef } from "react";

const meta = {
  title: "Revelar/LensMagnifier",
  component: LensMagnifier,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Una lente de cristal que amplía lo que hay debajo del cursor. Las «piedras de lectura» de cristal pulido " +
          "ya se usaban en el siglo XIII para leer letra pequeña.",
      },
    },
  },
  tags: ["autodocs"],
  args: { src: FOLIO_SRC, alt: "Folio de herbario con una planta y renglones en EVA" },
  argTypes: {
    zoomLevel: { control: { type: "range", min: 1, max: 6, step: 0.5 }, description: "Nivel de zoom" },
    lensSize: { control: { type: "range", min: 50, max: 400, step: 10 }, description: "Tamaño de la lente (px)" },
    lensBorder: { control: { type: "range", min: 0, max: 12, step: 1 }, description: "Grosor del aro" },
    lensShape: { control: "select", options: ["circle", "square", "rounded-square"], description: "Forma de la lente" },
    filter: { control: "select", options: ["none", "sepia", "vintage"], description: "Tinte del cristal" },
    showHandle: { control: "boolean", description: "Mostrar mango" },
    smoothFollowing: { control: "boolean", description: "Seguimiento suave del cursor" },
  },
} satisfies Meta<typeof LensMagnifier>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) => (
  <div className="voy-paper p-6 sm:p-8 flex flex-col gap-3">
    <h3 className="text-2xl text-voynich-inkDark" style={{ fontFamily: "var(--voynich-font-display)" }}>{title}</h3>
    <p className="italic text-voynich-inkMedium">{hint}</p>
    {children}
  </div>
);

export const Default: Story = {
  args: { zoomLevel: 2, lensSize: 180, lensBorder: 2, smoothFollowing: true },
  render: (args) => (
    <Frame title="Folio 1r" hint="Pasa el cursor sobre el folio para ampliar los glifos.">
      <LensMagnifier {...args} className="w-[600px] max-w-full h-[420px]" />
    </Frame>
  ),
};

/** Lente con aro de latón y mango, con el cristal algo amarillento. */
export const PiedraDeLectura: Story = {
  args: { zoomLevel: 2.2, lensSize: 180, lensBorder: 8, lensShape: "circle", filter: "vintage", showHandle: true, smoothFollowing: true },
  render: (args) => (
    <Frame title="Piedra de lectura" hint="Una lupa de mano: aro de latón, mango y cristal envejecido.">
      <LensMagnifier {...args} className="w-[600px] max-w-full h-[420px]" />
    </Frame>
  ),
};

/** Mucho aumento en una lente pequeña: para leer un solo glifo. */
export const DetalleDelGlifo: Story = {
  args: { zoomLevel: 5, lensSize: 120, smoothFollowing: false },
  render: (args) => (
    <Frame title="Detalle del glifo" hint="Aumento ×5 para distinguir trazos de pluma.">
      <LensMagnifier {...args} className="w-[600px] max-w-full h-[420px]" />
    </Frame>
  ),
};

/** `resetZoom()` aparta la lente desde fuera del componente. */
export const ControlImperativo: Story = {
  render: (args) => {
    const ref = useRef<LensMagnifierRef>(null);
    return (
      <Frame title="Control desde fuera" hint="El botón aparta la lente del folio.">
        <LensMagnifier ref={ref} {...args} zoomLevel={2.5} lensSize={200} className="w-[600px] max-w-full h-[420px]" />
        <Button variant="outline" size="sm" onClick={() => ref.current?.resetZoom()} className="self-start">
          Apartar la lente
        </Button>
      </Frame>
    );
  },
};
