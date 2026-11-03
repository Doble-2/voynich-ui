import { describe, it, expect, afterEach } from "vitest";
import { Alembic } from "./Alembic";
import { OuroborosSpinner } from "./OuroborosSpinner";
import { mount, unmount } from "../../test-utils";

afterEach(unmount);

describe("Alembic", () => {
  it("es una barra de progreso accesible", () => {
    const host = mount(<Alembic progress={42.4} label="Destilando" />);
    const bar = host.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute("aria-label")).toBe("Destilando");
    expect(bar.getAttribute("aria-valuenow")).toBe("42");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("dos frascos no comparten ids de SVG (antes uno pintaba con el gradiente del otro)", () => {
    const host = mount(
      <>
        <Alembic progress={10} />
        <Alembic progress={90} />
      </>,
    );
    const ids = [...host.querySelectorAll("[id]")].map((el) => el.id);
    expect(ids.length).toBe(6);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('motion="none" deja la superficie quieta', () => {
    const host = mount(<Alembic progress={50} motion="none" />);
    expect(host.querySelector('[role="progressbar"]')!.getAttribute("data-motion")).toBe("none");
  });
});

describe("colores por variable CSS", () => {
  it("sin props usa los tokens de la paleta", () => {
    const host = mount(<Alembic progress={50} />);
    const outline = host.querySelectorAll("path")[4]!; // contorno del frasco
    expect(getComputedStyle(outline).stroke).toBe("rgb(191, 156, 80)"); // --voynich-brass-light
  });

  it("la prop de color sigue funcionando y se puede sobrescribir por CSS", () => {
    const host = mount(<OuroborosSpinner loadingColor="rgb(1, 2, 3)" />);
    const head = host.querySelector('circle[r="5"]')!;
    expect(getComputedStyle(head).fill).toBe("rgb(1, 2, 3)");

    const viaCss = mount(<OuroborosSpinner style={{ "--voy-snake": "rgb(4, 5, 6)" } as React.CSSProperties} />);
    expect(getComputedStyle(viaCss.querySelector('circle[r="5"]')!).fill).toBe("rgb(4, 5, 6)");
  });
});

describe("OuroborosSpinner", () => {
  it("se anuncia como estado ocupado", () => {
    const host = mount(<OuroborosSpinner label="Descifrando" />);
    const status = host.querySelector('[role="status"]')!;
    expect(status.getAttribute("aria-label")).toBe("Descifrando");
    expect(status.getAttribute("aria-busy")).toBe("true");
  });

  it("las escamas son deterministas (necesario para hidratar en SSR)", () => {
    const radii = () =>
      [...mount(<OuroborosSpinner />).querySelectorAll("circle")].map((c) => c.getAttribute("r")).join();
    expect(radii()).toBe(radii());
  });
});
