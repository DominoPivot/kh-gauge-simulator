import { use, type PropsWithChildren } from "react";
import { DefsContext } from "./DefsContext.js";
import { createPortal } from "react-dom";

export function DefsPortal ({ children }: PropsWithChildren) {
    const defs = use(DefsContext);
    return defs && createPortal(children, defs);
}
