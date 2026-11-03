# Voynich UI — Lenguaje de diseño

> **La tecnología de hoy, como si hubiera aparecido en 1450.**
> Es lo que el steampunk hace con el siglo XIX, aplicado al siglo XV–XVI, la época del manuscrito Voynich (pergamino datado entre 1404 y 1438).

Este documento es el contrato de diseño de la librería. Todo componente, 2D o 3D, debe poder justificarse con él.

---

## 1. Principio rector

**Cada idea tecnológica se traduce a un artefacto de época. Nunca a un efecto sci-fi genérico.**

Si un componente se puede describir como "futurista", "neón" o "hologram", está mal. Debe poder describirse como un objeto que un artesano de 1450 habría podido fabricar con pergamino, tinta, metal, cera, madera o vidrio, y que se comporta como tecnología moderna.

### Tabla de traducción

| Tecnología actual | Versión 1450 |
|---|---|
| Pantalla / HUD | Astrolabio, esfera armilar, disco de latón grabado |
| Brillo de neón | Pigmento luminoso: verdigrís, lapislázuli, bermellón, pan de oro |
| Líneas de circuito | Grabado en cobre, rayado del pergamino, líneas de ley |
| Glitch / error | Mancha de tinta, humedad, palimpsesto raspado |
| Scanlines | Pautado del escriba (pinchazos y líneas de guía) |
| Notificación | Glosa al margen, nota de otra mano |
| Botón | Palanca de latón, sello de cera, pestillo |
| Terminal / cursor | Escritorio de escriba, pluma y tintero |
| Carga | Uróboros, engranaje de reloj |
| Cifrado / QR | Sello de lacre, carta cifrada diplomática |
| Datos en vivo | Autómata, reloj astronómico (Praga, 1410) |
| IA / robot | Gólem, homúnculo |

---

## 2. Materiales

Cada componente tiene **un material principal**. Es lo primero que se decide.

| Material | Se siente como | Ejemplos |
|---|---|---|
| **Pergamino** | Mate, con grano, absorbe la tinta, se rasga | `VellumTornSection`, `PalimpsestText`, `MarginaliaNotes` |
| **Tinta ferrogálica** | Negro-marrón que se oxida con el tiempo | `Cryptext`, `TypewriterStutter`, `InvisibleInkBlock` |
| **Latón / bronce** | Pesado, con holgura mecánica, brillo cálido | `RingPuzzle`, `RadialMenu`, `FrequencyTuner` |
| **Cuero y oro estampado** | Tapa de libro con filete de oro; grano que atrapa luz | `Button` |
| **Cera / lacre** | Opaco, se quiebra y se derrite | `WaxSealShatter`, `SacrificialButton` |
| **Pan de oro** | Reflectante, fino, se desprende | `IlluminatedDropcap` |
| **Cobre grabado** | Línea fina, hatching, densidad | `LeyLineScroll`, `RefractiveFractal` |
| **Vidrio / cristal** | Refracta, distorsiona | `LensMagnifier`, `AuraLantern` |
| **Ceniza / ascua** | Efímero, se dispersa | `CinderDissolve` |

---

## 3. Paleta

**Medida sobre objetos reales**, no inventada: un astrolabio de 1569 (Rennerus Arsenius, Musée des arts et métiers), la Biblia de Gutenberg y el propio manuscrito Voynich. Regla de oro: **nada saturado como en una pantalla**; los pigmentos de 1450 son apagados.

| Token | Qué es | Hex | Medido en |
|---|---|---|---|
| `vellum` | Papel | `#e4d9c7` | Gutenberg |
| `vellum-dark` | Pergamino | `#bfa387` | Voynich f1r |
| `ink` | Tinta ferrogálica | `#2f2921` | Gutenberg |
| `ink-deep` | Tinta cargada | `#1c1710` | — |
| `leather` | Cuero de encuadernación | `#2b1d14` | — |
| `brass` | Bronce-oliva (mate) | `#7a5510` | Astrolabio |
| `brass-light` | Brillo de borde (solo el ~8% de la superficie) | `#bf9c50` | Astrolabio |
| `brass-dark` / `brass-deep` | Fondo de grabado | `#422a04` / `#1c1406` | Astrolabio |
| `gold` / `gold-light` | Pan de oro, **solo detalles** | `#c8a55a` / `#dcc482` | — |
| `vermilion` | Rúbrica (terracota) | `#a34a33` | Gutenberg |
| `verdigris` / `glow` | Verdigrís apagado / claro | `#5a8a76` / `#7eaa96` | — |
| `lapis` | Lapislázuli apagado | `#2f4a7a` | — |
| `void` | Negro de humo | `#14100b` | — |

