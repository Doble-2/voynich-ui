<div align="center">

# 📜 Voynich UI

**A mystical React component library inspired by the Voynich Manuscript**

*Medieval aesthetics. Modern performance. Occult interactions.*

[![React](https://img.shields.io/badge/React-18%20%7C%2019-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square&logo=greensock)](https://gsap.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ Overview

Voynich UI is a high-performance React component library that brings the mysterious beauty of the [Voynich Manuscript](https://en.wikipedia.org/wiki/Voynich_manuscript) to modern web interfaces. Every component is designed with direct DOM manipulation via GSAP for 60fps animations, without triggering React re-renders.

## 🏛️ Component Taxonomy

Components are organized into three thematic categories:

### ⚗️ Rituals — *Interactive Elements*
| Component | Description |
|-----------|-------------|
| `Button` | Themed button with occult hover effects |
| `RingPuzzle` | Rotational puzzle with snap-to-target mechanics |
| `RadialMenu` | Circular navigation menu with orbital items |
| `SacrificialButton` | Destructive action button with confirmation ritual |
| `IncantationInput` | Text input with mystical validation feedback |
| `FrequencyTuner` | Slider/knob control with resonance visualization |
| `ConfinementCircle` | Modal dialog with summoning circle animation |

### 🌌 Phenomena — *Visual Effects & Containers*
| Component | Description |
|-----------|-------------|
| `RefractiveFractal` | SVG noise filter wrapper with hover distortion |
| `CinderDissolve` | Element dissolution into ember particles |
| `LensMagnifier` | Image zoom lens with multiple visual filters |
| `HomunculusVessel` | Organic container with breathing animation |
| `AuraLantern` | Cursor-following reveal light effect |
| `LeyLineScroll` | Scroll-linked SVG path drawing |
| `AbyssParallax` | Multi-layer parallax depth effect |
| `OuroborosSpinner` | Infinite loading spinner |
| `VellumTornSection` | Content section with torn parchment edges |

### 📿 Artifacts — *Content Display*
| Component | Description |
|-----------|-------------|
| `Cryptext` | Text with character-level encryption reveal |
| `ScratchCard` | Canvas scratch-to-reveal interaction |
| `WaxSealShatter` | Breakable wax seal with particle physics |
| `PalimpsestText` | Layered text with erased/overwritten layers |
| `TarotSpreadGrid` | Card layout with flip and spread animations |
| `InvisibleInkBlock` | Hidden content revealed by interaction |
| `TypewriterStutter` | Typing effect with glitch/stutter mechanics |
| `IlluminatedDropcap` | Decorated initial letter with gold foil effect |
| `MarginaliaNotes` | Inline annotations with margin tooltips |

## 📦 Installation

```bash
npm install voynich-ui
```

### Peer Dependencies

```bash
npm install react react-dom
```

## 🚀 Quick Start

```tsx
import { ConfinementCircle, RingPuzzle, TypewriterStutter } from 'voynich-ui';
import 'voynich-ui/dist/style.css';

function App() {
  return (
    <div className="bg-[#050302] min-h-screen p-8">
      <TypewriterStutter
        text="The manuscript reveals its secrets..."
        speed={80}
      />
      
      <RingPuzzle
        size={400}
        rings={[
          { id: 'outer', radius: 180, thickness: 60, items: ['♈','♉','♊','♋'] },
          { id: 'inner', radius: 120, thickness: 60, items: ['🌑','🌓','🌕','🌗'] },
        ]}
        onSolve={() => console.log('Aligned!')}
      />
    </div>
  );
}
```

## 🎨 Design Tokens

Voynich UI ships with a Tailwind CSS theme extension. Register the tokens in your `tailwind.config.js`:

```js
import voynichConfig from 'voynich-ui/tailwind.config';

export default {
  presets: [voynichConfig],
  // ... your config
};
```

Available tokens:
- `voynich-vellum` — Aged parchment background
- `voynich-inkDark` — Deep manuscript ink
- `voynich-glow` — Teal mystical glow
- `voynich-blood` — Crimson accents
- `voynich-alchBrown` — Alchemical brown

## ⚡ Architecture

Voynich UI uses a **Ref-Proxy Pattern** for high-performance animations:

1. **No React re-renders** during animations — GSAP mutates the DOM directly via refs
2. **State proxies** — Numeric state lives in `useRef` objects, not `useState`
3. **GSAP cleanup** — All animations are scoped and cleaned up on unmount
4. **SSR-safe** — Uses `useId()` for deterministic ID generation

## 📖 Storybook

Explore all components interactively:

```bash
npm run storybook
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start Storybook
npm run storybook

# Type check
npx tsc --noEmit

# Build library
npm run build
```

## 📄 License

MIT © [Doble2](https://github.com/Doble2)
