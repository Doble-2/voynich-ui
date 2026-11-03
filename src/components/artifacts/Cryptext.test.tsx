import { describe, it, expect, afterEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { Cryptext } from "./Cryptext";

let root: Root | null = null;
let host: HTMLElement | null = null;

const mount = (ui: React.ReactElement) => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  flushSync(() => root!.render(ui));
  return host;
};

afterEach(() => {
  root?.unmount();
  host?.remove();
  root = host = null;
});

describe("Cryptext", () => {
  it("expone siempre el texto real a tecnologías de apoyo", () => {
    const el = mount(<Cryptext text="VOYNICH" motion="full" />);
    expect(el.querySelector(".sr-only")?.textContent).toBe("VOYNICH");
    expect(el.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("un style del usuario se suma al del componente (antes lo reemplazaba entero)", () => {
    const el = mount(<Cryptext text="VOYNICH" motion="none" style={{ color: "rgb(1, 2, 3)" }} />);
    const root = el.querySelector<HTMLElement>("[data-part='root']")!;
    expect(root.style.color).toBe("rgb(1, 2, 3)");
    expect(root.style.letterSpacing).toBe("0.12em");
  });

  it("con motion='none' muestra el texto revelado de inmediato y avisa onComplete", async () => {
    let done = false;
    const el = mount(<Cryptext text="VOYNICH" motion="none" onComplete={() => (done = true)} />);
    await new Promise((r) => setTimeout(r, 0));
    expect(el.querySelector("[aria-hidden='true']")?.textContent).toBe("VOYNICH");
    expect(done).toBe(true);
  });

  it("con motion='full' arranca cifrado (no muestra el texto claro al instante)", async () => {
    const el = mount(<Cryptext text="VOYNICHVOYNICH" motion="full" delay={5000} speed={10} />);
    await new Promise((r) => setTimeout(r, 120));
    expect(el.querySelector("[aria-hidden='true']")?.textContent).not.toBe("VOYNICHVOYNICH");
  });
});
