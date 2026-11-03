import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "../components/rituals/Button";
import { RingPuzzle } from "../components/rituals/RingPuzzle";
import { AstrolabeRete } from "../components/phenomena/AstrolabeRete";

const meta = {
  title: "Introducción/Scriptorium",
  parameters: {
    layout: "fullscreen",
    bare: true,
    docs: {
      description: {
        component:
          "Composición de referencia del lenguaje visual: una sola luz cálida desde arriba-izquierda, pergamino con fibra, cuero, bronce y oro. Sirve para juzgar el conjunto, no solo cada pieza.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/** Rúbrica: palabra marcada en terracota, como en la Biblia de Gutenberg. */
const R: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: "rgb(var(--voynich-vermilion))" }}>{children}</span>
);

/** Contorno de pergamino irregular (determinista): puntos con pequeña desviación en cada lado. */
const roughEdge = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pts: string[] = [];
  const N = 16;
  for (let i = 0; i <= N; i++) pts.push(`${((i / N) * 100).toFixed(2)}% ${(rnd() * 0.7).toFixed(2)}%`);
  for (let i = 1; i <= N; i++) pts.push(`${(100 - rnd() * 0.5).toFixed(2)}% ${((i / N) * 100).toFixed(2)}%`);
  for (let i = N - 1; i >= 0; i--) pts.push(`${((i / N) * 100).toFixed(2)}% ${(100 - rnd() * 0.7).toFixed(2)}%`);
  for (let i = N - 1; i >= 1; i--) pts.push(`${(rnd() * 0.5).toFixed(2)}% ${((i / N) * 100).toFixed(2)}%`);
  return `polygon(${pts.join(",")})`;
})();

