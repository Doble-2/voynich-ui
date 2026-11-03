# Laboratorio: repensar los componentes desde el problema

> Pregunta de partida: **si nadie hubiera inventado este componente, ¿cómo resolvería alguien el problema?**
> El Voynich no es medieval: es el rastro de una civilización que no conocemos, con convenciones propias.
> Su técnica parece hidráulica, botánica y astronómica, no mecánica; su escritura no se ha descifrado.

Este documento es una propuesta, no el contrato de diseño. Si se aprueba, se integrará en `DESIGN.md`.
Prototipos en Storybook: **Laboratorio → Sin botones**.

## Lo que descubrimos

Casi todos los componentes resuelven **cinco problemas de fondo**. Los componentes de hoy son atajos que esconden
el problema; las alternativas lo hacen visible.

| Problema de fondo | Lo que hacen hoy los componentes | Lo que esconden |
|---|---|---|
| **Cambiar el estado del mundo** | Botones, interruptores, menús, pestañas, diálogos de confirmación | Dónde estás, adónde puedes ir, si hay vuelta atrás |
| **Llegar a saber algo oculto** | Sellos, rascar, tinta invisible, hover, clic para traducir | Que el saber se *gana*; un gesto no es conocimiento |
| **Dar un valor al sistema** | Campos, deslizadores, ruedas | Qué valores tienen sentido y por qué |
| **Esperar** | Spinners, barras de progreso | Cuánto ha pasado, cuánto se esperaba, si algo va mal |
| **Enterarse de lo que pasó** | Notificaciones en una esquina | Dónde pasó y qué cambió |

## Primitivo 1 — Mapa de lugares y caminos *(prototipado)*

La interfaz es un mapa de estados, como la hoja de las rosetas del Voynich. Estás en un lugar; las acciones son los
caminos que salen de él, con el verbo escrito a lo largo. **Calzada** = se puede volver. **Río** = no hay vuelta atrás.
Lo imposible no está desactivado: no hay camino. Actuar es viajar; lo recorrido queda entintado (memoria e historial).

## Primitivo 2 — Desciframiento *(prototipado)*

El contenido oculto está escrito en un alfabeto desconocido. Se vuelve legible **cuando se sabe lo suficiente**:
cada palabra aprendida aparece encima como glosa interlineal, sin borrar el glifo. El saber se gana en otra parte
(recorriendo el mapa, resolviendo, leyendo), no con un gesto sobre el propio texto.

## Primitivo 3 — Medida por alineación *(propuesta)*

Un valor no se teclea ni se arrastra en el vacío: se **alinea** con algo del mundo (una estrella, una marca, otro
anillo). La escala muestra qué valores tienen sentido (las marcas) y por qué (con qué se alinean). `RingPuzzle` ya
es esto; la propuesta es que sea la forma general de introducir valores.

## Primitivo 4 — Marea *(propuesta)*

Esperar no es un círculo que gira sin decir nada. Es una marea que sube con el tiempo pasado, con una **franja de lo
esperado**: si el agua rebasa la franja, la espera ya es anómala y se ve. Honesto con la incertidumbre: muestra lo
transcurrido, no un porcentaje inventado.

## Primitivo 5 — Sedimento *(propuesta)*

Lo que pasa deja **poso en el lugar donde pasó**, no en una esquina de la pantalla. En el mapa, cada lugar acumula
estratos (lo que ocurrió allí y cuándo); el lector ve el historial donde importa.

## Componente por componente

| Componente actual | Problema que resuelve | Alternativa |
|---|---|---|
| `Button` | Cambiar de estado | Mapa: un lugar, un camino, otro lugar |
| `StrikeButton` | Acción irreversible | Mapa: el camino es un río |
| `ConfinementCircle` | Confirmar una acción grave | Desaparece: el río ya avisa antes de actuar |
| `Latch` | Alternar entre dos estados | Mapa: dos lugares unidos por una calzada |
| `RadialMenu` | Encontrar una acción entre muchas | Mapa: las acciones son caminos; muchos caminos = constelación |
| `Codex` (y pestañas, que faltaban) | Moverse por el contenido | Mapa de lugares (secciones) con caminos de lectura |
| `RingPuzzle` | Introducir una combinación | Ya es «alineación»: se mantiene como modelo |
| `GraduatedScale` | Elegir un valor | Alineación: la marca coincide con algo del mundo |
| `ScribeInput` | Escribir un valor | Pendiente de repensar (escribir sigue siendo escribir; ¿qué cambia en un alfabeto propio?) |
| `Cryptext` | Mostrar texto que se descifra | Desciframiento (sin animación de azar: se descifra al saber) |
| `WaxSealShatter` | Contenido protegido | Desciframiento: protegido = aún no legible |
| `PalimpsestText` | Dos capas de texto | Desciframiento: el texto antiguo es el glifo; la glosa, la lectura |
| `InvisibleInkBlock`, `AuraLantern` | Contenido oculto | Desciframiento |
| `ScratchCard` | Revelar con esfuerzo | Desciframiento: el esfuerzo es aprender, no rascar |
| `TarotSpreadGrid` | Descubrir elementos de un conjunto | Desciframiento de cada carta según lo aprendido |
| `CinderDissolve` | Destruir / revelar lo de debajo | Mapa: «quemar» es un río hacia un lugar sin retorno |
| `LensMagnifier` | Ver detalle | Se mantiene (ver de cerca no necesita otra solución) |
| `OuroborosSpinner`, `Alembic` | Esperar | Marea |
| `Gloss` | Avisar de lo que pasó | Sedimento en el lugar del suceso |
| `MarginaliaNotes` | Explicar algo en contexto | Se mantiene (la glosa al margen ya es la solución de esa civilización) |
| `IlluminatedDropcap`, `ScribeText`, `VellumTornSection`, `Surface` | Leer, materiales | Se mantienen como material |
| `RefractiveFractal`, `LeyLineScroll`, `AbyssParallax` | Ambiente | Se mantienen o se retiran; no resuelven un problema del usuario |

## Preguntas abiertas

- **Coste de aprendizaje.** Un mapa pide un instante de lectura que un botón no pide. ¿Para qué acciones compensa?
  Probablemente para las que tienen estado y consecuencias; un «cerrar» trivial quizá no necesite mapa.
- **Densidad.** Con muchas acciones, el mapa debe agruparse (constelaciones) o plegarse.
- **Accesibilidad.** Cada salida es un control de teclado con nombre («sellar: ir a Sellado, sin vuelta atrás»)
  y el lugar actual se anuncia. Falta probarlo con lectores de pantalla reales.
