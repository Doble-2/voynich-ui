import React, { useMemo, useRef, useState } from "react";
import { InkFilters, useInkId } from "./ink";

/**
 * PROTOTIPO — Raíces (moverse por una jerarquía).
 *
 * Un árbol de carpetas no distingue lo explorado de lo que no, y las «migas de pan» son un parche para saber dónde
 * estás. Aquí la jerarquía crece hacia abajo desde la superficie, como las raíces del herbario: lo más general,
 * arriba; lo más concreto, en la punta. Las ramas abiertas están entintadas; las cerradas solo se insinúan con un
 * brote. El camino desde la superficie hasta lo elegido queda en tinta cargada: es, a la vez, dónde estás y cómo
 * llegaste.
 */
export interface RootNode {
  id: string;
  label: string;
  children?: RootNode[];
}

type Laid = { n: RootNode; x: number; y: number; depth: number; parent: string | null };

export function Roots({ tree, label, width = 640, onSelect }: { tree: RootNode[]; label: string; width?: number; onSelect?: (n: RootNode) => void }) {
  const id = useInkId();
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [sel, setSel] = useState<string | null>(null);
  const refs = useRef<Record<string, SVGGElement | null>>({});

  // Disposición: las hojas visibles se reparten a lo ancho; cada nodo abierto se centra sobre sus hijos.
  const { laid, height } = useMemo(() => {
    const out: Laid[] = [];
    let slot = 0;
    let maxDepth = 0;
    const visit = (n: RootNode, depth: number, parent: string | null): number => {
      maxDepth = Math.max(maxDepth, depth);
      const kids = open.has(n.id) ? n.children ?? [] : [];
      const xs = kids.map((c) => visit(c, depth + 1, n.id));
      const x = xs.length ? (xs[0]! + xs[xs.length - 1]!) / 2 : slot++;
      out.push({ n, x, y: depth, depth, parent });
      return x;
    };
    tree.forEach((n) => visit(n, 0, null));
    const span = Math.max(1, slot - 1);
    const pad = 60;
    return {
      laid: out.map((l) => ({ ...l, x: slot === 1 ? width / 2 : pad + (l.x / span) * (width - pad * 2), y: 120 + l.depth * 86 })),
      height: 120 + maxDepth * 86 + 50,
    };
  }, [tree, open, width]);

  const byId = Object.fromEntries(laid.map((l) => [l.n.id, l]));
  // El linaje del nodo elegido (de la superficie a la punta).
  const lineage = new Set<string>();
  for (let c = sel; c; c = byId[c]?.parent ?? null) lineage.add(c);
  // Orden de lectura para el teclado: recorrido en profundidad de lo visible.
  const order: string[] = [];
  const walk = (ns: RootNode[]) => ns.forEach((n) => (order.push(n.id), open.has(n.id) && walk(n.children ?? [])));
  walk(tree);

  const toggle = (n: RootNode) => n.children?.length && setOpen((o) => { const s = new Set(o); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; });
  const choose = (n: RootNode) => { setSel(n.id); toggle(n); onSelect?.(n); };
  const focusId = (k: string | undefined) => k && refs.current[k]?.focus();

  const onKey = (l: Laid) => (e: React.KeyboardEvent) => {
    const i = order.indexOf(l.n.id);
    const has = !!l.n.children?.length;
    if (e.key === "ArrowDown") focusId(order[i + 1]);
    else if (e.key === "ArrowUp") focusId(order[i - 1]);
    else if (e.key === "ArrowRight") has && !open.has(l.n.id) ? toggle(l.n) : focusId(l.n.children?.[0]?.id);
    else if (e.key === "ArrowLeft") has && open.has(l.n.id) ? toggle(l.n) : focusId(l.parent ?? undefined);
    else if (e.key === "Enter" || e.key === " ") choose(l.n);
    else return;
    e.preventDefault();
  };

  // Raíz desde un punto a otro: cae casi vertical y se curva al final, como una raíz que busca.
  const rootPath = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    `M${a.x} ${a.y + 10} C${a.x} ${a.y + 50} ${b.x} ${b.y - 50} ${b.x} ${b.y - 12}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="lab-roots" role="tree" aria-label={label}>
      <InkFilters id={id} />
      {/* La superficie y el tallo de donde sale todo */}
      <g filter={`url(#${id}-pen)`} className="lab-roots__ink">
        <path d={`M20 30 C${width * 0.3} 27 ${width * 0.6} 33 ${width - 20} 29`} />
        <path d={`M${width / 2} 30 C${width / 2 - 3} 18 ${width / 2 + 4} 10 ${width / 2} 2`} />
        {laid.filter((l) => l.depth === 0).map((l) => (
          <path key={`s-${l.n.id}`} d={rootPath({ x: width / 2, y: 20 }, l)} className="lab-roots__root" data-lineage={lineage.has(l.n.id) || undefined} />
        ))}
        {laid.filter((l) => l.parent).map((l) => (
          <path key={`r-${l.n.id}`} d={rootPath(byId[l.parent!]!, l)} className="lab-roots__root" data-lineage={lineage.has(l.n.id) || undefined} />
        ))}
      </g>
      {laid.map((l) => {
        const has = !!l.n.children?.length;
        const isOpen = open.has(l.n.id);
        return (
          <g
            key={l.n.id}
            ref={(el) => void (refs.current[l.n.id] = el)}
            role="treeitem"
            tabIndex={order[0] === l.n.id || sel === l.n.id ? 0 : -1}
            aria-level={l.depth + 1}
            aria-expanded={has ? isOpen : undefined}
            aria-selected={sel === l.n.id}
            aria-label={l.n.label}
            className="lab-roots__node"
            data-lineage={lineage.has(l.n.id) || undefined}
            data-selected={sel === l.n.id || undefined}
            transform={`translate(${l.x} ${l.y})`}
            onClick={() => choose(l.n)}
            onKeyDown={onKey(l)}
          >
            <circle r="26" className="lab-roots__hit" />
            <g filter={`url(#${id}-pen)`}>
              {/* Nódulo: un bulbo pequeño; si tiene descendencia sin abrir, un brote de raicillas debajo. */}
              <ellipse rx="7" ry="5.5" className="lab-roots__bulb" />
              {has && !isOpen && <path d="M-3 5 q-2 7 -5 10 M0 5.5 q0 7 1 12 M3 5 q3 6 6 9" className="lab-roots__sprout" />}
            </g>
            <text y="-12" className="lab-roots__label">{l.n.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
