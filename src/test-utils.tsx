import { Component, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";

/** Utilidades mínimas para montar componentes en los tests de navegador. */
let root: Root | null = null;
let host: HTMLElement | null = null;

export const mount = (ui: React.ReactElement) => {
  unmount();
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  flushSync(() => root!.render(ui));
  return host;
};

export const unmount = () => {
  root?.unmount();
  host?.remove();
  root = host = null;
};

export const wait = (ms = 0) => new Promise((r) => setTimeout(r, ms));

export const press = (el: Element, key: string) =>
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

/**
 * Espera a que una condición se cumpla (sondeando) en lugar de dormir un tiempo fijo.
 * Los tiempos fijos fallan de forma intermitente cuando la máquina va cargada.
 */
export const waitFor = async (check: () => boolean, timeout = 2000, step = 10) => {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeout) throw new Error("waitFor: la condición no se cumplió a tiempo");
    await wait(step);
  }
};

/**
 * Monta algo que debe fallar al renderizar y devuelve el mensaje del error.
 * React 19 notifica los errores de render al límite más cercano, así que es como los ve un usuario.
 */
export const renderError = (ui: ReactNode): string | null => {
  class Boundary extends Component<{ children: ReactNode }, { msg: string | null }> {
    state = { msg: null as string | null };
    static getDerivedStateFromError(e: Error) {
      return { msg: e.message };
    }
    render() {
      return this.state.msg ? <p data-testid="error">{this.state.msg}</p> : this.props.children;
    }
  }
  const silence = (e: ErrorEvent) => e.preventDefault();
  window.addEventListener("error", silence);
  const origError = console.error;
  console.error = () => {};
  try {
    const host = mount(<Boundary>{ui}</Boundary>);
    return host.querySelector('[data-testid="error"]')?.textContent ?? null;
  } finally {
    console.error = origError;
    window.removeEventListener("error", silence);
  }
};
