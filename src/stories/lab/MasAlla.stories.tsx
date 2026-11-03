import { useCallback, useEffect, useState } from "react";
import type { Meta } from "@storybook/react";
import { Tide } from "./Tide";
import { Strata, type Stratum } from "./Strata";
import { Constellation, type Star } from "./Constellation";
import { Roots, type RootNode } from "./Roots";
import { SettingInk } from "./SettingInk";
import { Sieve } from "./Sieve";
import { Button } from "../../components/rituals/Button";
import "./lab.css";

const meta = {
  title: "Laboratorio/Más allá del botón",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Prototipos, no componentes de la librería. Cada uno parte de un problema (esperar, enterarse, encontrar, " +
          "moverse por una jerarquía, validar, buscar) y de lo que el componente de siempre esconde.",
      },
    },
  },
} satisfies Meta;

export default meta;

const Hoja = ({ children, nota, wide }: { children: React.ReactNode; nota: string; wide?: boolean }) => (
  <div className={`voy-paper p-6 sm:p-10 text-voynich-inkDark w-full ${wide ? "max-w-3xl" : "max-w-xl"}`}>
    <p className="italic text-voynich-inkMedium text-[15px] leading-relaxed mb-8 max-w-prose">{nota}</p>
    {children}
  </div>
);

/** Esperar. Tres esperas a la vez: una rápida, una dentro de lo previsto y una que se pasa (y desborda). */
export const Marea = () => {
  const [done, setDone] = useState({ a: false, b: false });
  useEffect(() => {
    const t1 = setTimeout(() => setDone((d) => ({ ...d, a: true })), 3000);
    const t2 = setTimeout(() => setDone((d) => ({ ...d, b: true })), 9000);
    return () => (clearTimeout(t1), clearTimeout(t2));
  }, []);
  return (
    <Hoja wide nota="La franja rayada es lo que se esperaba. El agua es el tiempo que ha pasado. Si rebasa la franja, desborda: la espera ya no es normal, y se ve sin leer nada.">
      <div className="flex flex-wrap justify-center gap-10">
        <Tide label="Cargar el folio" expected={[2, 5]} done={done.a} />
        <Tide label="Cotejar copias" expected={[6, 12]} done={done.b} />
        <Tide label="Consultar el archivo" expected={[3, 6]} />
      </div>
    </Hoja>
  );
};

/** Enterarse. Cada suceso se deposita encima del anterior; lo antiguo se compacta pero sigue ahí. */
export const Estratos = () => {
  const now = Date.now();
  const [items, setItems] = useState<Stratum[]>([
    { id: "1", text: "Transcripción del 1r guardada", kind: "hecho", at: new Date(now - 3600_000 * 3) },
    { id: "2", text: "Marci añadió una glosa al 3v", kind: "nota", at: new Date(now - 3600_000) },
    { id: "3", text: "El folio 12 no se encuentra", kind: "aviso", at: new Date(now - 600_000) },
    { id: "4", text: "Revisión del 2r terminada", kind: "hecho", at: new Date(now - 120_000) },
  ]);
  const add = (kind: Stratum["kind"], text: string) => setItems((l) => [...l, { id: String(Date.now()), kind, text, at: new Date() }]);
  return (
    <Hoja nota="Lo más reciente, arriba. La textura es el tipo de suceso (aviso rayado, nota punteada, hecho liso); el grosor, cuánto importa.">
      <div className="flex gap-3 mb-8 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => add("hecho", "Folio sellado")}>Un hecho</Button>
        <Button size="sm" variant="outline" onClick={() => add("nota", "Nueva glosa al margen")}>Una nota</Button>
        <Button size="sm" variant="outline" onClick={() => add("aviso", "Tinta corrida en el 5r")}>Un aviso</Button>
      </div>
      <Strata items={items} />
    </Hoja>
  );
};