**Reglas**
- Nada de neón. Un brillo se logra con **luz sobre pigmento**, nunca con un color fluorescente.
- El oro es un acento, no un relleno: el latón real es oscuro y oliváceo.
- Sombras: solo las físicamente plausibles (contacto y elevación sutiles). Prohibidos los degradados con reflejo especular, los biseles brillantes y los resplandores.

---

## 4. Tipografía

Autoalojada en `src/fonts` (licencia SIL OFL) y distribuida en `dist/fonts`.

| Rol | Familia | Variable CSS |
|---|---|---|
| Texto corrido | IM Fell English (+ cursiva) | `--voynich-font-body` |
| Etiquetas, botones, rótulos | IM Fell English SC (versalitas, tracking `0.14em`) | `--voynich-font-sc` |
| Títulos | Texturina 600, de inspiración *textura* | `--voynich-font-display` |
| Datos | Por definir | — |
| Glifos | Alfabeto EVA | Lo aporta el integrador (ver §8) |

Una librería con la fuente por defecto del navegador **no está terminada**: la tipografía es parte del componente.

---

## 4a. Luz

**Una sola fuente de luz para toda la librería: arriba-izquierda** (azimut 225°, elevación 58°). Es lo que separa un material creíble de un degradado pintado.

- Las superficies (papel, cuero, rúbrica, bronce, oro) se generan con iluminación SVG real (`feDiffuseLighting`/`feSpecularLighting`) sobre un relieve de ruido: el grano **atrapa luz**, no es una mancha.
- Los bordes reciben luz arriba-izquierda (borde claro de 1 px) y dan sombra abajo-derecha. Las capas apiladas se **proyectan sombra** entre sí.
- Un resalte sigue al cursor sobre el metal y el filete dorado del botón. Es luz que se mueve, no un brillo estático pintado.
- Hover = **más luz** (`brightness`), nunca otro color.
- Lo prohibido sigue siendo el brillo *estático y pintado*: degradados con reflejo de plástico y resplandores de neón.

---

## 4b. Principios de oficio

1. **Una idea por pieza.** Un botón es *la tapa de un libro*, no un montón de efectos. Si hay hachura, doble filete, sombra y grano a la vez, sobra algo.
2. **Superficies con carácter.** Bronce con pátina, papel con fibra: variación **tonal fina**, no manchones ni ruido digital. Las vetas deben girar con el objeto.
3. **El grabado es de precisión.** Las escalas y reglas se dibujan en SVG con medidas exactas (graduación cada 2,5° y marca larga cada 15°).
4. **Cambio de material, no de brillo.** Un estado "activo" cambia el material (latón → pan de oro), no enciende una luz.
5. **Se valida mirando.** Cada pieza se revisa en una captura real contra una referencia, no solo con tipos y tests.

---

## 5. Movimiento

- **Mecánico, no digital.** Resortes, inercia, rebote con holgura, engranajes, escapes de reloj. Nada de fundidos lineales sin peso.
- **Todo tiene masa.** Latón pesa más que pergamino; cera se quiebra, no se desvanece.
- **Accesible.** Todo componente con movimiento respeta `prefers-reduced-motion` (hook `useReducedMotion`). Los bucles decorativos se vuelven estáticos y las revelaciones, instantáneas.
- **Prop `motion`.** `"auto" | "full" | "none"`. `"auto"` sigue al sistema.

---

## 6. Texturas

Grano de pergamino, poros, pliegues y manchas de humedad aplicados con **un único sistema** (filtros SVG o texturas compartidas), no efectos ad hoc por componente. Un componente nuevo reutiliza las texturas existentes.

---

## 7. Componentes 3D

