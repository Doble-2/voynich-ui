import { describe, it, expect, afterEach, vi } from "vitest";
import { createRef } from "react";
import { Button } from "./Button";
import { mount, unmount } from "../../test-utils";

afterEach(unmount);

describe("Button", () => {
  it("es type=button por defecto (no envía formularios sin querer)", () => {
    const host = mount(<Button>Firmar</Button>);
    expect(host.querySelector("button")?.type).toBe("button");
  });

  it("aplica el material de cada variante", () => {
    for (const [variant, cls] of [
      ["primary", "voy-btn--primary"],
      ["secondary", "voy-btn--secondary"],
      ["outline", "voy-btn--outline"],
    ] as const) {
      const host = mount(<Button variant={variant}>x</Button>);
      expect(host.querySelector("button")?.classList.contains(cls)).toBe(true);
    }
  });

  it("motion='none' (y el alias noAnimation) lo marcan como estático", () => {
    expect(mount(<Button motion="none">x</Button>).querySelector("button")?.dataset.motion).toBe("none");
    expect(mount(<Button noAnimation>x</Button>).querySelector("button")?.dataset.motion).toBe("none");
    expect(mount(<Button>x</Button>).querySelector("button")?.dataset.motion).toBeUndefined();
  });

  it("reenvía ref y eventos, y respeta disabled", () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    const host = mount(<Button ref={ref} onClick={onClick}>x</Button>);
    host.querySelector("button")!.click();
    expect(ref.current).toBe(host.querySelector("button"));
    expect(onClick).toHaveBeenCalledTimes(1);

    const off = vi.fn();
    mount(<Button disabled onClick={off}>x</Button>).querySelector("button")!.click();
    expect(off).not.toHaveBeenCalled();
  });
});
