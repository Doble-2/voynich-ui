import { useState } from "react";
import type { Meta } from "@storybook/react";
import { SignButton } from "./SignButton";
import { VesselButton } from "./VesselButton";
import "./lab.css";

const meta = {
  title: "Laboratorio/Botones",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Prototipos, no componentes de la librería. Exploran qué sería un botón en una civilización que no conocemos: " +
          "una cuya técnica no es mecánica, sino hidráulica y botánica, y cuya escritura no se ha descifrado.",
      },
    },
  },
} satisfies Meta;

export default meta;

const Hoja = ({ children }: { children: React.ReactNode }) => (
  <div className="voy-paper p-8 sm:p-10 max-w-2xl text-voynich-inkDark">{children}</div>
);
const Nota = ({ children }: { children: React.ReactNode }) => (
  <p className="italic text-voynich-inkMedium text-[15px] leading-relaxed max-w-prose">{children}</p>
);

/**
 * Lo incompleto pide ser completado. El botón es un signo al que le falta un trazo; al pulsar, el trazo se
 * cierra. El hueco crece con la gravedad: un signo «grave» está casi abierto, y se cierra en rúbrica.
 */
export const SignoIncompleto = () => {
  const [log, setLog] = useState("—");
  const [on, setOn] = useState(false);
  return (
    <Hoja>
      <div className="flex flex-col gap-9">
        <Nota>Pasa el cursor: aparece la guía del trazo que falta. Pulsa: el signo se cierra.</Nota>
        <div className="flex flex-wrap gap-x-10 gap-y-8 items-end">
          <SignButton onClick={() => setLog("Folio guardado")}>Guardar el folio</SignButton>
          <SignButton weight="grave" onClick={() => setLog("Folio raspado")}>Raspar el folio</SignButton>
          <SignButton toggle pressed={on} onPressedChange={setOn}>
            {on ? "Glosas visibles" : "Mostrar glosas"}
          </SignButton>
        </div>
        <p className="text-sm">Última acción: <em>{log}</em></p>
      </div>
    </Hoja>
  );
};

/**
 * Una acción es un trasvase. Mantén pulsado (o mantén Espacio): el líquido corre por el tubo y, al llegar a la
 * marca, la acción ocurre. Si sueltas antes, vuelve al depósito. Cuanto más grave la acción, más tarda.
 */
export const VasosComunicantes = () => {
  const [log, setLog] = useState("—");
  return (
    <Hoja>
      <div className="flex flex-col gap-7">
        <Nota>Mantén pulsado hasta que el líquido llegue a la marca. Suelta antes y no pasa nada.</Nota>
        <VesselButton weight="leve" onCommit={() => setLog("Nota añadida (leve)")}>Añadir nota</VesselButton>
        <VesselButton weight="media" onCommit={() => setLog("Folio guardado (media)")}>Guardar el folio</VesselButton>
        <VesselButton weight="grave" onCommit={() => setLog("Folio raspado (grave)")}>Raspar el folio</VesselButton>
        <p className="text-sm">Última acción: <em>{log}</em></p>
      </div>
    </Hoja>
  );
};
