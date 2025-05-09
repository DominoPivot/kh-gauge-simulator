import { useState, type PropsWithChildren } from "react";
import { DefsContext } from "./DefsContext.js";

export function DefsProvider (props: PropsWithChildren) {
    const [defs, setDefs] = useState<SVGDefsElement | null>(null);
    return <>
        <defs ref={setDefs} />
        {defs && <DefsContext value={defs} {...props} />}
    </>
}
