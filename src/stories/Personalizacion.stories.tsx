import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Button } from "../components/rituals/Button";
import { Surface, type SurfaceMaterial } from "../components/primitives/Surface";
import { RingPuzzle, useRingPuzzle, type Ring } from "../components/rituals/RingPuzzle";

const meta = {
  title: "Introducción/Personalización",
  parameters: {
    layout: "fullscreen",
    bare: true,
    docs: {
      description: {
        component:
          "Cada componente se puede recomponer: **partes** (`Button.Icon`, `RingPuzzle.Ring`…), **`asChild`** para usar tu propio elemento, **variables CSS** para retocar el material y **hooks** para usar la mecánica con tu propio dibujo. Aquí están todas las capas en funcionamiento.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Stage: React.FC<{ title: string; hint: string; children: React.ReactNode }> = ({ title, hint, children }) => (
  <section className="voy-leather" style={{ minHeight: 560, padding: "clamp(20px, 6vw, 44px) clamp(16px, 6vw, 48px)", color: "rgb(var(--voynich-vellum))" }}>
    <h3 style={{ fontFamily: "var(--voynich-font-display)", fontWeight: 600, fontSize: 24, color: "rgb(var(--voynich-gold-light))", margin: 0 }}>
      {title}
    </h3>
    <p style={{ fontFamily: "var(--voynich-font-body)", fontStyle: "italic", opacity: 0.7, margin: "4px 0 28px" }}>{hint}</p>
    {children}
  </section>
);

const Cell: React.FC<{ code: string; children: React.ReactNode }> = ({ code, children }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, minWidth: 0, maxWidth: "100%" }}>
    <div style={{ minHeight: 56, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>{children}</div>
    <code className="voy-label" style={{ fontSize: 11, opacity: 0.6, letterSpacing: "0.06em", textTransform: "none", fontFamily: "ui-monospace, monospace" }}>
      {code}
    </code>
  </div>
);

/** Un mismo botón recompuesto de cinco maneras. */
export const Botones: Story = {
  render: () => (
    <Stage title="Un botón, cinco maneras" hint="Partes, tu propio elemento, variables CSS y una variante sin material.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40 }}>
        <Cell code="<Button>">
          <Button>Por defecto</Button>
        </Cell>
        <Cell code="<Button.Root> + Icon + Label">
          <Button.Root variant="secondary">
            <Button.Icon>✦</Button.Icon>
            <Button.Label>Sellar</Button.Label>
          </Button.Root>
        </Cell>
        <Cell code="<Button asChild><a href>">
          <Button asChild variant="outline">
            <a href="#codex">Leer el códice</a>
          </Button>
        </Cell>
        <Cell code="style={{ '--voy-bg': … }}">
          <Button
            style={{
              ["--voy-bg" as string]: "rgb(47 74 122)",
              ["--voy-bg-hover" as string]: "rgb(60 92 148)",
              ["--voy-rule" as string]: "rgb(220 196 130 / 0.8)",
            }}
          >
            Lapislázuli
          </Button>
        </Cell>
        <Cell code='variant="unstyled"'>
          <Button variant="unstyled" className="px-5 py-2 border border-dashed border-voynich-gold/60 text-voynich-gold hover:bg-voynich-gold/10">
            Tu propio estilo
          </Button>
        </Cell>
        <Cell code="<Button.Root> sin Frame">
          <Button.Root variant="primary">
            <Button.Label>Sin filete</Button.Label>
          </Button.Root>
        </Cell>
      </div>
    </Stage>
  ),
};

const MATERIALS: SurfaceMaterial[] = ["paper", "leather", "rubric", "bronze", "gold"];

/** Los materiales como pieza suelta, con distintas elevaciones y filetes. */
export const Materiales: Story = {
  render: () => (
    <Stage title="Los materiales, sueltos" hint="<Surface material elevation frame>. Todos reciben la misma luz, así que combinan.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 34 }}>
        {MATERIALS.map((m, i) => (
          <Surface
            key={m}
            material={m}
            elevation={(i % 4) as 0 | 1 | 2 | 3}
            frame={m === "leather" ? "gilt" : m === "paper" ? "ink" : "none"}
            style={{ height: 150, borderRadius: 3, display: "grid", placeItems: "center", textAlign: "center", padding: 12 }}
          >
            <span className="voy-label" style={{ fontSize: 14 }}>
              {m}
              <br />
              <small style={{ opacity: 0.7, letterSpacing: "0.1em" }}>elevación {i % 4}</small>
            </span>
          </Surface>
        ))}
      </div>
    </Stage>
  ),
};

const rings: Ring[] = [
  { id: "a", radius: 170, thickness: 52, initialRotation: 120, targetRotation: 0, step: 15, items: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"] },
  { id: "b", radius: 110, thickness: 52, initialRotation: 75, targetRotation: 0, step: 15, items: ["☉", "☽", "☿", "♀", "♂", "♃"] },
];

/** Un dial hecho solo con la mecánica: sin RingPuzzle visual. */
const PlainDials: React.FC = () => {
  const puzzle = useRingPuzzle({ rings: [{ id: "x", radius: 60, thickness: 60, initialRotation: 90, targetRotation: 0, step: 15 }, { id: "y", radius: 60, thickness: 60, initialRotation: 200, targetRotation: 0, step: 15 }, { id: "z", radius: 60, thickness: 60, initialRotation: 300, targetRotation: 0, step: 15 }] });
  return (
    <div ref={puzzle.containerRef} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32, alignItems: "center" }} data-solved={String(puzzle.solved)}>
      {puzzle.sortedRings.map((r) => {
        const { style, ...props } = puzzle.getRingProps(r);
        const locked = puzzle.locked[r.id];
        return (
          <Surface key={r.id} material={locked ? "gold" : "bronze"} elevation={2} as="div" style={{ borderRadius: "50%", width: 120, height: 120 }}>
            {/* El elemento que gira es el que lleva las props de comportamiento. */}
            <div {...props} style={{ ...style, width: "100%", height: "100%", borderRadius: "50%", display: "grid", placeItems: "center", cursor: locked ? "default" : "grab" }}>
              <svg viewBox="-50 -50 100 100" width="84" height="84" aria-hidden>
                <path d="M0 -40 L9 -6 L0 -14 L-9 -6Z" fill="rgb(28 23 16)" />
                <circle r="3" fill="rgb(28 23 16)" />
              </svg>
            </div>
          </Surface>
        );
      })}
      <span className="voy-label" aria-live="polite" style={{ minWidth: 120 }}>
        {puzzle.solved ? "◆ Alineado" : "Alinea las tres flechas"}
      </span>
    </div>
  );
};

/** La misma mecánica de anillos, dibujada de tres maneras. */
export const PuzzleRecompuesto: Story = {
  render: () => {
    const [solved, setSolved] = useState(false);
    return (
      <Stage title="Una mecánica, tres dibujos" hint="Por defecto · con tus propias partes · solo con el hook, sin ningún componente visual.">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 56, alignItems: "flex-start" }}>
          <Cell code="<RingPuzzle rings={…} />">
            <RingPuzzle rings={rings} size={360} onSolve={() => setSolved(true)} label="Astrolabio" />
          </Cell>

          <Cell code="<RingPuzzle.Root> + partes propias">
            <RingPuzzle.Root rings={rings} size={360} label="Astrolabio sencillo" className="voy-surface" data-material="leather">
              {rings.map((r) => (
                <RingPuzzle.Ring key={r.id} ring={r} className="!bg-transparent !shadow-none border border-voynich-gold/70">
                  <RingPuzzle.Items renderItem={(item) => <span style={{ color: "rgb(var(--voynich-gold-light))" }}>{item}</span>} />
                </RingPuzzle.Ring>
              ))}
              <RingPuzzle.Status />
            </RingPuzzle.Root>
          </Cell>

          <Cell code="useRingPuzzle() + tu dibujo">
            <PlainDials />
          </Cell>
        </div>
        <p className="voy-label" style={{ marginTop: 30, opacity: 0.6, fontSize: 12 }}>
          {solved ? "◆ el primer astrolabio está resuelto" : "mueve los anillos con el ratón o con las flechas del teclado"}
        </p>
      </Stage>
    );
  },
};

