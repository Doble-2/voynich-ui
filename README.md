<div align="center">

# Voynich UI

**La tecnología de hoy, como si hubiera aparecido en 1450.**

Componentes de React para contar historias en torno al manuscrito Voynich: puzzles que se descifran, sellos que se rompen, folios que se queman. Cada pieza es un artefacto que un artesano del siglo XV podría haber fabricado con pergamino, tinta, latón, cera o vidrio, y que se comporta como una interfaz moderna.

[Storybook](https://doble-2.github.io/voynich-ui) · [Lenguaje de diseño](./DESIGN.md)

</div>

---

## La idea

Lo que el steampunk hace con el siglo XIX, aplicado a la época del manuscrito Voynich (pergamino datado entre 1404 y 1438). Una pantalla es un astrolabio; una notificación, una glosa al margen; una carga, un uróboros; un cifrado, un sello de lacre.

Nada de neón, hologramas ni glitch: si un componente se puede describir como «futurista», no es de esta librería. El contrato completo (materiales, paleta medida sobre objetos reales, luz, movimiento) está en [`DESIGN.md`](./DESIGN.md).

## Componentes

Ordenados por lo que hacen en la historia.

### Leer: el códice
| Componente | Qué es |
|---|---|
| `IlluminatedDropcap` | Letra capital iluminada con pan de oro y lapislázuli |
| `MarginaliaNotes` | Tooltip convertido en glosa al margen, de otra mano |
| `TypewriterStutter` | Texto que se escribe como lo copiaría un escriba, con errores corregidos |
| `VellumTornSection` | Sección de pergamino con los bordes rasgados |

### Descifrar: puzzles y cifras
| Componente | Qué es |
|---|---|
| `RingPuzzle` | Disco de anillos concéntricos que se giran hasta alinearlos (como el disco de cifrado de Alberti, 1467) |
| `Cryptext` | Texto que aparece cifrado y se resuelve letra a letra |
| `FrequencyTuner` | Escala graduada de latón con un valor objetivo |
| `IncantationInput` | Campo de texto: la línea sobre la que escribe un escriba |

### Revelar: lo que está oculto
| Componente | Qué es |
|---|---|
| `WaxSealShatter` | Sello de lacre que se rompe para mostrar el contenido |
| `PalimpsestText` | Pergamino raspado y reescrito: alterna entre la capa antigua y la nueva |
| `InvisibleInkBlock` | Tinta que solo aparece al acercar la luz o el calor |
| `AuraLantern` | Luz que sigue al cursor y revela lo que hay en la oscuridad |
| `ScratchCard` | Capa de pan de oro u hollín que se raspa |
| `CinderDissolve` | Folio que arde y deja ver lo que hay debajo |
| `LensMagnifier` | Lupa de cristal sobre una imagen |
| `TarotSpreadGrid` | Cartas que se reparten boca abajo y se voltean |

### Actuar: botones y diálogos
| Componente | Qué es |
|---|---|
| `Button` | Tapa de libro en cuero con filete de oro estampado |
| `SacrificialButton` | Acción irreversible: la rúbrica sangra en el pergamino |
| `RadialMenu` | Menú circular que se despliega alrededor de un medallón |
| `ConfinementCircle` | Diálogo modal accesible, con un diagrama circular |

### Esperar: carga y progreso
| Componente | Qué es |
|---|---|
| `OuroborosSpinner` | Indicador de carga: la serpiente que se muerde la cola |
| `HomunculusVessel` | Barra de progreso: un matraz que se llena |

### Ambiente
| Componente | Qué es |
|---|---|
| `RefractiveFractal` | Tinta corrida y manchas de humedad sobre el pergamino |
| `LeyLineScroll` | Línea que se dibuja al hacer scroll |
| `AbyssParallax` | Capas a distinta profundidad al hacer scroll |

### Para construir los tuyos
`Surface` (los materiales: `paper`, `leather`, `rubric`, `bronze`, `gold`), `Slot`, `composeRefs`, `composeHandlers`, `createPartsContext` y los hooks sin dibujo (`useRingPuzzle`, `useRadialMenu`, `useConfinementCircle`, `useWaxSeal`, `useTarotSpread`, `useDissolveProgress`, `useReducedMotion`).

## Instalación

```bash
npm install voynich-ui react react-dom gsap @gsap/react
```

```tsx
import "voynich-ui/style.css";
```

Las fuentes (IM Fell English y Texturina, licencia SIL OFL) van incluidas en el paquete.

Funciona con React 18 y 19. Todos los componentes son de cliente: el paquete ya declara `"use client"`, así que se pueden importar desde Server Components de Next.js.

## Uso

```tsx
import { RingPuzzle, Cryptext } from "voynich-ui";
import "voynich-ui/style.css";

const rings = [
  { id: "exterior", radius: 180, thickness: 60, items: ["I", "II", "III", "IV"], initialRotation: 90, targetRotation: 0 },
  { id: "interior", radius: 120, thickness: 60, items: ["☉", "☽", "♂", "♀"], initialRotation: 180, targetRotation: 0 },
];

export function Cofre() {
  return (
    <>
      <Cryptext text="fachys ykal ar ataiin" />
      <RingPuzzle rings={rings} onSolve={({ rotations }) => abrirCofre(rotations)} />
    </>
  );
}
```

Si la solución no debe viajar al navegador, quita `targetRotation` y pasa un verificador: `verify={(rotations) => api.comprobar(rotations)}`.

## Personalización

Cada componente se puede recomponer, de menos a más control:

```tsx
// 1) Props
<Button variant="secondary">Sellar</Button>

// 2) Variables CSS: retoca el material sin tocar el componente
<Button style={{ "--voy-bg": "rgb(47 74 122)" }}>Lapislázuli</Button>

// 3) Partes: reordena, quita o sustituye piezas internas
<Button.Root variant="outline">
  <Button.Icon>✦</Button.Icon>
  <Button.Label>Sellar</Button.Label>
</Button.Root>

// 4) asChild: aplica el botón a tu propio elemento
<Button asChild><a href="/codex">Leer el códice</a></Button>

// 5) Sin dibujo: la mecánica del puzzle con tu propio diseño
const puzzle = useRingPuzzle({ rings, onSolve });
return (
  <div ref={puzzle.containerRef}>
    {puzzle.sortedRings.map((ring) => (
      <div key={ring.id} {...puzzle.getRingProps(ring)}>…tu dibujo…</div>
    ))}
  </div>
);
```

Cada parte lleva `data-part` y, si tiene estado, atributos como `data-solved` o `data-locked`: se pueden usar como selectores CSS. El contrato completo está en [`DESIGN.md` §10](./DESIGN.md#10-contrato-de-flexibilidad).

## Paleta y Tailwind

Los colores son variables CSS con canales RGB, así que se pueden cambiar sin tocar los componentes:

```css
:root { --voynich-vellum: 240 232 210; }
```

Para usarlos en tu Tailwind, añade el preset:

```js
// tailwind.config.js
import voynich from "voynich-ui/tailwind-preset";

export default {
  presets: [voynich],
  content: ["./src/**/*.{ts,tsx}"],
};
```

Clases disponibles: `voynich-vellum`, `voynich-inkDark`, `voynich-leather`, `voynich-brass`, `voynich-gold`, `voynich-vermilion`, `voynich-lapis`, `voynich-verdigris`, entre otras. Los valores y de qué objeto se midió cada uno están en [`DESIGN.md` §3](./DESIGN.md#3-paleta).

## Accesibilidad y movimiento

- Los componentes animados respetan `prefers-reduced-motion`. Los que tienen la prop `motion` permiten además forzarlo: `motion="none"` los deja estáticos.
- El texto animado (`Cryptext`, `TypewriterStutter`) expone siempre el texto real a los lectores de pantalla.
- Los controles funcionan con teclado y tienen roles ARIA (`dialog`, `menu`, `progressbar`, `status`…).

## Desarrollo

```bash
npm install
npm run storybook    # catálogo en localhost:6006
npm test             # tests en Chromium real (Vitest)
npx tsc --noEmit     # tipos
npm run build        # dist/
```

Antes de añadir o cambiar un componente, lee las reglas de contribución de [`DESIGN.md` §9](./DESIGN.md#9-reglas-de-contribución).

## Licencia

MIT © [Doble2](https://github.com/Doble-2)
