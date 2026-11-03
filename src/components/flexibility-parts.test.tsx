import { describe, it, expect, afterEach, vi } from "vitest";
import { createRef, useState } from "react";
import { ConfinementCircle, useConfinementCircle } from "./rituals/ConfinementCircle";
import { RadialMenu } from "./rituals/RadialMenu";
import { WaxSealShatter, useWaxSeal, type WaxSealShatterRef } from "./artifacts/WaxSealShatter";
import { TarotSpreadGrid } from "./artifacts/TarotSpreadGrid";
import { CinderDissolve, useDissolveProgress } from "./phenomena/CinderDissolve";
import { mount, unmount, wait, waitFor, press, renderError } from "../test-utils";

afterEach(unmount);

describe("ConfinementCircle · partes y hook", () => {
  it("recompones el diálogo sin diagrama y con un solo botón, y sigue siendo accesible", async () => {
    const onClose = vi.fn();
    const host = mount(
      <ConfinementCircle.Root isOpen onClose={onClose}>
        <ConfinementCircle.Overlay>
          <ConfinementCircle.Dialog>
            <ConfinementCircle.Content>
              <ConfinementCircle.Title>Mi aviso</ConfinementCircle.Title>
              <ConfinementCircle.Body>Texto propio</ConfinementCircle.Body>
              <ConfinementCircle.Dismiss>Entendido</ConfinementCircle.Dismiss>
            </ConfinementCircle.Content>
          </ConfinementCircle.Dialog>
        </ConfinementCircle.Overlay>
      </ConfinementCircle.Root>,
    );
    expect(host.querySelector('[data-part="diagram"]')).toBeNull();
    expect(host.querySelectorAll("button").length).toBe(1);
    const dialog = host.querySelector('[role="dialog"]')!;
    expect(host.querySelector(`#${CSS.escape(dialog.getAttribute("aria-labelledby")!)}`)?.textContent).toBe("Mi aviso");
    await waitFor(() => host.contains(document.activeElement));
    host.querySelector<HTMLButtonElement>('[data-part="dismiss"]')!.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Confirm llama a onConfirm", () => {
    const onConfirm = vi.fn();
    const host = mount(
      <ConfinementCircle isOpen onClose={() => {}} onConfirm={onConfirm} confirmLabel="Sí">
        x
      </ConfinementCircle>,
    );
    host.querySelector<HTMLButtonElement>('[data-part="confirm"]')!.click();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("una parte fuera de Root da un error que dice qué hacer", () => {
    expect(renderError(<ConfinementCircle.Title>x</ConfinementCircle.Title>)).toMatch(/dentro de <ConfinementCircle\.Root>/);
  });

  it("useConfinementCircle da la mecánica a un diálogo dibujado a mano", async () => {
    const onClose = vi.fn();
    function Mine() {
      const d = useConfinementCircle({ isOpen: true, onClose });
      const { ref: oRef, style, ...o } = d.getOverlayProps();
      const { ref: dRef, ...dlg } = d.getDialogProps();
      return (
        <div ref={oRef} style={style} {...o} data-testid="overlay">
          <section ref={dRef} {...dlg}>
            <h2 id={d.titleId}>Hecho a mano</h2>
            <button>ok</button>
          </section>
        </div>
      );
    }
    const host = mount(<Mine />);
    expect(host.querySelector("section")!.getAttribute("role")).toBe("dialog");
    await waitFor(() => host.contains(document.activeElement));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("WaxSealShatter · partes y hook", () => {
  it("compones tu propio sello; Intro lo rompe, revela el contenido y cambia data-state", async () => {
    const onShatter = vi.fn();
    const ref = createRef<WaxSealShatterRef>();
    const host = mount(
      <WaxSealShatter.Root ref={ref} onShatter={onShatter} sealSize={80}>
        <WaxSealShatter.Trigger>
          <WaxSealShatter.Seal>
            <WaxSealShatter.Emblem>☉</WaxSealShatter.Emblem>
          </WaxSealShatter.Seal>
        </WaxSealShatter.Trigger>
        <WaxSealShatter.Particles />
        <WaxSealShatter.Content>El secreto</WaxSealShatter.Content>
      </WaxSealShatter.Root>,
    );
    const root = host.querySelector('[data-part="root"]')!;
    expect(root.getAttribute("data-state")).toBe("sealed");
    expect(host.querySelector('[data-part="emblem"]')!.textContent).toBe("☉");
    expect(host.querySelector('[data-part="hint"]')).toBeNull(); // sin Hint: no se pone

    press(host.querySelector('[data-part="trigger"]')!, "Enter");
    await waitFor(() => root.getAttribute("data-state") === "open");
    expect(onShatter).toHaveBeenCalledTimes(1);
    expect(host.querySelector('[data-part="trigger"]')).toBeNull(); // el Trigger solo existe con el sello intacto

    ref.current!.seal(); // y se puede volver a sellar desde fuera
    await waitFor(() => root.getAttribute("data-state") === "sealed");
    expect(host.querySelector('[data-part="trigger"]')).not.toBeNull();
  });

  it("Trigger acepta asChild: tu propio elemento", () => {
    const host = mount(
      <WaxSealShatter.Root>
        <WaxSealShatter.Trigger asChild>
          <button type="button">Romper</button>
        </WaxSealShatter.Trigger>
        <WaxSealShatter.Content>x</WaxSealShatter.Content>
      </WaxSealShatter.Root>,
    );
    const btn = host.querySelector("button")!;
    expect(btn.getAttribute("data-part")).toBe("trigger");
    expect(btn.getAttribute("aria-label")).toMatch(/Intro/);
  });

  it("useWaxSeal funciona sin ningún componente visual", async () => {
    function Mine() {
      const w = useWaxSeal({ label: "Abrir" });
      return (
        <div ref={w.containerRef}>
          <div ref={w.particlesRef} />
          <div ref={w.contentRef} data-testid="c" style={{ height: 0 }} />
          {w.isSealed && (
            <div ref={w.sealRef} data-testid="trigger" {...w.getTriggerProps()}>
              sello
            </div>
          )}
        </div>
      );
    }
    const host = mount(<Mine />);
    press(host.querySelector('[data-testid="trigger"]')!, "Enter");
    await waitFor(() => host.querySelector('[data-testid="trigger"]') === null);
  });
});

describe("TarotSpreadGrid · partes", () => {
  const cards = [
    { id: "a", title: "Escriba", description: "…" },
    { id: "b", title: "Gólem", description: "…" },
  ];

  it("la ref ahora apunta al contenedor (antes se ignoraba)", () => {
    const ref = createRef<HTMLDivElement>();
    mount(<TarotSpreadGrid ref={ref} cards={cards} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.getAttribute("data-part")).toBe("root");
  });

  it("con tus propias cartas: un reverso a medida y Intro gira la carta", async () => {
    const host = mount(
      <TarotSpreadGrid.Root cards={cards} spreadType="grid">
        {cards.map((c) => (
          <TarotSpreadGrid.Card key={c.id} card={c}>
            <TarotSpreadGrid.Back>
              <b data-testid="mi-reverso">reverso {c.id}</b>
            </TarotSpreadGrid.Back>
            <TarotSpreadGrid.Front />
          </TarotSpreadGrid.Card>
        ))}
      </TarotSpreadGrid.Root>,
    );
    expect(host.querySelectorAll('[data-testid="mi-reverso"]').length).toBe(2);
    expect(host.querySelector('[data-part="back"] svg')).toBeNull(); // no se pinta la estrella por defecto
    const card = host.querySelector<HTMLElement>('[data-card-id="a"]')!;
    expect(card.getAttribute("data-state")).toBe("back");
    press(card, "Enter");
    await waitFor(() => card.getAttribute("data-state") === "flipped");
    expect(card.getAttribute("aria-pressed")).toBe("true");
  });

  it("una carta fuera de Root da un error que dice qué hacer", () => {
    expect(renderError(<TarotSpreadGrid.Card card={cards[0]!} />)).toMatch(/dentro de <TarotSpreadGrid\.Root>/);
  });
});

describe("RadialMenu · partes", () => {
  const items = [
    { id: "a", label: "Alfa", icon: <span>A</span>, onClick: vi.fn() },
    { id: "b", label: "Beta", icon: <span>B</span>, onClick: vi.fn() },
  ];

  it("Trigger con asChild y un Item a medida; la ref abre el menú", async () => {
    const ref = createRef<{ open: () => void; close: () => void; toggle: () => void }>();
    const host = mount(
      <RadialMenu.Root ref={ref} items={items}>
        <RadialMenu.Trigger asChild>
          <button type="button">Abrir</button>
        </RadialMenu.Trigger>
        <RadialMenu.Menu>
          {items.map((item) => (
            <RadialMenu.Item key={item.id} item={item}>
              <RadialMenu.Icon className="mio" />
            </RadialMenu.Item>
          ))}
        </RadialMenu.Menu>
      </RadialMenu.Root>,
    );
    const trigger = host.querySelector('[data-part="trigger"]')!;
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(host.querySelector('[data-part="label"]')).toBeNull(); // sin Label: no se pinta
    expect(host.querySelector('[data-part="icon"].mio')!.textContent).toBe("A");

    ref.current!.open();
    await waitFor(() => trigger.getAttribute("aria-expanded") === "true");
    expect(host.querySelector('[data-part="root"]')!.getAttribute("data-state")).toBe("open");
    // un trigger propio (asChild) no debe girar de lado como el medallón por defecto
    await wait(900);
    expect(trigger.getAttribute("data-spin")).toBe("false");
    expect(new DOMMatrix(getComputedStyle(trigger).transform === "none" ? "matrix(1,0,0,1,0,0)" : getComputedStyle(trigger).transform).b).toBeCloseTo(0, 3);
  });

  it("un elemento fuera de Root da un error que dice qué hacer", () => {
    expect(renderError(<RadialMenu.Item item={items[0]!} />)).toMatch(/dentro de <RadialMenu\.Root>/);
  });

  it("en un contenedor bajo, los elementos NO se apilan (el arco ya no sale 0°)", async () => {
    // Contenedor de 300×220 y radio 80: el ángulo de partida (arriba) no cabe con el margen de 40 px.
    const ref = createRef<{ open: () => void; close: () => void; toggle: () => void }>();
    const host = mount(
      <div style={{ width: 300, height: 220, position: "relative", display: "grid", placeItems: "center" }}>
        <RadialMenu ref={ref} items={[...items, { id: "c", label: "Gamma", icon: <span>C</span> }]} radius={80} />
      </div>,
    );
    ref.current!.open();
    await waitFor(() => {
      const t = [...host.querySelectorAll<HTMLElement>('[data-part="item"]')].map((i) => i.style.transform);
      return t.length === 3 && t.every((x) => x.includes("translate"));
    });
    await wait(900); // fin de la animación elástica
    const positions = [...host.querySelectorAll<HTMLElement>('[data-part="item"]')].map((i) => i.style.transform);
    expect(new Set(positions).size).toBe(3);
    // y ninguno se sale del contenedor
    const box = host.firstElementChild!.getBoundingClientRect();
    host.querySelectorAll<HTMLElement>('[data-part="item"]').forEach((i) => {
      const r = i.getBoundingClientRect();
      expect(r.left).toBeGreaterThanOrEqual(box.left - 1);
      expect(r.right).toBeLessThanOrEqual(box.right + 1);
      expect(r.top).toBeGreaterThanOrEqual(box.top - 1);
      expect(r.bottom).toBeLessThanOrEqual(box.bottom + 1);
    });
  });
});

describe("CinderDissolve · progreso y capas", () => {
  it("useDissolveProgress: devuelve el progreso acotado y avisa onProgress / onComplete", async () => {
    const onProgress = vi.fn();
    const onComplete = vi.fn();
    let setP: (n: number) => void = () => {};
    function Probe() {
      const [p, setPState] = useState(0);
      setP = setPState;
      const { progress } = useDissolveProgress({ progress: p, onProgress, onComplete });
      return <i data-testid="p">{progress.toFixed(2)}</i>;
    }
    const host = mount(<Probe />);
    expect(host.querySelector('[data-testid="p"]')!.textContent).toBe("0.00");
    setP(0.5);
    await waitFor(() => host.querySelector('[data-testid="p"]')!.textContent === "0.50");
    expect(onComplete).not.toHaveBeenCalled();
    setP(7); // se acota a 1
    await waitFor(() => host.querySelector('[data-testid="p"]')!.textContent === "1.00");
    expect(onProgress).toHaveBeenCalledWith(1);
    expect(onComplete).toHaveBeenCalledTimes(1); // antes onComplete nunca se llamaba
  });

  it("expone el avance como atributo y variable CSS, y `unstyled` quita el aspecto por defecto", () => {
    const styled = mount(<CinderDissolve progress={0.4}>x</CinderDissolve>).firstElementChild as HTMLElement;
    expect(styled.getAttribute("data-progress")).toBe("0.40");
    expect(styled.getAttribute("data-state")).toBe("running");
    expect(styled.style.getPropertyValue("--dissolve-progress")).toBe("0.4");
    expect(styled.className).toContain("sepia");
    const plain = mount(<CinderDissolve progress={0.4} unstyled>x</CinderDissolve>).firstElementChild as HTMLElement;
    expect(plain.className).not.toContain("sepia");
  });

  it("`layers` apaga las capas decorativas", async () => {
    const on = mount(<CinderDissolve progress={0.5} style={{ width: 300, height: 200 }}>x</CinderDissolve>);
    await waitFor(() => on.querySelector('[data-part="particles"]') !== null && on.querySelector('[data-part="edge"]') !== null);
    const off = mount(
      <CinderDissolve progress={0.5} style={{ width: 300, height: 200 }} layers={{ particles: false, edge: false }}>
        x
      </CinderDissolve>,
    );
    await wait(150);
    expect(off.querySelector('[data-part="particles"]')).toBeNull();
    expect(off.querySelector('[data-part="edge"]')).toBeNull();
    expect(off.querySelector('[data-part="content"]')!.textContent).toBe("x");
  });
});