/* ─────────────────────────── Los cinco recompuestos ─────────────────────────── */
import { ConfinementCircle } from "../components/rituals/ConfinementCircle";
import { RadialMenu } from "../components/rituals/RadialMenu";
import { WaxSealShatter } from "../components/artifacts/WaxSealShatter";
import { TarotSpreadGrid } from "../components/artifacts/TarotSpreadGrid";
import { CinderDissolve, useDissolveProgress } from "../components/phenomena/CinderDissolve";

const CARDS = [
  { id: "1", title: "El Escriba", description: "Quien copia sin comprender." },
  { id: "2", title: "El Gólem", description: "Quien obedece sin hablar." },
  { id: "3", title: "El Relojero", description: "Quien da cuerda al tiempo." },
];

const RADIAL = [
  { id: "a", label: "Sol", icon: "☉", onClick: () => {} },
  { id: "b", label: "Luna", icon: "☽", onClick: () => {} },
  { id: "c", label: "Mercurio", icon: "☿", onClick: () => {} },
];

/** Barra de progreso hecha con el mismo motor que el fuego, sin dibujar nada del efecto. */
const ProgressBar: React.FC = () => {
  const { progress } = useDissolveProgress({ animate: true, duration: 5, loop: true });
  return (
    <div style={{ width: 220 }}>
      <div style={{ height: 6, background: "rgb(0 0 0 / 0.4)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${progress * 100}%`, height: "100%", background: "rgb(var(--voynich-gold))" }} />
      </div>
      <code style={{ fontSize: 11, opacity: 0.6 }}>progreso {progress.toFixed(2)}</code>
    </div>
  );
};

/** Cada componente, recompuesto con sus partes. */
export const ComponentesRecompuestos: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Stage title="Los cinco, recompuestos" hint="Cada uno con partes propias, asChild o solo su mecánica.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "start" }}>
          <Cell code="WaxSealShatter: Emblem propio, sin Hint">
            <WaxSealShatter.Root sealSize={104}>
              <WaxSealShatter.Trigger>
                <WaxSealShatter.Seal>
                  <WaxSealShatter.Emblem>☉</WaxSealShatter.Emblem>
                </WaxSealShatter.Seal>
              </WaxSealShatter.Trigger>
              <WaxSealShatter.Particles />
              <WaxSealShatter.Content className="mt-6">El secreto del Sol.</WaxSealShatter.Content>
            </WaxSealShatter.Root>
          </Cell>

          <Cell code="TarotSpreadGrid: reverso propio">
            <div style={{ height: 320, width: 300 }}>
              <TarotSpreadGrid.Root cards={CARDS} spreadType="fan" className="!min-h-[300px] !p-0">
                {CARDS.map((c) => (
                  <TarotSpreadGrid.Card key={c.id} card={c}>
                    <TarotSpreadGrid.Back className="!bg-voynich-lapis">
                      <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--voynich-font-display)", fontSize: 54, color: "rgb(var(--voynich-gold-light))" }}>
                        {c.id}
                      </span>
                    </TarotSpreadGrid.Back>
                    <TarotSpreadGrid.Front />
                  </TarotSpreadGrid.Card>
                ))}
              </TarotSpreadGrid.Root>
            </div>
          </Cell>

          <Cell code="RadialMenu: Trigger asChild + Icon propio">
            <div className="voy-panel" style={{ width: 300, height: 220, display: "grid", placeItems: "center" }}>
              <RadialMenu.Root items={RADIAL} radius={80}>
                <RadialMenu.Trigger asChild>
                  <Button variant="outline" size="sm">Abrir</Button>
                </RadialMenu.Trigger>
                <RadialMenu.Menu>
                  {RADIAL.map((item) => (
                    <RadialMenu.Item key={item.id} item={item}>
                      <RadialMenu.Icon className="!w-12 !h-12 !text-2xl" />
                    </RadialMenu.Item>
                  ))}
                </RadialMenu.Menu>
              </RadialMenu.Root>
            </div>
          </Cell>

          <Cell code="ConfinementCircle: sin diagrama, un botón">
            <Button size="sm" onClick={() => setOpen(true)}>Abrir el diálogo</Button>
            <ConfinementCircle.Root isOpen={open} onClose={() => setOpen(false)}>
              <ConfinementCircle.Overlay>
                <ConfinementCircle.Dialog className="!max-w-[400px]">
                  <ConfinementCircle.Content className="!w-[70%] !h-[70%]">
                    <ConfinementCircle.Title>Sin adornos</ConfinementCircle.Title>
                    <ConfinementCircle.Body>Un diálogo con las partes que he querido.</ConfinementCircle.Body>
                    <ConfinementCircle.Dismiss>Entendido</ConfinementCircle.Dismiss>
                  </ConfinementCircle.Content>
                </ConfinementCircle.Dialog>
              </ConfinementCircle.Overlay>
            </ConfinementCircle.Root>
          </Cell>

          <Cell code="CinderDissolve: unstyled + layers + var(--dissolve-progress)">
            <CinderDissolve progress={0.45} unstyled layers={{ particles: false }} style={{ width: 240, height: 120 }}>
              <div className="voy-paper" style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "rgb(var(--voynich-ink))" }}>
                <span className="voy-label">Pergamino</span>
              </div>
            </CinderDissolve>
          </Cell>

          <Cell code="useDissolveProgress: solo el motor">
            <ProgressBar />
          </Cell>
        </div>
      </Stage>
    );
  },
};