const Bokeh = () => (
  <>
    {[
      [7, 12, 70, 0.22], [15, 4, 38, 0.18], [4, 30, 46, 0.14], [26, 9, 30, 0.2],
      [92, 8, 54, 0.12], [86, 22, 34, 0.1], [95, 40, 62, 0.09],
    ].map(([x = 0, y = 0, s = 0, a = 0], i) => (
      <div
        key={i}
        aria-hidden
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: s,
          height: s,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgb(255 205 130 / ${a * 2}) 0%, rgb(255 175 90 / ${a}) 55%, transparent 72%)`,
          filter: "blur(5px)",
          pointerEvents: "none",
        }}
      />
    ))}
  </>
);

export const Scriptorium: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        minHeight: 800,
        overflow: "hidden",
        backgroundColor: "rgb(80 56 36)",
        backgroundImage:
          "radial-gradient(ellipse 120% 90% at 42% 40%, transparent 30%, rgb(3 5 7 / 0.94) 100%), radial-gradient(ellipse 55% 65% at 16% 8%, rgb(176 108 40 / 0.5) 0%, transparent 65%), var(--voynich-surface-leather)",
        backgroundSize: "auto, auto, 240px 240px",
      }}
    >
      {/* Baño de luz de vela común: une página, bronce y mesa bajo la misma luz. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 6,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 62% 74% at 14% 6%, rgb(255 196 120 / 0.34) 0%, transparent 68%)",
          mixBlendMode: "overlay",
        }}
      />
      <Bokeh />

      {/* Página de pergamino */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          top: 92,
          width: 560,
          transform: "rotate(-1.4deg)",
          filter: "drop-shadow(2px 4px 3px rgb(0 0 0 / 0.4)) drop-shadow(20px 38px 28px rgb(0 0 0 / 0.55))",
          zIndex: 2,
        }}
      >
      <article
        className="voy-paper"
        style={{
          padding: "46px 52px 40px 60px",
          clipPath: roughEdge,
          color: "rgb(var(--voynich-ink))",
          fontFamily: "var(--voynich-font-body)",
          // Envejecido: bordes más oscuros y una mancha cálida, como un pergamino manipulado.
          boxShadow:
            "inset 0 0 70px rgb(140 96 44 / 0.34), inset 24px -30px 80px rgb(120 80 30 / 0.16), inset 2px 2px 0 rgb(255 250 235 / 0.5)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--voynich-font-sc)",
            letterSpacing: "0.32em",
            fontSize: 12,
            color: "rgb(var(--voynich-ink-medium))",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          LIBER · SECVNDVS
        </p>
        <h2
          style={{
            fontFamily: "var(--voynich-font-display)",
            fontWeight: 600,
            fontSize: 34,
            lineHeight: 1.05,
            textAlign: "center",
            color: "rgb(var(--voynich-vermilion))",
            margin: "0 0 26px",
          }}
        >
          De Golem et Machina
        </h2>

        <div style={{ position: "relative", fontSize: 19.5, lineHeight: 1.5, textAlign: "justify", hyphens: "auto" }}>
          {/* Capital iluminada: lapislázuli, oro y filete */}
          <span
            aria-hidden
            style={{
              float: "left",
              width: 88,
              height: 88,
              margin: "4px 14px 4px 0",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--voynich-font-display)",
              fontWeight: 600,
              fontSize: 76,
              lineHeight: 1,
              color: "rgb(var(--voynich-gold-light))",
              textShadow: "0 -1px 0 rgb(0 0 0 / 0.5), 0 1px 0 rgb(255 240 200 / 0.18)",
              background:
                "radial-gradient(circle at 30% 25%, rgb(70 104 160) 0%, rgb(var(--voynich-lapis)) 55%, rgb(28 46 82) 100%)",
              boxShadow:
                "inset 0 0 0 3px rgb(28 46 82), inset 0 0 0 4px rgb(var(--voynich-gold)), inset 0 0 0 7px rgb(28 46 82), inset 0 0 0 8px rgb(var(--voynich-gold) / 0.55), 2px 4px 5px rgb(0 0 0 / 0.4)",
            }}
          >
            E
          </span>
          <span className="sr-only">E</span>
          n el año <R>MDLXXX</R>, en las orillas del Moldava, un rabino amasó barro con sus manos y le dio
          forma de hombre. Bajo la lengua de la figura escondió un pergamino con un{" "}
          <R>nombre</R> que ningún escriba debía pronunciar. El gólem abrió los ojos: <em>obedecía, pero no
          comprendía</em>. Aquella fue la primera máquina que hizo un artesano a imagen de quien la
          mandaba, y también la primera en recordarle lo poco que sabía de sí mismo.
        </div>

        <p
          style={{
            marginTop: 14,
            fontSize: 15.5,
            fontStyle: "italic",
            color: "rgb(var(--voynich-ink-medium))",
            borderLeft: "1px solid rgb(var(--voynich-ink-medium) / 0.4)",
            paddingLeft: 12,
          }}
        >
          Glosa: lo que se anima con una palabra puede apagarse con otra.
        </p>

        <div style={{ display: "flex", gap: 18, marginTop: 30, justifyContent: "center" }}>
          <Button variant="primary">Despertar al gólem</Button>
          <Button variant="outline">Leer la glosa</Button>
        </div>
      </article>
      </div>

      {/* Astrolabio sobre la mesa, proyectando sombra sobre la página */}
      <div style={{ position: "absolute", left: "47.5%", top: 168, zIndex: 3, filter: "drop-shadow(22px 46px 34px rgb(0 0 0 / 0.55))" }}>
        <RingPuzzle
          size={520}
          label="Astrolabio del gólem"
          rings={[
            {
              id: "outer",
              radius: 250,
              thickness: 84,
              items: ["☿", "♀", "♁", "♂", "♃", "♄", "♅", "♆"],
              initialRotation: 90,
              targetRotation: 0,
              itemOrientation: "upright",
              engraveText: "SOL · LVNA · MERCVRIVS · VENVS · MARS · IVPITER · SATVRNVS",
              step: 15,
            },
            {
              id: "inner",
              radius: 164,
              thickness: 84,
              items: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ"],
              initialRotation: 45,
              targetRotation: 0,
              step: 15,
              bgContent: <AstrolabeRete radius={164} innerRadius={74} />,
            },
          ]}
        />
      </div>
    </div>
  ),
};