/** Encontrar una acción entre muchas. Prueba con las flechas: llevan a la estrella más cercana en esa dirección. */
export const Constelacion = () => {
  const [picked, setPicked] = useState<string>("—");
  const stars: Star[] = [
    { id: "copiar", label: "copiar", x: 80, y: 90, group: "escritura", mag: 1 },
    { id: "glosar", label: "glosar", x: 150, y: 60, group: "escritura", mag: 2 },
    { id: "corregir", label: "corregir", x: 200, y: 120, group: "escritura", mag: 2 },
    { id: "raspar", label: "raspar", x: 140, y: 170, group: "escritura", mag: 3 },
    { id: "sellar", label: "sellar", x: 330, y: 70, group: "custodia", mag: 1 },
    { id: "guardar", label: "guardar", x: 390, y: 130, group: "custodia", mag: 1 },
    { id: "prestar", label: "prestar", x: 450, y: 80, group: "custodia", mag: 3 },
    { id: "cotejar", label: "cotejar", x: 300, y: 230, group: "estudio", mag: 2 },
    { id: "medir", label: "medir", x: 380, y: 260, group: "estudio", mag: 3 },
    { id: "datar", label: "datar", x: 460, y: 220, group: "estudio", mag: 2 },
  ];
  return (
    <Hoja wide nota="Las acciones son estrellas: más grandes cuanto más se usan, agrupadas en asterismos. Al acercarte a una se enciende su grupo. Con teclado, las flechas te mueven por el cielo.">
      <Constellation
        label="Acciones sobre el folio"
        stars={stars}
        groups={{ escritura: "La Escritura", custodia: "La Custodia", estudio: "El Estudio" }}
        onSelect={(s) => setPicked(s.label)}
        width={540}
        height={300}
      />
      <p className="text-sm mt-4">Elegida: <em>{picked}</em></p>
    </Hoja>
  );
};

/** Moverse por una jerarquía. Lo abierto se entinta; el camino hasta lo elegido queda cargado. */
export const Raices = () => {
  const tree: RootNode[] = [
    {
      id: "herb", label: "Herbario", children: [
        { id: "raices", label: "Raíces", children: [{ id: "bulbo", label: "Bulbosas" }, { id: "fibra", label: "Fibrosas" }] },
        { id: "hojas", label: "Hojas", children: [{ id: "lanc", label: "Lanceoladas" }, { id: "palm", label: "Palmeadas" }, { id: "comp", label: "Compuestas" }] },
        { id: "flores", label: "Flores" },
      ],
    },
    { id: "astros", label: "Astros", children: [{ id: "zod", label: "Zodiaco" }, { id: "ros", label: "Rosetas" }] },
    { id: "banos", label: "Baños", children: [{ id: "tubos", label: "Tubos" }, { id: "pilas", label: "Pilas" }] },
  ];
  const [where, setWhere] = useState("—");
  return (
    <Hoja wide nota="Abre una raíz para ver lo que crece debajo. Las que tienen brote aún esconden algo. El trazo grueso, de la superficie a la punta, es dónde estás.">
      <Roots tree={tree} label="Secciones del códice" onSelect={(n) => setWhere(n.label)} />
      <p className="text-sm mt-4">Elegido: <em>{where}</em></p>
    </Hoja>
  );
};

/** Validar. La tinta seca si el valor vale; si no, se corre y aparece la corrección. */
export const TintaQueFragua = () => {
  const [folio, setFolio] = useState("");
  const [palabra, setPalabra] = useState("");
  const validateFolio = useCallback((v: string) => (/^\d{1,3}[rv]$/.test(v.trim()) ? null : "Un folio se escribe con número y cara: 1r, 86v…"), []);
  const validateWord = useCallback((v: string) => (/^[acdehiklnopqrsty]+$/.test(v.trim()) ? null : "En EVA no existen esas letras."), []);
  return (
    <Hoja nota="Escribe y detente: si vale, la tinta fragua (se asienta, mate). Si no, se corre y el corrector anota al margen por qué.">
      <div className="flex flex-col gap-8">
        <SettingInk label="Folio" value={folio} onChange={setFolio} validate={validateFolio} placeholder="86v" />
        <SettingInk label="Palabra en EVA" value={palabra} onChange={setPalabra} validate={validateWord} placeholder="qokeedy" />
      </div>
    </Hoja>
  );
};

/** Buscar. Lo que coincide queda en la malla; lo descartado cae, visible, al fondo. */
export const Tamiz = () => {
  const words = ["daiin", "qokeedy", "chedy", "shedy", "qokedy", "okaiin", "chol", "chor", "cthol", "otaiin", "dar", "ykaiin", "sheky", "qotedy", "ol", "aiin"];
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState("—");
  return (
    <Hoja nota="Escribe «ai» o «qo». No desaparece nada: lo que no coincide cae por la malla y queda abajo, más pequeño.">
      <Sieve label="Palabras del folio 1r" items={words.map((w) => ({ id: w, label: w }))} query={q} onQuery={setQ} onPick={setPicked} />
      <p className="text-sm mt-6">Elegida: <em>{picked}</em></p>
    </Hoja>
  );
};
