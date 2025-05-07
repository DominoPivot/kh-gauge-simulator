import { useState, type PropsWithChildren } from "react";
import { SVGDefsContext } from "./SVGDefsContext.js";

export function SVGDefsProvider (props: PropsWithChildren) {
    const [defs, setDefs] = useState<SVGDefsElement | null>(null);
    return <>
        <defs ref={setDefs} />
        {defs && <SVGDefsContext value={defs} {...props} />}
    </>
}
