import { describe, it, expect, afterEach, vi } from "vitest";
import { useState } from "react";
import { Latch } from "./rituals/Latch";
import { Codex, folioOf } from "./artifacts/Codex";
import { GlossProvider, useGloss } from "./artifacts/Gloss";
import { mount, unmount, wait, waitFor, press, renderError } from "../test-utils";

afterEach(unmount);

describe("Latch", () => {
  it("es un interruptor accesible que alterna", async () => {
    const onChange = vi.fn();
    const host = mount(<Latch onCheckedChange={onChange}>Glosas</Latch>);
    const sw = host.querySelector<HTMLButtonElement>('[role="switch"]')!;
    expect(sw.getAttribute("aria-checked")).toBe("false");
    expect(sw.textContent).toBe("Glosas");
    sw.click();
    await waitFor(() => sw.getAttribute("aria-checked") === "true");
    expect(onChange).toHaveBeenCalledWith(true);
    expect(sw.type).toBe("button");
  });

  it("controlado: no cambia solo", async () => {
    const host = mount(<Latch checked={false} onCheckedChange={() => {}} />);
    const sw = host.querySelector<HTMLButtonElement>('[role="switch"]')!;
    sw.click();
    await wait(20);
    expect(sw.getAttribute("aria-checked")).toBe("false");
  });
});

describe("Codex", () => {
  it("foliación recto/verso", () => {
    expect([0, 1, 2, 3].map(folioOf)).toEqual(["1r", "1v", "2r", "2v"]);
  });

  it("pasa de folio con los botones y con las flechas, y se detiene en los extremos", async () => {
    const onPage = vi.fn();
    const host = mount(
      <Codex motion="none" onPageChange={onPage}>
        <p>uno</p>
        <p>dos</p>
      </Codex>,
    );
    const folio = () => host.querySelector('[data-part="folio"]')!.textContent;
    const prev = host.querySelector<HTMLButtonElement>('[data-part="prev"]')!;
    const next = host.querySelector<HTMLButtonElement>('[data-part="next"]')!;
    expect(prev.disabled).toBe(true);
    expect(folio()).toContain("1r");
    next.click();
    await waitFor(() => folio()!.includes("1v"));
    expect(onPage).toHaveBeenCalledWith(1);
    expect(next.disabled).toBe(true);
    press(host.querySelector('[data-part="root"]')!, "ArrowLeft");
    await waitFor(() => folio()!.includes("1r"));
    expect(host.querySelector('[data-part="page"]')!.textContent).toBe("uno");
  });

  it("no roba las flechas a un campo de texto de la página", async () => {
    const host = mount(
      <Codex motion="none">
        <input aria-label="nota" />
        <p>dos</p>
      </Codex>,
    );
    press(host.querySelector("input")!, "ArrowRight");
    await wait(20);
    expect(host.querySelector('[data-part="folio"]')!.textContent).toContain("1r");
  });

  it("controlado: muestra la página que le dan", async () => {
    const Wrapper = () => {
      const [p, setP] = useState(1);
      return (
        <>
          <button id="ir" onClick={() => setP(0)}>ir</button>
          <Codex motion="none" page={p} onPageChange={setP}>
            <p>uno</p>
            <p>dos</p>
          </Codex>
        </>
      );
    };
    const host = mount(<Wrapper />);
    expect(host.querySelector('[data-part="page"]')!.textContent).toBe("dos");
    host.querySelector<HTMLButtonElement>("#ir")!.click();
    await waitFor(() => host.querySelector('[data-part="page"]')!.textContent === "uno");
  });
});

describe("Gloss", () => {
  const Writer = ({ opts }: { opts: Parameters<ReturnType<typeof useGloss>["gloss"]>[0] }) => {
    const { gloss } = useGloss();
    return <button id="w" onClick={() => gloss(opts)}>escribir</button>;
  };

  it("escribe en una región que se anuncia y se retira sola", async () => {
    const host = mount(
      <GlossProvider>
        <Writer opts={{ text: "Guardado", duration: 60 }} />
      </GlossProvider>,
    );
    host.querySelector<HTMLButtonElement>("#w")!.click();
    const live = document.querySelector('[aria-live="polite"]')!;
    await waitFor(() => live.textContent!.includes("Guardado"));
    await waitFor(() => !live.textContent!.includes("Guardado"), 2000);
  });

  it("se puede retirar a mano y no pasa del máximo", async () => {
    const host = mount(
      <GlossProvider max={2}>
        <Writer opts={{ text: "nota", duration: 0 }} />
      </GlossProvider>,
    );
    const w = host.querySelector<HTMLButtonElement>("#w")!;
    w.click();
    w.click();
    w.click();
    await waitFor(() => document.querySelectorAll(".voy-gloss-margin__item:not([data-closing])").length === 2);
    document.querySelector<HTMLButtonElement>('[data-part="dismiss"]:not([data-closing] *)')!.click();
    await waitFor(() => document.querySelectorAll(".voy-gloss-margin__item:not([data-closing])").length === 1);
  });

  it("useGloss fuera del proveedor explica qué hacer", () => {
    const Bad = () => {
      useGloss();
      return null;
    };
    expect(renderError(<Bad />)).toMatch(/GlossProvider/);
  });
});