La librería incluye componentes tridimensionales. Siguen el mismo principio: **artefactos físicos de 1450**, no figuras sci-fi.

### Candidatos

| Componente | Objeto | Para qué sirve en la historia |
|---|---|---|
| `ArmillarySphere` | Esfera armilar interactiva | Navegación, línea temporal, cielo |
| `Astrolabe3D` | Astrolabio con anillos giratorios | Versión 3D de `RingPuzzle` |
| `Codex3D` | Libro con páginas que se pasan | Contenedor de capítulos |
| `GolemBust` | Busto de arcilla que se anima | La "vida artificial" / IA |
| `WaxSeal3D` | Sello de lacre con relieve | Cifrado, desbloqueos |
| `Orrery` | Mecanismo planetario de engranajes | Hitos históricos y su cronología |
| `AutomatonClock` | Reloj astronómico con autómatas | Datos y tiempo |

### Reglas técnicas

1. **Entrada separada.** Los componentes 3D viven en `voynich-ui/3d`. El núcleo 2D **no** importa `three`. Quien solo quiere un botón no descarga 600 KB de motor 3D.
2. **Dependencias opcionales.** `three`, `@react-three/fiber` y `@react-three/drei` son **peerDependencies opcionales** (`peerDependenciesMeta.optional`), solo para `voynich-ui/3d`.
3. **Carga diferida.** Los componentes 3D se cargan con `React.lazy` y muestran un esqueleto 2D mientras tanto.
4. **Sin WebGL, sigue funcionando.** Cada componente 3D tiene un **fallback 2D** equivalente (imagen o SVG) cuando no hay WebGL o el usuario pide menos movimiento.
5. **Materiales coherentes.** Los materiales 3D usan los mismos pigmentos de §3, leídos de las variables CSS `--voynich-*`. Sin colores propios.
6. **Rendimiento.** Presupuesto: 60 fps en un portátil medio; pausar el render cuando el componente sale de pantalla; limitar `devicePixelRatio`.
7. **Accesibilidad.** Cada escena 3D expone un equivalente textual (`aria-label` o descripción) y es operable con teclado.
8. **Modelos propios y ligeros.** Preferir geometría procedural (anillos, engranajes, esferas) a modelos descargados. Los modelos externos, si existen, en `.glb` comprimido con licencia compatible con MIT.

---

## 8. Independencia entre librerías

`voynich-ui` y `voynich-crypto` son **piezas separadas** que sirven por sí solas.

- `voynich-ui` **no importa** `voynich-crypto`, ni a la inversa.
- La unión se hace en la aplicación, a través de puntos de enganche genéricos de la UI:
  - `onSolve({ key, ... })` en los puzzles, con el resultado como dato.
  - Una fuente de glifos o un transformador de texto inyectable en los componentes de texto.
- Un puzzle acepta un **verificador** que pasa el integrador; la UI no contiene la solución en claro.

---

## 9. Reglas de contribución

Todo componente nuevo o rediseñado cumple:

1. Tiene un **material principal** declarado (§2).
2. Usa **solo tokens** de §3, nunca hex sueltos.
3. Respeta `prefers-reduced-motion` y tiene `aria-*` donde corresponda.
4. Tiene una story en Storybook y al menos un test de comportamiento.
5. Si es 3D: cumple §7 completo.
6. Se puede explicar con la tabla de §1.

---

## 10. Contrato de flexibilidad

Una librería de componentes no es una galería de cajas cerradas: cada pieza debe poder **recomponerse**.
Todo componente cumple estas cinco capas, de menos a más control:

| Capa | Qué permite | Cómo |
|---|---|---|
| 1. **Props** | Los casos comunes | `variant`, `size`, `motion`… |
| 2. **Variables CSS** | Retocar el material sin tocar el componente | `style={{ '--voy-bg': … }}` o tu hoja de estilos |
| 3. **Partes** | Reordenar, quitar o sustituir piezas internas | `Button.Root` + `Button.Icon` + `Button.Label` |
| 4. **`asChild`** | Aplicar el comportamiento a *tu* elemento | `<Button asChild><a href>…</a></Button>` |
| 5. **Headless** | Usar la mecánica con tu propio dibujo | `useRingPuzzle()` |

