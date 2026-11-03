import React, { forwardRef, useImperativeHandle } from "react";
import { cn } from "../../lib/utils";
import { Slot } from "../../lib/Slot";
import { composeHandlers, composeRefs } from "../../lib/compose";
import { createPartsContext } from "../../lib/context";
import { useRadialMenu, type RadialMenuItem, type RadialMenuRef, type UseRadialMenuOptions } from "./useRadialMenu";

export { useRadialMenu };
export type { RadialMenuItem, RadialMenuRef, UseRadialMenuOptions };

interface MenuContext {
  menu: ReturnType<typeof useRadialMenu>;
  icon: React.ReactNode;
  centerNode?: React.ReactNode;
  buttonClassName?: string | undefined;
  items: RadialMenuItem[];
}
const [MenuProvider, useMenu] = createPartsContext<MenuContext>("RadialMenu");

interface ItemContextValue {
  item: RadialMenuItem;
}
/** Contexto "suave" (no lanza si falta): `Icon` y `Label` también funcionan sueltos, con sus propios hijos. */
const ItemContext = React.createContext<ItemContextValue | null>(null);

export interface RadialMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">, UseRadialMenuOptions {
  /** Icono del elemento central. @default "+" */
  icon?: React.ReactNode;
  /** Sustituye por completo el elemento central. */
  centerNode?: React.ReactNode;
  /** Clases extra para el medallón central por defecto. */
  buttonClassName?: string;
  /** Si lo pasas, **sustituye la composición por defecto**: compón tú `Trigger` y `Menu`. */
  children?: React.ReactNode;
}

/* ───────────────────────── Trigger ───────────────────────── */

export interface RadialTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aplica el comportamiento a tu propio elemento. @default false */
  asChild?: boolean;
}

/**
 * `RadialMenu.Trigger`
 *
 * El elemento central que abre y cierra el menú. Sin hijos, dibuja el medallón de latón con el icono;
 * con hijos (o `asChild`), el centro es tuyo y conserva el rol de botón, el teclado y `aria-expanded`.
 */
const Trigger = forwardRef<HTMLDivElement, RadialTriggerProps>(({ asChild = false, className, onClick, onKeyDown, children, ...props }, ref) => {
  const { menu, icon, centerNode, buttonClassName } = useMenu("Trigger");
  const { ref: triggerRef, onClick: bClick, onKeyDown: bKey, ...behavior } = menu.getTriggerProps();
  const Comp = (asChild ? Slot : "div") as React.ElementType;
  return (
    <Comp
      ref={composeRefs(triggerRef, ref)}
      data-part="trigger"
      data-state={menu.isOpen ? "open" : "closed"}
      data-spin={asChild || children || centerNode ? "false" : "true"}
      {...behavior}
      aria-label="Abrir menú"
      className={cn("relative z-20 cursor-pointer rounded-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4", className)}
      onClick={composeHandlers(onClick, bClick)}
      onKeyDown={composeHandlers(onKeyDown, bKey)}
      {...props}
    >
      {children ?? centerNode ?? <div className={cn("voy-medallion w-14 h-14 text-xl", buttonClassName)}>{icon}</div>}
    </Comp>
  );
});
Trigger.displayName = "RadialMenu.Trigger";

/* ───────────────────────── Icon / Label ───────────────────────── */

/** `RadialMenu.Icon`: el medallón de latón de un elemento. Dentro de un `Item`, muestra el icono del elemento. */
const Icon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(ItemContext);
  return (
    <div ref={ref} data-part="icon" className={cn("voy-medallion w-11 h-11 text-lg", className)} {...props}>
      {children ?? ctx?.item.icon}
    </div>
  );
});
Icon.displayName = "RadialMenu.Icon";

/** `RadialMenu.Label`: la nota de pergamino que aparece bajo un elemento al señalarlo o enfocarlo. */
const Label = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(ItemContext);
  return (
    <div
      ref={ref}
      data-part="label"
      className={cn("voy-slip absolute top-[3.1rem] whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity text-[13px] italic px-2.5 py-1", className)}
      style={{ fontFamily: "var(--voynich-font-body)" }}
      {...props}
    >
      {children ?? ctx?.item.label}
    </div>
  );
});
Label.displayName = "RadialMenu.Label";

/* ───────────────────────── Item / Menu ───────────────────────── */

