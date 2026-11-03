import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import * as Lib from "../index";
import { mount, unmount } from "../test-utils";

afterEach(unmount);

const ring = { id: "a", radius: 80, thickness: 30, items: ["I", "II"] };

/**
 * Props mínimas para montar cada componente exportado. Si añades un componente, añádelo aquí: el test
 * de abajo falla si alguno queda fuera, para que ninguno se escape del contrato.
 */
const MINIMAL: Record<string, Record<string, unknown>> = {
  Button: { children: "x" },
  RingPuzzle: { rings: [ring], size: 200 },
  RadialMenu: { items: [] },
  StrikeButton: {},
  ScribeInput: {},
  GraduatedScale: {},
  ConfinementCircle: { isOpen: true, onClose: () => {} },
  RefractiveFractal: { children: "x" },
  CinderDissolve: { children: "x", animate: false },
  LensMagnifier: { src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=" },
  Alembic: {},
  AuraLantern: {},
  LeyLineScroll: {},
  AbyssParallax: { layers: [] },
  OuroborosSpinner: {},
  VellumTornSection: {},
  Cryptext: { text: "x" },
  ScratchCard: {},
  WaxSealShatter: {},
  PalimpsestText: { ancientText: "a", translatedText: "b" },
  TarotSpreadGrid: { cards: [] },
  InvisibleInkBlock: { text: "x" },
  ScribeText: { text: "x" },
  IlluminatedDropcap: { letter: "E", text: "x" },
  MarginaliaNotes: { note: "n", children: "x" },
  Surface: {},
};

// Partes y alias, no componentes con ref propia.
const SKIP = new Set(["Slot", "AstrolabeRete", "FrequencyTuner", "IncantationInput", "SacrificialButton", "HomunculusVessel", "TypewriterStutter"]);

const components = Object.entries(Lib).filter(
  ([name, v]) => /^[A-Z]/.test(name) && !SKIP.has(name) && (typeof v === "function" || (typeof v === "object" && v && "$$typeof" in v)),
);

describe("contrato de refs", () => {
  it("todos los componentes exportados están en la lista", () => {
    expect(components.map(([n]) => n).filter((n) => !(n in MINIMAL))).toEqual([]);
  });

  it.each(components)("%s entrega su ref (antes varios la ignoraban)", (name, Comp) => {
    const ref = React.createRef<unknown>();
    mount(React.createElement(Comp as React.ElementType, { ...MINIMAL[name], ref }));
    expect(ref.current, `${name}: ref.current es null`).not.toBeNull();
  });
});
