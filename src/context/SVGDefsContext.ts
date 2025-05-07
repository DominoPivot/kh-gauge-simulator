import { createContext, use, type Key, type ReactNode } from "react";
import { createPortal } from "react-dom";

export const SVGDefsContext = createContext<SVGDefsElement | null>(null);

export function useSVGDefs () {
    const defs = use(SVGDefsContext)!;
    return function createDefsPortal (children: ReactNode, key?: Key | null) {
        return createPortal(children, defs, key);
    };
}
