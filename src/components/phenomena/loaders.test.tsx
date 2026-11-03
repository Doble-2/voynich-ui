import { describe, it, expect, afterEach } from "vitest";
import { HomunculusVessel } from "./HomunculusVessel";
import { OuroborosSpinner } from "./OuroborosSpinner";
import { mount, unmount } from "../../test-utils";

afterEach(unmount);

describe("HomunculusVessel", () => {
  it("es una barra de progreso accesible", () => {
    const host = mount(<HomunculusVessel progress={42.4} label="Destilando" />);
    const bar = host.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute("aria-label")).toBe("Destilando");
    expect(bar.getAttribute("aria-valuenow")).toBe("42");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("dos frascos no comparten ids de SVG (antes uno pintaba con el gradiente del otro)", () => {
    const host = mount(
      <>
        <HomunculusVessel progress={10} />
        <HomunculusVessel progress={90} />
      </>,
    );
    const ids = [...host.querySelectorAll("[id]")].map((el) => el.id);
    expect(ids.length).toBe(6);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('motion="none" deja la superficie quieta', () => {
    const host = mount(<HomunculusVessel progress={50} motion="none" />);
    expect(host.querySelector('[role="progressbar"]')!.getAttribute("data-motion")).toBe("none");
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