**Reglas de construcción**

1. **Anatomía documentada.** Cada parte lleva `data-part="…"` y, si tiene estado, `data-locked`, `data-solved`, `data-motion`… Son el contrato de estilo: se pueden usar como selectores.
2. **Un `Root` y partes.** El componente por defecto es solo una composición de sus partes (`Button` = `Root` + `Frame` + contenido). Quien lo necesite compone las suyas.
3. **El consumidor siempre gana.** Los manejadores se encadenan con `composeHandlers` (si llamas a `preventDefault()`, el comportamiento base se cancela), las refs se componen, `className` y `style` se suman.
4. **Mecánica separada del dibujo.** La lógica compleja vive en un hook (`useRingPuzzle`) que devuelve *prop getters* (`getRingProps`); el componente visual solo lo usa.
5. **Los materiales son capas, no colores.** Una textura es relieve translúcido (luz y sombra) **sin color propio**; el color lo pone `background-color`. Así `--voy-bg` o cualquier tema se ve de verdad. Un test lo vigila.
6. **Los atributos HTML pasan.** Toda raíz acepta `id`, `style`, `data-*`, `aria-*` y manejadores.
7. **Errores que enseñan.** Una parte usada fuera de su contenedor lanza un error que dice qué hacer.

**Variables CSS del botón** (se leen en `.voy-btn`): `--voy-bg`, `--voy-bg-hover`, `--voy-surface`, `--voy-shade`, `--voy-edge`, `--voy-rule`, `--voy-rule-hot`, `--voy-lit`.
**Variables del `Surface`**: `--voy-surface`, `--voy-surface-color`, `--voy-surface-size`, `--voy-rule`, `--voy-text`.

**Estado de la migración**

| Componente | Partes | Hook headless | Estado |
|---|---|---|---|
| `Surface`, `Slot`, `composeRefs/Handlers`, `createPartsContext` | — | — | Hecho |
| `Button` | `Root`, `Frame`, `Icon`, `Label` + `asChild`, `unstyled` | — | Hecho |
| `RingPuzzle` | `Root`, `Ring`, `Engraving`, `Dividers`, `Items`, `Pivot`, `Glare`, `Status` | `useRingPuzzle` | Hecho |
| `ConfinementCircle` | `Root`, `Overlay`, `Dialog`, `Diagram`, `Content`, `Title`, `Body`, `Actions`, `Dismiss`, `Confirm` | `useConfinementCircle` | Hecho |
| `WaxSealShatter` | `Root`, `Trigger` (+`asChild`), `Seal`, `Emblem`, `Hint`, `Particles`, `Content` | `useWaxSeal` | Hecho |
| `TarotSpreadGrid` | `Root`, `Card`, `Back`, `Front` | `useTarotSpread` | Hecho |
| `RadialMenu` | `Root`, `Trigger` (+`asChild`), `Menu`, `Item`, `Icon`, `Label` | `useRadialMenu` | Hecho |
| `CinderDissolve` | `layers`, `unstyled`, `data-part`, `--dissolve-progress` | `useDissolveProgress` | Hecho (no se divide en partes: es un efecto, no una composición) |
| Los otros 18 | — | — | **Pendiente**: siguen siendo cajas cerradas |

Pendientes por orden de utilidad para la narrativa: `Cryptext`, `TypewriterStutter`, `PalimpsestText`, `InvisibleInkBlock`, `HomunculusVessel`, `IlluminatedDropcap`, `ScratchCard`, `LeyLineScroll`.

---

## 11. Plan de adopción

1. **Pilotos (primero).** Un componente estático (`Button`) y uno animado (`RingPuzzle` u `OuroborosSpinner`), rehechos con este lenguaje. Validar en Storybook.
2. **Tokens.** Sustituir la paleta actual por la de §3 y migrar los hex sueltos componente a componente.
3. **Piloto 3D.** `ArmillarySphere` o `WaxSeal3D`, con su fallback 2D, para validar la arquitectura de §7.
4. **Resto de componentes.** Migrar los 24 existentes por material.
5. **Componentes nuevos** para la narrativa (§7, candidatos).
