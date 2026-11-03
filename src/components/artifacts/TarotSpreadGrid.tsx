import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { composeHandlers, composeRefs } from "../../lib/compose";
import { createPartsContext } from "../../lib/context";
import { useTarotSpread, type TarotCard, type TarotSpreadType, type UseTarotSpreadOptions } from "./useTarotSpread";

export { useTarotSpread };
export type { TarotCard, TarotSpreadType, UseTarotSpreadOptions };

interface SpreadContext {
  spread: ReturnType<typeof useTarotSpread>;
}
const [SpreadProvider, useSpread] = createPartsContext<SpreadContext>("TarotSpreadGrid");

interface CardContext {
  card: TarotCard;
}
const [CardProvider, useCard] = createPartsContext<CardContext>("TarotSpreadGrid");

export interface TarotSpreadGridProps extends React.HTMLAttributes<HTMLDivElement>, Omit<UseTarotSpreadOptions, "cards"> {
  /** Las cartas de la tirada. */
  cards: TarotCard[];
}

/* ───────────────────────── Back / Front ───────────────────────── */

/** `TarotSpreadGrid.Back`: el reverso (cuero con una estrella de compás a pan de oro). Con hijos, dibujas el tuyo. */
const Back = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
  const { card } = useCard("Back");
  return (
    <div ref={ref} data-part="back" className={cn("voy-panel absolute inset-0 w-full h-full overflow-hidden [backface-visibility:hidden]", className)} {...props}>
      {children ?? (
        <>
          <svg viewBox="-50 -50 100 100" aria-hidden="true" className="absolute inset-0 m-auto w-24 h-24 pointer-events-none" fill="none" stroke="rgb(var(--voynich-gold))" strokeWidth="0.9" style={{ filter: "drop-shadow(0 1px 0 rgb(0 0 0 / 0.6))" }}>
            <circle r="44" />
            <circle r="38" strokeWidth="0.5" />
            <path d="M0-36 L8-8 L36 0 L8 8 L0 36 L-8 8 L-36 0 L-8-8Z" />
            <path d="M25-25 L5-5 M25 25 L5 5 M-25 25 L-5 5 M-25-25 L-5-5" strokeWidth="0.6" />
            <circle r="4" fill="rgb(var(--voynich-gold))" />
          </svg>
          {card.backImage}
        </>
      )}
    </div>
  );
});
Back.displayName = "TarotSpreadGrid.Back";

/** `TarotSpreadGrid.Front`: el anverso (papel con título, imagen y descripción). Con hijos, dibujas el tuyo. */
const Front = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, children, ...props }, ref) => {
  const { card } = useCard("Front");
  return (
    <div ref={ref} data-part="front" className={cn("voy-slip absolute inset-0 w-full h-full overflow-hidden [backface-visibility:hidden]", className)} style={{ transform: "rotateY(180deg)", ...style }} {...props}>
      {children ?? (
        <div className="flex flex-col h-full p-4 items-center justify-between text-center m-[5px] border border-voynich-inkDark/35 shadow-[inset_0_0_0_3px_rgb(var(--voynich-vellum-aged)),inset_0_0_0_4px_rgb(var(--voynich-ink)/0.2)]">
          <p className="voy-label text-[12.5px] border-b border-voynich-inkDark/25 pb-2 w-full">{card.title}</p>
          <div className="flex-1 w-full my-2 relative">{card.frontImage || <div className="absolute inset-0 bg-voynich-vellumDark mix-blend-multiply opacity-35" />}</div>
          <p className="font-manuscript italic text-[12.5px] leading-snug text-voynich-inkMedium h-12 w-full">{card.description}</p>
        </div>
      )}
    </div>
  );
});
Front.displayName = "TarotSpreadGrid.Front";

/* ───────────────────────── Card ───────────────────────── */

export interface TarotCardPartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** La carta que dibuja esta parte. */
  card: TarotCard;
  /** Si lo pasas, dibujas el interior (normalmente `TarotSpreadGrid.Back` y `TarotSpreadGrid.Front`). */
  children?: React.ReactNode;
}

/**
 * `TarotSpreadGrid.Card`
 *
 * Una carta que se reparte, se eleva y gira, y que ya es un control de teclado. El interior por defecto es
 * `Back` + `Front`; pasa tus propios hijos para dibujar otra cosa. Estado: `data-state="back" | "flipped"`.
 */
const CardPart = forwardRef<HTMLDivElement, TarotCardPartProps>(({ card, className, style, onClick, onKeyDown, children, ...props }, forwardedRef) => {
  const { spread } = useSpread("Card");
  const index = spread.indexOf(card);
  const { ref: behaviorRef, onClick: bClick, onKeyDown: bKey, style: bStyle, ...behavior } = spread.getCardProps(card, index);
  return (
    <CardProvider value={{ card }}>
      <div
        ref={composeRefs(behaviorRef, forwardedRef)}
        data-part="card"
        data-card-id={card.id}
        {...behavior}
        onClick={composeHandlers(onClick, bClick)}
        onKeyDown={composeHandlers(onKeyDown, bKey)}
        className={cn("relative w-40 h-64 cursor-pointer [transform-style:preserve-3d] transition-all rounded-[3px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4", className)}
        style={{ ...bStyle, ...style }}
        {...props}
      >
        <div data-part="card-inner" className="relative w-full h-full [transform-style:preserve-3d]" style={{ transformOrigin: "center center" }}>
          {children ?? (
            <>
              <Back />
              <Front />
            </>
          )}
        </div>
      </div>
    </CardProvider>
  );
});
CardPart.displayName = "TarotSpreadGrid.Card";

/* ───────────────────────── Root ───────────────────────── */

/**
 * `TarotSpreadGrid.Root`
 *
 * El contenedor de la tirada y su mecánica. Con hijos, compón tú las cartas; sin ellos dibuja una por cada
 * elemento de `cards`.
 */
const Root = forwardRef<HTMLDivElement, TarotSpreadGridProps>(({ className, cards, spreadType = "fan", motion, children, ...props }, ref) => {
  const spread = useTarotSpread({ cards, spreadType, motion });
  return (
    <SpreadProvider value={{ spread }}>
      <div ref={composeRefs(spread.containerRef, ref)} data-part="root" className={cn("relative min-h-[400px] flex items-center justify-center p-8 [perspective:1000px]", className)} {...props}>
        <div data-part="layout" className={cn("relative", spreadType === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "flex items-center justify-center")}>
          {children ?? cards.map((card) => <CardPart key={card.id} card={card} />)}
        </div>
      </div>
    </SpreadProvider>
  );
});
Root.displayName = "TarotSpreadGrid.Root";

/**
 * `TarotSpreadGrid`
 *
 * Una tirada de cartas que se reparten en abanico, cruz o rejilla y giran al pulsarlas.
 *
 * @example Por defecto
 * <TarotSpreadGrid cards={cards} spreadType="fan" />
 *
 * @example Tus propias cartas
 * <TarotSpreadGrid.Root cards={cards}>
 *   {cards.map((c) => (
 *     <TarotSpreadGrid.Card key={c.id} card={c}>
 *       <TarotSpreadGrid.Back>…tu reverso…</TarotSpreadGrid.Back>
 *       <TarotSpreadGrid.Front />
 *     </TarotSpreadGrid.Card>
 *   ))}
 * </TarotSpreadGrid.Root>
 */
export const TarotSpreadGrid = Object.assign(Root, { Root, Card: CardPart, Back, Front });
