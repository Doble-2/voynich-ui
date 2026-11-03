import { describe, it, expect, afterEach, vi } from "vitest";
import { useState } from "react";
import { GraduatedScale } from "./GraduatedScale";
import { ScribeInput } from "./ScribeInput";
import { ConfinementCircle } from "./ConfinementCircle";
import { RadialMenu } from "./RadialMenu";
import { StrikeButton } from "./StrikeButton";
import { mount, unmount, wait, waitFor, press } from "../../test-utils";

afterEach(unmount);

describe("GraduatedScale", () => {
  it("se sintoniza en el punto medio real aunque min no sea 0", () => {
    // Antes comparaba con (max - min) / 2 = 50, que no es el centro de 100..200.
    const host = mount(<GraduatedScale min={100} max={200} value={150} />);
    expect(host.querySelector(".voy-tuner")?.getAttribute("data-tuned")).toBe("true");
    const off = mount(<GraduatedScale min={100} max={200} value={50 + 100} step={1} tunedValue={180} />);
    expect(off.querySelector(".voy-tuner")?.getAttribute("data-tuned")).toBe("false");
  });

  it("pasa las props nativas al input (antes se perdían)", () => {
    const host = mount(<GraduatedScale aria-label="Frecuencia del astrolabio" name="freq" />);
    const input = host.querySelector("input")!;
    expect(input.getAttribute("aria-label")).toBe("Frecuencia del astrolabio");
    expect(input.getAttribute("name")).toBe("freq");
    expect(input.getAttribute("aria-valuetext")).toMatch(/°/);
  });

  it("avisa onTuned al entrar en sintonía, pero no al montar ya sintonizado", async () => {
    const onTuned = vi.fn();
    let setExternal: (v: number) => void = () => {};
    const Wrapper = () => {
      const [v, setV] = useState(50);
      setExternal = setV;
      return <GraduatedScale value={v} tunedValue={50} onTuned={onTuned} />;
    };
    mount(<Wrapper />);
    await wait(20);
    expect(onTuned).not.toHaveBeenCalled();
    setExternal(20);
    await wait(20);
    setExternal(50);
    await waitFor(() => onTuned.mock.calls.length > 0);
    expect(onTuned).toHaveBeenCalledTimes(1);
    expect(onTuned).toHaveBeenCalledWith(50);
  });

  it("sigue al valor cuando se usa como componente controlado", async () => {
    let setExternal: (v: number) => void = () => {};
    const Wrapper = () => {
      const [v, setV] = useState(10);
      setExternal = setV;
      return <GraduatedScale value={v} />;
    };
    const host = mount(<Wrapper />);
    expect(host.querySelector("input")!.value).toBe("10");
    setExternal(80);
    await waitFor(() => host.querySelector("input")!.value === "80");
    expect(host.querySelector("input")!.value).toBe("80");
  });
});

describe("ScribeInput", () => {
  it("asocia el rótulo al campo y marca el error", () => {
    const host = mount(<ScribeInput label="Contraseña" error />);
    const input = host.querySelector("input")!;
    const label = host.querySelector("label")!;
    expect(label.getAttribute("for")).toBe(input.id);
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("llama a onChange al escribir", () => {
    const onChange = vi.fn();
    const host = mount(<ScribeInput onChange={onChange} />);
    const input = host.querySelector("input")!;
    // React sigue el valor con un "tracker": hay que asignar con el setter nativo.
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    setValue.call(input, "a");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(onChange).toHaveBeenCalled();
  });
});

describe("ConfinementCircle", () => {
  it("es un diálogo modal accesible con nombre", () => {
    const host = mount(<ConfinementCircle isOpen onClose={() => {}} title="Aviso del códice" />);
    const dialog = host.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    const labelId = dialog.getAttribute("aria-labelledby")!;
    expect(host.querySelector(`#${CSS.escape(labelId)}`)?.textContent).toBe("Aviso del códice");
  });

  it("se cierra con Escape y mete el foco dentro al abrir", async () => {
    const onClose = vi.fn();
    const host = mount(<ConfinementCircle isOpen onClose={onClose} />);
    await wait(80);
    expect(host.contains(document.activeElement)).toBe(true);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("atrapa el foco: Tab desde el último botón vuelve al primero", async () => {
    const host = mount(<ConfinementCircle isOpen onClose={() => {}} onConfirm={() => {}} />);
    await wait(80);
    const buttons = host.querySelectorAll<HTMLButtonElement>("button");
    const last = buttons[buttons.length - 1]!;
    last.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("cerrado, no está visible", async () => {
    const host = mount(<ConfinementCircle isOpen={false} onClose={() => {}} />);
    await wait(30);
    expect(getComputedStyle(host.firstElementChild!).display).toBe("none");
  });
});

describe("RadialMenu", () => {
  const items = [
    { id: "a", label: "Alfa", icon: <span>A</span>, onClick: vi.fn() },
    { id: "b", label: "Beta", icon: <span>B</span>, onClick: vi.fn() },
  ];

  it("cerrado, los elementos no se pueden pulsar ni enfocar (antes eran invisibles pero clicables)", () => {
    const host = mount(<RadialMenu items={items} icon="+" />);
    const entries = host.querySelectorAll<HTMLElement>('[role="menuitem"]');
    expect(entries.length).toBe(2);
    entries.forEach((el) => {
      expect(el.getAttribute("aria-hidden")).toBe("true");
      expect(el.tabIndex).toBe(-1);
      expect(el.style.pointerEvents).toBe("none");
    });
  });

  it("se abre con el teclado y cierra con Escape", async () => {
    const host = mount(<RadialMenu items={items} icon="+" />);
    const trigger = host.querySelector<HTMLElement>('[aria-haspopup="menu"]')!;
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    press(trigger, "Enter");
    await wait(30);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    host.querySelectorAll<HTMLElement>('[role="menuitem"]').forEach((el) => {
      expect(el.getAttribute("aria-hidden")).toBe("false");
      expect(el.tabIndex).toBe(0);
    });
    press(host.firstElementChild!, "Escape");
    await wait(30);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("StrikeButton", () => {
  it("anuncia su estado y avisa onSacrifice una sola vez", async () => {
    const onSacrifice = vi.fn();
    const host = mount(
      <StrikeButton label="Confirmar" sacrificedLabel="Hecho" onSacrifice={onSacrifice} />,
    );
    const btn = host.querySelector("button")!;
    expect(btn.getAttribute("aria-label")).toBe("Confirmar");
    btn.click();
    btn.click();
    await wait(30);
    expect(onSacrifice).toHaveBeenCalledTimes(1);
    expect(btn.getAttribute("aria-label")).toBe("Hecho");
  });

  it("dentro de un formulario no lo envía (antes era submit por defecto)", () => {
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    const host = mount(
      <form>
        <StrikeButton label="Borrar" />
      </form>,
    );
    host.querySelector("form")!.addEventListener("submit", onSubmit);
    host.querySelector("button")!.click();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("onClick con preventDefault cancela el sacrificio", async () => {
    const onSacrifice = vi.fn();
    const host = mount(
      <StrikeButton label="Borrar" onClick={(e) => e.preventDefault()} onSacrifice={onSacrifice} />,
    );
    const btn = host.querySelector("button")!;
    btn.click();
    await wait(20);
    expect(onSacrifice).not.toHaveBeenCalled();
    expect(btn.getAttribute("data-sacrificed")).toBe("false");
  });
});