export interface RadialItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** El elemento que dibuja esta parte. */
  item: RadialMenuItem;
  /** Si lo pasas, dibujas el interior (por defecto, `Icon` y `Label`). */
  children?: React.ReactNode;
}

/**
 * `RadialMenu.Item`
 *
 * Un elemento del menú: ya viene colocado en el abanico, animado y accesible (`role="menuitem"`).
 * Cerrado, no se puede pulsar ni enfocar. Estado: `data-state="open" | "closed"`.
 */
const Item = forwardRef<HTMLDivElement, RadialItemProps>(({ item, className, style, onClick, onKeyDown, children, ...props }, forwardedRef) => {
  const { menu, items } = useMenu("Item");
  const index = items.findIndex((i) => i.id === item.id);
  const { ref: itemRef, onClick: bClick, onKeyDown: bKey, style: bStyle, ...behavior } = menu.getItemProps(item, index);
  return (
    <ItemContext.Provider value={{ item }}>
      <div
        ref={composeRefs(itemRef, forwardedRef)}
        data-part="item"
        data-item-id={item.id}
        data-state={menu.isOpen ? "open" : "closed"}
        {...behavior}
        onClick={composeHandlers(onClick, bClick)}
        onKeyDown={composeHandlers(onKeyDown, bKey)}
        className={cn("absolute z-10 origin-center cursor-pointer opacity-0 rounded-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4", className)}
        style={{ ...bStyle, ...style }}
        {...props}
      >
        <div className="flex flex-col items-center justify-center group">
          {children ?? (
            <>
              {item.icon && <Icon />}
              {item.label && <Label />}
            </>
          )}
        </div>
      </div>
    </ItemContext.Provider>
  );
});
Item.displayName = "RadialMenu.Item";

/** `RadialMenu.Menu`: agrupa los elementos con `role="menu"` sin afectar a la maquetación. */
const Menu = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <div ref={ref} data-part="menu" role="menu" aria-label="Opciones" className={cn("contents", className)} {...props}>
    {children}
  </div>
));
Menu.displayName = "RadialMenu.Menu";

/* ───────────────────────── Root ───────────────────────── */

/**
 * `RadialMenu.Root`
 *
 * El contenedor y la mecánica del menú. Con hijos, compón tú `Trigger` y `Menu` (con `Item`s); sin ellos
 * dibuja la composición por defecto. `ref` expone `open()`, `close()` y `toggle()`.
 */
const Root = forwardRef<RadialMenuRef, RadialMenuProps>(
  ({ items, radius, staggerDelay, startAngle, endAngle, arc, motion, icon = "+", centerNode, buttonClassName, className, children, onKeyDown, ...props }, ref) => {
    const menu = useRadialMenu({ items, radius, staggerDelay, startAngle, endAngle, arc, motion });
    useImperativeHandle(ref, () => menu.controls);
    const { ref: rootRef, onKeyDown: bKey, ...rootProps } = menu.getRootProps();

    return (
      <MenuProvider value={{ menu, icon, centerNode, buttonClassName, items }}>
        <div
          ref={rootRef}
          data-part="root"
          {...rootProps}
          onKeyDown={composeHandlers(onKeyDown, bKey)}
          className={cn("relative flex items-center justify-center", className)}
          {...props}
        >
          {children ?? (
            <>
              <Trigger />
              <Menu>
                {items.map((item) => (
                  <Item key={item.id} item={item} />
                ))}
              </Menu>
            </>
          )}
        </div>
      </MenuProvider>
    );
  },
);
Root.displayName = "RadialMenu.Root";

/**
 * `RadialMenu`
 *
 * Un menú contextual que despliega sus opciones en abanico alrededor de un punto. Ajusta el arco para que
 * nada se salga del contenedor.
 *
 * @example Por defecto
 * <RadialMenu icon="+" items={items} radius={90} />
 *
 * @example Tus propias partes (otro centro, un elemento a medida)
 * <RadialMenu.Root items={items}>
 *   <RadialMenu.Trigger asChild><button className="mi-boton">Abrir</button></RadialMenu.Trigger>
 *   <RadialMenu.Menu>
 *     {items.map((item) => (
 *       <RadialMenu.Item key={item.id} item={item}>
 *         <RadialMenu.Icon className="!bg-voynich-gold" />
 *       </RadialMenu.Item>
 *     ))}
 *   </RadialMenu.Menu>
 * </RadialMenu.Root>
 */
export const RadialMenu = Object.assign(Root, { Root, Trigger, Menu, Item, Icon, Label });
