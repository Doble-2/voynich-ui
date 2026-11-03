import { describe, it, expect, afterEach, vi } from "vitest";
import { TarotSpreadGrid } from "./TarotSpreadGrid";
import { PalimpsestText } from "./PalimpsestText";
import { InvisibleInkBlock } from "./InvisibleInkBlock";
import { MarginaliaNotes } from "./MarginaliaNotes";
import { WaxSealShatter } from "./WaxSealShatter";
import { ScribeText } from "./ScribeText";
import { IlluminatedDropcap } from "./IlluminatedDropcap";
import { ScratchCard } from "./ScratchCard";
import { VellumTornSection } from "../phenomena/VellumTornSection";
import { mount, unmount, wait, press } from "../../test-utils";

afterEach(unmount);

describe("TarotSpreadGrid", () => {
  const cards = [
    { id: "1", title: "El Escriba", description: "Quien copia." },
    { id: "2", title: "El Gólem", description: "Quien obedece." },
  ];

  it("las cartas son controles de teclado, no divs con onClick", async () => {
    const host = mount(<TarotSpreadGrid cards={cards} spreadType="grid" />);
    const els = host.querySelectorAll<HTMLElement>('[role="button"]');
    expect(els.length).toBe(2);
    expect(els[0]!.tabIndex).toBe(0);
    expect(els[0]!.getAttribute("aria-label")).toBe("El Escriba");
    expect(els[0]!.getAttribute("aria-pressed")).toBe("false");
    press(els[0]!, "Enter");
    await wait(30);
    expect(els[0]!.getAttribute("aria-pressed")).toBe("true");
  });
});

describe("PalimpsestText", () => {
  it("se traduce con el teclado y expone el estado", async () => {
    const host = mount(<PalimpsestText ancientText="Vetus" translatedText="Nuevo" />);
    const el = host.querySelector<HTMLElement>('[role="button"]')!;
    expect(el.getAttribute("aria-pressed")).toBe("false");
    press(el, " ");
    await wait(30);
    expect(el.getAttribute("aria-pressed")).toBe("true");
  });
});

describe("InvisibleInkBlock", () => {
  it("revela al enfocar con el teclado (modo hover)", async () => {
    const onReveal = vi.fn();
    const host = mount(<InvisibleInkBlock text="secreto" onReveal={onReveal} />);
    const el = host.firstElementChild as HTMLElement;
    expect(el.tabIndex).toBe(0);
    el.focus(); // foco real: React escucha `focusin`, no `focus`
    await wait(10);
    expect(onReveal).toHaveBeenCalled();
  });
});

describe("MarginaliaNotes", () => {
  it("la glosa está asociada al texto y es una nota", () => {
    const host = mount(<MarginaliaNotes note="Ver f. 12">entropía</MarginaliaNotes>);
    const trigger = host.querySelector<HTMLElement>("[aria-describedby]")!;
    const note = host.querySelector(`#${CSS.escape(trigger.getAttribute("aria-describedby")!)}`)!;
    expect(note.getAttribute("role")).toBe("note");
    expect(note.textContent).toBe("Ver f. 12");
  });

  it("trigger='click' ahora sí funciona (antes se ignoraba)", async () => {
    const host = mount(<MarginaliaNotes note="Nota" trigger="click">texto</MarginaliaNotes>);
    const note = host.querySelector<HTMLElement>('[role="note"]')!;
    host.firstElementChild!.dispatchEvent(new MouseEvent("mouseenter"));
    await wait(30);
    expect(getComputedStyle(note).visibility).toBe("hidden"); // el hover no abre en modo click
    (host.firstElementChild as HTMLElement).click();
    await wait(500);
    expect(getComputedStyle(note).visibility).toBe("visible");
  });
});

describe("WaxSealShatter", () => {
  it("se rompe con Intro sin exigir mantener pulsado", async () => {
    const onShatter = vi.fn();
    const host = mount(<WaxSealShatter onShatter={onShatter}>secreto</WaxSealShatter>);
    const seal = host.querySelector<HTMLElement>('[role="button"]')!;
    expect(seal.getAttribute("aria-label")).toMatch(/Intro/);
    press(seal, "Enter");
    await wait(30);
    expect(onShatter).toHaveBeenCalledTimes(1);
  });
});

describe("ScribeText", () => {
  it("el texto completo está siempre disponible para lectores de pantalla", () => {
    const host = mount(<ScribeText text="Liber Secundus" speed={5} />);
    expect(host.querySelector(".sr-only")?.textContent).toBe("Liber Secundus");
    expect(host.querySelector("[aria-hidden='true']")).not.toBeNull();
  });
});

describe("IlluminatedDropcap", () => {
  it("lee la letra y el texto como una sola frase", () => {
    const host = mount(<IlluminatedDropcap letter="E" text="n el año 1580" />);
    expect(host.querySelector("p")?.textContent).toBe("En el año 1580");
  });
});

describe("ScratchCard", () => {
  it("ofrece un botón accesible para revelar y avisa al terminar", async () => {
    const onComplete = vi.fn();
    const host = mount(
      <ScratchCard width={120} height={80} onComplete={onComplete}>
        <div>premio</div>
      </ScratchCard>,
    );
    expect(host.querySelector("canvas")?.getAttribute("aria-hidden")).toBe("true");
    host.querySelector<HTMLButtonElement>("button")!.click();
    await wait(900);
    expect(onComplete).toHaveBeenCalled();
  });
});

describe("VellumTornSection", () => {
  it("el rasgado es determinista: misma semilla = mismo borde (apto para SSR)", () => {
    const clip = (seed: number) => {
      const host = mount(<VellumTornSection seed={seed}>x</VellumTornSection>);
      return (host.querySelector(".voy-paper") as HTMLElement).style.clipPath;
    };
    expect(clip(3)).toBe(clip(3));
    expect(clip(3)).not.toBe(clip(4));
  });

  it("los bordes sin rasgar son rectos", () => {
    const host = mount(<VellumTornSection topTorn={false} bottomTorn={false} tearIntensity={0}>x</VellumTornSection>);
    expect((host.querySelector(".voy-paper") as HTMLElement).style.clipPath).not.toMatch(/NaN/);
  });
});
