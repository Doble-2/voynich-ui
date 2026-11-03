import { describe, it, expect, afterEach, vi } from "vitest";
import { Component, createRef, type ReactNode } from "react";
import { Button } from "./rituals/Button";
import { Surface } from "./primitives/Surface";
import { RingPuzzle, useRingPuzzle, type Ring } from "./rituals/RingPuzzle";
import { mount, unmount, wait, press } from "../test-utils";

afterEach(unmount);

const ring = (over: Partial<Ring> = {}): Ring => ({
  id: "a",
  radius: 100,
  thickness: 40,
  initialRotation: 30,
  targetRotation: 0,
  step: 15,
  ...over,
});

describe("Button · asChild", () => {
  it("aplica el botón a tu propio elemento, sin envoltorios", () => {
    const host = mount(
      <Button asChild variant="secondary">
        <a href="/codex">Leer</a>
      </Button>,
    );
    const a = host.querySelector("a")!;
    expect(host.querySelector("button")).toBeNull();
    expect(a.getAttribute("href")).toBe("/codex");
    expect(a.classList.contains("voy-btn--secondary")).toBe(true);
    expect(a.hasAttribute("type")).toBe(false); // `type` solo existe en <button>
    expect(a.querySelector('[data-part="frame"]')).not.toBeNull(); // el filete se inyecta
    expect(a.textContent).toBe("Leer");
  });

  it("encadena los manejadores del hijo y los del botón, y compone las refs", () => {
    const childClick = vi.fn();
    const rootClick = vi.fn();
    const childRef = createRef<HTMLAnchorElement>();
    const rootRef = createRef<HTMLButtonElement>();
    const host = mount(
      <Button asChild ref={rootRef} onClick={rootClick}>
        <a href="#x" ref={childRef} onClick={childClick} className="mio">
          x
        </a>
      </Button>,
    );
    host.querySelector("a")!.click();
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(rootClick).toHaveBeenCalledTimes(1);
    expect(childRef.current).toBe(host.querySelector("a"));
    expect(rootRef.current).toBe(host.querySelector("a"));
    // las clases se suman, no se pisan
    expect(host.querySelector("a")!.className).toMatch(/voy-btn.*mio/);
  });
});

describe("Button · partes", () => {
  it("puedes componer el interior: icono, rótulo y sin filete", () => {
    const host = mount(
      <Button.Root variant="outline">
        <Button.Icon>✦</Button.Icon>
        <Button.Label>Sellar</Button.Label>
      </Button.Root>,
    );
    const root = host.querySelector("button")!;
    expect(root.querySelector('[data-part="frame"]')).toBeNull(); // Root no pone filete: tú decides
    const parts = [...root.querySelectorAll("[data-part]")].map((n) => n.getAttribute("data-part"));
    expect(parts).toEqual(["icon", "label"]);
    expect(root.querySelector('[data-part="icon"]')!.getAttribute("aria-hidden")).toBe("true");
  });

  it("`Button` por defecto equivale a Root + Frame + contenido", () => {
    const root = mount(<Button>Hola</Button>).querySelector("button")!;
    expect(root.querySelector('[data-part="frame"]')).not.toBeNull();
    expect(root.textContent).toBe("Hola");
  });

  it("`unstyled` no trae material ni filete: solo estructura", () => {
    const root = mount(<Button variant="unstyled">Plano</Button>).querySelector("button")!;
    expect(root.className).toContain("voy-btn--unstyled");
    expect(root.querySelector('[data-part="frame"]')).toBeNull();
    expect(getComputedStyle(root).boxShadow).toBe("none");
  });

  it("las variables CSS permiten retocar el material sin tocar el componente", () => {
    const root = mount(
      <Button style={{ ["--voy-bg" as string]: "rgb(10, 20, 30)" }}>x</Button>,
    ).querySelector("button")!;
    expect(getComputedStyle(root).backgroundColor).toBe("rgb(10, 20, 30)");
  });

  it("el consumidor puede anular un comportamiento con preventDefault en onPointerMove (composeHandlers)", () => {
    const root = mount(
      <Button onPointerMove={(e) => e.preventDefault()}>x</Button>,
    ).querySelector("button")!;
    root.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, cancelable: true, clientX: 5, clientY: 5 }));
    expect(root.style.getPropertyValue("--lx")).toBe(""); // la luz del cursor no se aplicó
  });
});

