import { useId, type PropsWithChildren } from "react";
import { useSVGDefs } from "../context/SVGDefsContext.js";
import { GaugeFill } from "./GaugeFill.js";
import { GaugePath } from "./GaugePath.js";

type GaugeProps = PropsWithChildren<{
    r1: number,
    r2: number,
    c1: string,
    c2: string,
    ringWorth: number,
    rectScale: number,
    max: number,
    value: number,
}>;

export function Gauge ({ max, value, children, c1, c2, ...props }: GaugeProps) {
    const id = useId();
    const defs = useSVGDefs();

    return <>
        {defs(
            <clipPath id={`${id}-clip`}>
                <GaugePath id={`${id}-path`} value={max} {...props} />
            </clipPath>
        )}

        <use href={`#${id}-path`} fill="rgb(24,28,42)" stroke="none" />
        <g clipPath={`url(#${id}-clip)`}>
            <GaugeFill value={value} c1={c1} c2={c2} {...props} />
            {children}
        </g>
        <use href={`#${id}-path`} fill="none" stroke="black" strokeWidth={8} />
    </>
}
