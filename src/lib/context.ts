import { createContext, useContext } from "react";

/**
 * Contexto "estricto" para componentes por partes: si una parte se usa fuera de su `Root`,
 * lanza un error que dice exactamente qué hacer (en lugar de un `undefined` críptico).
 */
export function createPartsContext<T>(rootName: string) {
  const Ctx = createContext<T | null>(null);
  const useParts = (part: string): T => {
    const value = useContext(Ctx);
    if (!value) throw new Error(`<${rootName}.${part}> debe estar dentro de <${rootName}.Root>.`);
    return value;
  };
  return [Ctx.Provider, useParts, Ctx] as const;
}
