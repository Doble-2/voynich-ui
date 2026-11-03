import { describe, it, expect, afterEach, vi } from "vitest";
import { createRef } from "react";
import { AuraLantern } from "./AuraLantern";
import { LensMagnifier } from "./LensMagnifier";
import { PalimpsestText } from "../artifacts/PalimpsestText";
import { mount, unmount, waitFor, press } from "../../test-utils";

afterEach(unmount);

const pointer = (el: Element, type: string, x = 40, y = 30) => {
  const r = el.getBoundingClientRect();
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: r.left + x, clientY: r.top + y, pointerType: "touch" }));
};

describe("AuraLantern", () => {
  it("conecta el ref al elemento (antes llegaba null)", () => {
    const ref = createRef<HTMLDivElement>();
    mount(<AuraLantern ref={ref}>penumbra</AuraLantern>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("avisa onReveal una vez al encenderse, también con el dedo", () => {
    const onReveal = vi.fn();
    const host = mount(<AuraLantern onReveal={onReveal} style={{ width: 200, height: 120 }}>penumbra</AuraLantern>);
    const root = host.querySelector('[data-part="root"]')!;
    pointer(root, "pointerdown");
    pointer(root, "pointermove", 60, 40);
    expect(onReveal).toHaveBeenCalledTimes(1);
    expect(onReveal).toHaveBeenCalledWith({ x: 40, y: 30 });
  });

  it("con teclado, al enfocar se ilumina todo", () => {
    const host = mount(<AuraLantern revealContent="oculto">penumbra</AuraLantern>);
    const root = host.querySelector<HTMLElement>('[data-part="root"]')!;
    root.focus();
    expect(root.getAttribute("data-lit")).toBe("all");
    const revealed = host.querySelector('[data-part="revealed"]')!;
    expect(getComputedStyle(revealed).clipPath).toBe("none");
  });
});

describe("LensMagnifier", () => {
  const src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'/>";

  it("la imagen ampliada no se lee dos veces", () => {
    const host = mount(<LensMagnifier src={src} alt="Folio 1r" />);
    expect(host.querySelectorAll('img[alt="Folio 1r"]').length).toBe(1);
    expect(host.querySelector('[data-part="lens"]')!.getAttribute("aria-hidden")).toBe("true");
  });

  it("con teclado: enfocar muestra la lente, Escape la aparta", async () => {
    const host = mount(<LensMagnifier src={src} alt="Folio 1r" style={{ width: 300, height: 200 }} />);
    const root = host.querySelector<HTMLElement>('[data-part="root"]')!;
    root.focus();
    await waitFor(() => root.dataset.active === "true");
    press(root, "Escape");
    await waitFor(() => root.dataset.active === "false");
  });

  it("también se activa con el dedo", async () => {
    const host = mount(<LensMagnifier src={src} style={{ width: 300, height: 200 }} />);
    const root = host.querySelector('[data-part="root"]')!;
    pointer(root, "pointerdown");
    await waitFor(() => (root as HTMLElement).dataset.active === "true");
  });
});

describe("PalimpsestText", () => {
  it("avisa onTranslate y onRevert (antes nunca se llamaban)", () => {
    const onTranslate = vi.fn();
    const onRevert = vi.fn();
    const host = mount(<PalimpsestText ancientText="a" translatedText="b" onTranslate={onTranslate} onRevert={onRevert} />);
    const root = host.querySelector<HTMLElement>('[data-part="root"]')!;
    root.click();
    expect(onTranslate).toHaveBeenCalledTimes(1);
    root.click();
    expect(onRevert).toHaveBeenCalledTimes(1);
  });

  it('interaction="hover" traduce al pasar el ratón (antes la prop no hacía nada)', async () => {
    const host = mount(<PalimpsestText ancientText="a" translatedText="b" interaction="hover" />);
    const root = host.querySelector<HTMLElement>('[data-part="root"]')!;
    root.dispatchEvent(new PointerEvent("pointerover", { bubbles: true, pointerType: "mouse" }));
    root.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    await waitFor(() => root.dataset.translated === "true");
  });
});