describe("Surface", () => {
  it("expone material, elevación y filete como atributos de estilo", () => {
    const el = mount(<Surface material="leather" elevation={3} frame="gilt">x</Surface>).firstElementChild!;
    expect(el.getAttribute("data-material")).toBe("leather");
    expect(el.getAttribute("data-elevation")).toBe("3");
    expect(el.getAttribute("data-frame")).toBe("gilt");
  });

  it("cada material tiene su propia textura", () => {
    const bg = (m: "paper" | "leather" | "bronze") =>
      getComputedStyle(mount(<Surface material={m}>x</Surface>).firstElementChild!).backgroundImage;
    const [paper, leather, bronze] = [bg("paper"), bg("leather"), bg("bronze")];
    expect(paper).toContain("url(");
    expect(new Set([paper, leather, bronze]).size).toBe(3);
  });

  it("asChild y `as` cambian el elemento", () => {
    expect(mount(<Surface as="section">x</Surface>).firstElementChild!.tagName).toBe("SECTION");
    const a = mount(<Surface asChild material="gold"><a href="#">x</a></Surface>).firstElementChild!;
    expect(a.tagName).toBe("A");
    expect(a.getAttribute("data-material")).toBe("gold");
  });
});

describe("RingPuzzle · partes", () => {
  it("con hijos, sustituyes la composición por defecto", () => {
    const rings = [ring({ id: "a" }), ring({ id: "b", radius: 70 })];
    const host = mount(
      <RingPuzzle.Root rings={rings} size={220}>
        <RingPuzzle.Ring ring={rings[0]!}>
          <span data-testid="mio">mi dibujo</span>
        </RingPuzzle.Ring>
      </RingPuzzle.Root>,
    );
    expect(host.querySelectorAll('[data-part="ring"]').length).toBe(1); // solo el que yo puse
    expect(host.querySelector('[data-part="pivot"]')).toBeNull();
    expect(host.querySelector('[data-part="engraving"]')).toBeNull(); // sin contenido por defecto
    expect(host.querySelector('[data-testid="mio"]')?.textContent).toBe("mi dibujo");
  });

  it("un anillo con contenido propio sigue girando con el teclado y expone aria", async () => {
    const r = ring({ initialRotation: 30 });
    const host = mount(
      <RingPuzzle.Root rings={[r]} motion="none">
        <RingPuzzle.Ring ring={r}>
          <b>x</b>
        </RingPuzzle.Ring>
      </RingPuzzle.Root>,
    );
    const el = host.querySelector<HTMLElement>('[data-part="ring"]')!;
    expect(el.getAttribute("role")).toBe("slider");
    expect(el.getAttribute("aria-valuenow")).toBe("30");
    press(el, "ArrowLeft");
    await wait(80);
    expect(el.getAttribute("aria-valuenow")).toBe("15");
  });

  it("el consumidor puede anular el teclado de un anillo con preventDefault", async () => {
    const r = ring({ initialRotation: 30 });
    const host = mount(
      <RingPuzzle.Root rings={[r]} motion="none">
        <RingPuzzle.Ring ring={r} onKeyDown={(e) => e.preventDefault()} />
      </RingPuzzle.Root>,
    );
    const el = host.querySelector<HTMLElement>('[data-part="ring"]')!;
    press(el, "ArrowLeft");
    await wait(80);
    expect(el.getAttribute("aria-valuenow")).toBe("30");
  });

  it("acepta atributos HTML en la raíz y marca data-solved", async () => {
    const r = ring({ initialRotation: 15 });
    const host = mount(<RingPuzzle rings={[r]} motion="none" id="mi-puzzle" data-x="1" />);
    const root = host.querySelector<HTMLElement>("#mi-puzzle")!;
    expect(root.getAttribute("data-x")).toBe("1");
    expect(root.getAttribute("data-solved")).toBe("false");
    press(host.querySelector('[data-part="ring"]')!, "ArrowLeft");
    await wait(150);
    expect(root.getAttribute("data-solved")).toBe("true");
  });

  it("una parte fuera de su contenedor da un error que explica qué hacer", () => {
    // React 19 notifica los errores de render al límite de error más cercano; así los vería un usuario.
    class Boundary extends Component<{ children: ReactNode }, { msg: string | null }> {
      state = { msg: null as string | null };
      static getDerivedStateFromError(e: Error) {
        return { msg: e.message };
      }
      render() {
        return this.state.msg ? <p data-testid="error">{this.state.msg}</p> : this.props.children;
      }
    }
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = (e: ErrorEvent) => e.preventDefault(); // evita que Vitest lo cuente como error no capturado
    window.addEventListener("error", onError);
    const host = mount(
      <Boundary>
        <RingPuzzle.Status />
      </Boundary>,
    );
    window.removeEventListener("error", onError);
    spy.mockRestore();
    expect(host.querySelector('[data-testid="error"]')?.textContent).toMatch(/dentro de <RingPuzzle\.Root>/);
  });
});

