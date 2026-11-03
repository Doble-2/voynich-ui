import { describe, it, expect, afterEach, vi } from "vitest";
import { RingPuzzle, type RingPuzzleResult } from "./RingPuzzle";
import { mount, unmount, wait, press } from "../../test-utils";

afterEach(unmount);

const ringEl = (host: HTMLElement, id: string) =>
  host.querySelector<HTMLElement>(`[aria-label="Anillo ${id}"]`)!;

describe("RingPuzzle · contrato de resolución", () => {
  it("onSolve entrega la combinación final como dato", async () => {
    const onSolve = vi.fn<(r: RingPuzzleResult) => void>();
    const host = mount(
      <RingPuzzle
        motion="none"
        onSolve={onSolve}
        rings={[{ id: "a", radius: 100, thickness: 40, initialRotation: 30, targetRotation: 0, step: 15 }]}
      />,
    );
    const a = ringEl(host, "a");
    press(a, "ArrowLeft");
    await wait(60);
    press(a, "ArrowLeft");
    await wait(120);

    expect(onSolve).toHaveBeenCalledTimes(1);
    const result = onSolve.mock.calls[0]![0];
    expect(result.rotations.a).toBeCloseTo(0, 5);
    expect(result.locked.a).toBe(true);
  });

  it("verify resuelve sin que los anillos contengan la solución (sin targetRotation)", async () => {
    const onSolve = vi.fn<(r: RingPuzzleResult) => void>();
    const verify = vi.fn((rot: Record<string, number>) => Math.round(rot.a!) === 0);
    const host = mount(
      <RingPuzzle
        motion="none"
        onSolve={onSolve}
        verify={verify}
        rings={[{ id: "a", radius: 100, thickness: 40, initialRotation: 30, step: 15 }]}
      />,
    );
    const a = ringEl(host, "a");
    press(a, "ArrowLeft");
    await wait(80);
    expect(onSolve).not.toHaveBeenCalled(); // 15°: aún no

    press(a, "ArrowLeft");
    await wait(120);
    expect(verify).toHaveBeenCalled();
    expect(onSolve).toHaveBeenCalledTimes(1);
    expect(onSolve.mock.calls[0]![0].rotations.a).toBeCloseTo(0, 5);
  });

  it("verify asíncrono funciona y onSolve se emite una sola vez", async () => {
    const onSolve = vi.fn();
    const host = mount(
      <RingPuzzle
        motion="none"
        onSolve={onSolve}
        verify={async (rot) => Math.round(rot.a!) % 360 === 0}
        rings={[{ id: "a", radius: 100, thickness: 40, initialRotation: 15, step: 15 }]}
      />,
    );
    const a = ringEl(host, "a");
    press(a, "ArrowLeft"); // → 0
    await wait(120);
    press(a, "ArrowRight"); // → 15 (verify falso, pero ya está resuelto)
    await wait(80);
    press(a, "ArrowLeft"); // → 0 otra vez
    await wait(120);
    expect(onSolve).toHaveBeenCalledTimes(1);
  });

  it("pulsaciones rápidas de teclado no se pierden (con animación real)", async () => {
    // Sin motion="none": la animación dura 0,3 s y las pulsaciones se solapan.
    const host = mount(
      <RingPuzzle
        rings={[{ id: "a", radius: 100, thickness: 40, initialRotation: 90, step: 15 }]}
      />,
    );
    const a = ringEl(host, "a");
    for (let i = 0; i < 6; i++) {
      press(a, "ArrowLeft");
      await wait(40); // mucho menos que los 300 ms de la animación
    }
    await wait(700);
    expect(a.getAttribute("aria-valuenow")).toBe("0");
  });
});

describe("RingPuzzle · accesibilidad", () => {
  it("expone grupo, deslizadores con valor y anuncia la resolución", async () => {
    const host = mount(
      <RingPuzzle
        motion="none"
        label="Astrolabio"
        solvedLabel="Astrolabio alineado"
        rings={[{ id: "a", radius: 100, thickness: 40, initialRotation: 15, targetRotation: 0, step: 15 }]}
      />,
    );
    expect(host.querySelector('[role="group"]')?.getAttribute("aria-label")).toBe("Astrolabio");
    const a = ringEl(host, "a");
    expect(a.getAttribute("role")).toBe("slider");
    expect(a.getAttribute("aria-valuenow")).toBe("15");

    press(a, "ArrowLeft");
    await wait(150);
    expect(a.getAttribute("aria-valuenow")).toBe("0");
    expect(host.querySelector('[role="status"]')?.textContent).toBe("Astrolabio alineado");
  });

  it("un anillo encajado deja de ser operable", async () => {
    const host = mount(
      <RingPuzzle
        motion="none"
        rings={[{ id: "a", radius: 100, thickness: 40, initialRotation: 0, targetRotation: 0 }]}
      />,
    );
    const a = ringEl(host, "a");
    expect(a.getAttribute("role")).toBe("presentation");
    expect(a.getAttribute("data-locked")).toBe("true");
  });
});
