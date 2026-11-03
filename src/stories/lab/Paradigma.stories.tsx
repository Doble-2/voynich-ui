import { useMemo, useState } from "react";
import type { Meta } from "@storybook/react";
import { RosetteMap, type Place, type Way } from "./RosetteMap";
import { Decipher } from "./Decipher";
import "./lab.css";

const meta = {
  title: "Laboratorio/Sin botones",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Prototipos, no componentes de la librería. Pregunta de partida: si nadie hubiera inventado el botón, ¿cómo " +
          "resolvería alguien el problema? Respuesta: con lugares y caminos (actuar es moverse entre estados) y con " +
          "conocimiento (lo oculto se vuelve legible cuando se sabe lo suficiente, no con un gesto).",
      },
    },
  },
} satisfies Meta;

export default meta;

const Hoja = ({ children, wide }: { children: React.ReactNode; wide?: boolean }) => (
  <div className={`voy-paper p-6 sm:p-10 text-voynich-inkDark w-full ${wide ? "max-w-3xl" : "max-w-xl"}`}>{children}</div>
);
const Nota = ({ children }: { children: React.ReactNode }) => (
  <p className="italic text-voynich-inkMedium text-[15px] leading-relaxed mb-6 max-w-prose">{children}</p>
);

/**
 * Lo que antes eran cuatro botones, uno desactivado sin explicación y un «¿Seguro que quieres raspar?»: un mapa
 * del ciclo de vida del folio. Desde cada lugar solo salen los caminos posibles; raspar y sellar son ríos (sin
 * vuelta atrás) y se ve antes de actuar.
 */
export const CicloDelFolio = () => {
  const places: Place[] = [
    { id: "borrador", label: "Borrador", x: 70, y: 150 },
    { id: "transcrito", label: "Transcrito", x: 230, y: 70 },
    { id: "revisado", label: "Revisado", x: 400, y: 150 },
    { id: "sellado", label: "Sellado", x: 560, y: 70 },
    { id: "raspado", label: "Raspado", x: 300, y: 290 },
  ];
  const ways: Way[] = [
    { from: "borrador", to: "transcrito", label: "transcribir" },
    { from: "transcrito", to: "revisado", label: "revisar" },
    { from: "revisado", to: "sellado", label: "sellar", oneWay: true },
    { from: "borrador", to: "raspado", label: "raspar", oneWay: true, bend: -0.1 },
    { from: "revisado", to: "raspado", label: "raspar", oneWay: true, bend: 0.1 },
  ];
  const [at, setAt] = useState("borrador");
  return (
    <Hoja wide>
      <Nota>
        La ficha marca dónde está el folio. Los caminos que salen de ahí son lo que puedes hacer: las calzadas se
        pueden desandar, los ríos no.
      </Nota>
      <RosetteMap label="Ciclo de vida del folio" places={places} ways={ways} at={at} onMove={setAt} width={630} height={350} />
    </Hoja>
  );
};

/**
 * Los casos mínimos. Enviar una carta: un lugar, un río y otro lugar (lo que antes era un botón). Mostrar u ocultar
 * las glosas: dos lugares unidos por una calzada (lo que antes era un interruptor).
 */
export const LoQueEraUnBoton = () => {
  const [carta, setCarta] = useState("escrita");
  const [glosas, setGlosas] = useState("ocultas");
  return (
    <Hoja>
      <Nota>Un botón era un mapa de dos lugares con un camino. Un interruptor, dos lugares con una calzada.</Nota>
      <RosetteMap
        label="Carta"
        places={[{ id: "escrita", label: "Escrita", x: 60, y: 60 }, { id: "enviada", label: "Enviada", x: 320, y: 60 }]}
        ways={[{ from: "escrita", to: "enviada", label: "enviar", oneWay: true, bend: 0.08 }]}
        at={carta}
        onMove={setCarta}
        width={380}
        height={120}
      />
      <div className="h-6" />
      <RosetteMap
        label="Glosas"
        places={[{ id: "ocultas", label: "Ocultas", x: 60, y: 60 }, { id: "visibles", label: "Visibles", x: 320, y: 60 }]}
        ways={[{ from: "ocultas", to: "visibles", label: "mostrar / ocultar", bend: 0.08 }]}
        at={glosas}
        onMove={setGlosas}
        width={380}
        height={120}
      />
    </Hoja>
  );
};

/**
 * Lo que antes era «revelar» (sellos, tinta invisible, rascar, palimpsestos): el texto está en un alfabeto
 * desconocido y se descifra a medida que aprendes palabras. Aquí se aprenden visitando las secciones del códice.
 */
export const Desciframiento = () => {
  const places: Place[] = [
    { id: "herbario", label: "Herbario", x: 80, y: 80 },
    { id: "astros", label: "Astros", x: 300, y: 50 },
    { id: "banos", label: "Baños", x: 520, y: 80 },
    { id: "recetas", label: "Recetas", x: 300, y: 200 },
  ];
  const ways: Way[] = [
    { from: "herbario", to: "astros", label: "subir" },
    { from: "astros", to: "banos", label: "bajar" },
    { from: "herbario", to: "recetas", label: "preparar", bend: -0.12 },
    { from: "banos", to: "recetas", label: "destilar", bend: 0.12 },
  ];
  const LEXICON: Record<string, string[]> = {
    herbario: ["raiz", "hojas", "planta"],
    astros: ["luna", "menguante", "sombra"],
    banos: ["agua", "vino", "tibia"],
    recetas: ["toma", "seca", "cura", "cabeza", "la", "en", "y", "a", "su", "con", "de"],
  };
  const [at, setAt] = useState("herbario");
  const [visited, setVisited] = useState<Set<string>>(new Set(["herbario"]));
  const known = useMemo(() => new Set([...visited].flatMap((v) => LEXICON[v] ?? [])), [visited]);
  return (
    <Hoja wide>
      <Nota>Recorre las secciones: cada una te enseña palabras, y el texto de la receta se va dejando leer.</Nota>
      <RosetteMap
        label="Secciones del códice"
        places={places}
        ways={ways}
        at={at}
        onMove={(to) => {
          setAt(to);
          setVisited((v) => new Set(v).add(to));
        }}
        width={600}
        height={250}
      />
      <div className="mt-8 border-t border-voynich-inkMedium/25 pt-8">
        <Decipher
          known={known}
          text="Toma la raíz en luna menguante y seca la planta a la sombra; su agua con vino tibia cura la cabeza."
        />
      </div>
    </Hoja>
  );
};