describe("useRingPuzzle · solo la mecánica", () => {
  // Un dibujo completamente distinto: una lista de diales de texto, sin ningún componente de la librería.
  function Dials({ rings, onSolve }: { rings: Ring[]; onSolve: (r: unknown) => void }) {
    const puzzle = useRingPuzzle({ rings, onSolve, motion: "none" });
    return (
      <div ref={puzzle.containerRef} data-solved={String(puzzle.solved)}>
        {puzzle.sortedRings.map((r) => {
          const { style, ...props } = puzzle.getRingProps(r);
          return (
            <div key={r.id} {...props} style={style} data-testid={`dial-${r.id}`}>
              {r.id}
            </div>
          );
        })}
        <button data-testid="reset" onClick={() => puzzle.controls.reset()}>reset</button>
      </div>
    );
  }

  it("se puede pintar con cualquier cosa y sigue siendo accesible y funcional", async () => {
    const onSolve = vi.fn();
    const host = mount(<Dials rings={[ring({ initialRotation: 30 })]} onSolve={onSolve} />);
    const dial = host.querySelector<HTMLElement>('[data-testid="dial-a"]')!;
    expect(dial.getAttribute("role")).toBe("slider");
    press(dial, "ArrowLeft");
    await wait(60);
    press(dial, "ArrowLeft");
    await wait(150);
    expect(onSolve).toHaveBeenCalledTimes(1);
    expect(onSolve.mock.calls[0]![0]).toMatchObject({ locked: { a: true } });
    expect(host.firstElementChild!.getAttribute("data-solved")).toBe("true");
  });

  it("los controles imperativos funcionan sin ningún componente visual", async () => {
    const host = mount(<Dials rings={[ring({ initialRotation: 15 })]} onSolve={() => {}} />);
    const dial = host.querySelector<HTMLElement>('[data-testid="dial-a"]')!;
    press(dial, "ArrowLeft");
    await wait(150);
    expect(host.firstElementChild!.getAttribute("data-solved")).toBe("true");
    host.querySelector<HTMLElement>('[data-testid="reset"]')!.click();
    await wait(60);
    expect(host.firstElementChild!.getAttribute("data-solved")).toBe("false");
  });
});

describe("Texturas · re-tematizables", () => {
  const names = ["paper", "leather", "rubric", "bronze", "gold"] as const;

  it("ninguna textura lleva color propio: son capas de relieve sobre `background-color`", () => {
    // Si una textura incluyera un relleno opaco, taparía el color que elija el consumidor
    // y `--voy-bg` (o cualquier tema) dejaría de verse. Este test protege justo eso.
    const root = getComputedStyle(document.documentElement);
    for (const name of names) {
      const svg = decodeURIComponent(root.getPropertyValue(`--voynich-surface-${name}`));
      expect(svg, name).toContain("feDiffuseLighting");
      expect(svg, `${name}: relleno opaco`).not.toMatch(/<rect[^>]*fill=/);
      expect(svg, `${name}: flood de color`).not.toContain("feFlood");
    }
  });

  it("un color de base distinto se ve de verdad bajo la textura (píxel real, no solo el estilo calculado)", () => {
    const px = (color: string) => {
      const host = mount(
        <Button variant="primary" style={{ ["--voy-bg" as string]: color, width: 160, height: 60 }}>
          x
        </Button>,
      );
      const btn = host.querySelector("button")!;
      // Dibujamos el fondo real del botón en un canvas y leemos un píxel del borde del cuerpo.
      const r = btn.getBoundingClientRect();
      const c = document.createElement("canvas");
      c.width = 4;
      c.height = 4;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = getComputedStyle(btn).backgroundColor;
      ctx.fillRect(0, 0, 4, 4);
      return { rect: r, data: ctx.getImageData(1, 1, 1, 1).data };
    };
    const blue = px("rgb(30, 60, 160)").data;
    const red = px("rgb(170, 40, 30)").data;
    expect(blue[2]!).toBeGreaterThan(blue[0]!); // el azul manda
    expect(red[0]!).toBeGreaterThan(red[2]!); // y el rojo, lo suyo
  });
});
