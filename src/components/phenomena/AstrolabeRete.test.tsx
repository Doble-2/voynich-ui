import { describe, it, expect, afterEach } from "vitest";
import { AstrolabeRete } from "./AstrolabeRete";
import { mount, unmount } from "../../test-utils";

afterEach(unmount);

describe("AstrolabeRete", () => {
  it("es decorativo: oculto a tecnologías de apoyo", () => {
    const svg = mount(<AstrolabeRete radius={120} />).querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  it("dibuja un par de volutas por pétalo y una estrella central", () => {
    const svg = mount(<AstrolabeRete radius={120} petals={6} />).querySelector("svg")!;
    // 6 pétalos × 2 volutas + 1 estrella
    expect(svg.querySelectorAll(".voy-rete__metal path").length).toBe(6 * 2 + 1);
  });

  it("el lienzo mide el doble del radio y está centrado en el origen", () => {
    const svg = mount(<AstrolabeRete radius={150} />).querySelector("svg")!;
    expect(svg.getAttribute("viewBox")).toBe("-150 -150 300 300");
  });

  it("genera contornos válidos (sin NaN) para cualquier tamaño", () => {
    for (const radius of [40, 120, 400]) {
      const host = mount(<AstrolabeRete radius={radius} />);
      host.querySelectorAll(".voy-rete__metal path").forEach((p) => {
        expect(p.getAttribute("d")).not.toMatch(/NaN|undefined/);
      });
    }
  });
});
