import { useId } from "react";
import { useSVGDefs } from "../context/SVGDefsContext.js";

export function MpSplitters () {
    const defs = useSVGDefs();
    const id = useId();
    const href = `#${id}`;

    return <>
        {defs(
            <line id={id} x2={-240} strokeWidth={10} />
        )}
        <g stroke="rgb(24,28,42)">
            <use href={href} transform="rotate(30)" />
            <use href={href} transform="rotate(60)" />
            <use href={href} transform="rotate(90)" />
            <use href={href} transform="rotate(120)" />
            <use href={href} transform="rotate(150)" />
            <use href={href} transform="rotate(180)" />
            <use href={href} transform="rotate(210)" />
            <use href={href} transform="rotate(240)" />
            <line y1={210} y2={210} x2="-100%" strokeWidth={60} strokeDasharray="10 110" />
        </g>
    </>
}
