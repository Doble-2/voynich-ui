import type { Meta, StoryObj } from "@storybook/react";
import { Gloss, GlossProvider, useGloss } from "../components/artifacts/Gloss";
import { Button } from "../components/rituals/Button";

const meta = {
  title: "Leer/Gloss",
  component: Gloss,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Notificaciones como glosas: una nota de otra mano que aparece en el margen, con el calderón (¶) en rúbrica. " +
          "Envuelve la app en `GlossProvider` y escribe con `useGloss().gloss({ text })`. Se anuncian a los lectores de " +
          "pantalla y se quedan quietas mientras el puntero o el foco están encima.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Gloss>;

export default meta;
type Story = StoryObj<typeof meta>;

/** La pieza suelta, para componerla donde quieras. */
export const Default: Story = {
  args: { title: "Nota del copista", children: "Este folio está fuera de su sitio: debería ir tras el 57." },
  render: (args) => (
    <div className="w-[340px] max-w-full">
      <Gloss {...args} />
    </div>
  ),
};

const Escritorio = () => {
  const { gloss } = useGloss();
  return (
    <div className="voy-paper p-8 flex flex-col gap-3 items-start text-voynich-inkDark">
      <p className="italic">Las glosas aparecen en el margen inferior derecho.</p>
      <Button size="sm" onClick={() => gloss({ title: "Guardado", text: "Tu transcripción del folio 1r se ha guardado." })}>
        Guardar transcripción
      </Button>
      <Button size="sm" variant="secondary" onClick={() => gloss({ tone: "rubric", title: "Atención", text: "El folio 3v está dañado: falta la esquina inferior.", duration: 0 })}>
        Aviso que no se retira solo
      </Button>
    </div>
  );
};

export const EnElMargen = () => (
  <GlossProvider>
    <Escritorio />
  </GlossProvider>
);
