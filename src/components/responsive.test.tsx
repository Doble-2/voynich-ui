import { describe, it, expect, afterEach } from "vitest";
import { RingPuzzle } from "./rituals/RingPuzzle";
import { ScratchCard } from "./artifacts/ScratchCard";
import { mount, unmount, waitFor } from "../test-utils";

afterEach(unmount);

const rings = [{ id: "a", radius: 180, thickness: 40, items: ["I", "II", "III", "IV"] }];

describe("en un contenedor estrecho (móvil)", () => {
  it("RingPuzzle se encoge entero al ancho del padre", async () => {
    const host = mount(
      <div style={{ width: 200 }}>
        <RingPuzzle rings={rings} size={400} />
      </div>,
    );
    const root = host.querySelector<HTMLElement>('[role="group"]')!;
    await waitFor(() => root.dataset.fit === "scaled");
    expect(Math.round(root.getBoundingClientRect().width)).toBe(200);
  });

  it("RingPuzzle no se agranda si cabe", async () => {
    const host = mount(
      <div style={{ width: 800 }}>
        <RingPuzzle rings={rings} size={400} />
      </div>,
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(host.querySelector<HTMLElement>('[role="group"]')!.getBoundingClientRect().width).toBe(400);
  });

  it("ScratchCard se encoge manteniendo la proporción", () => {
    const host = mount(
      <div style={{ width: 150 }}>
        <ScratchCard width={300} height={200}>premio</ScratchCard>
      </div>,
    );
    const card = host.firstElementChild!.firstElementChild!.getBoundingClientRect();
    expect(Math.round(card.width)).toBe(150);
    expect(Math.round(card.height)).toBe(100);
  });
});
