import { useId } from "react";
import { DefsPortal } from "../context/DefsPortal.js";
import { GaugePath } from "./GaugePath.js";

type GaugeFillProps = {
    r1: number,
    r2: number,
    c1: string,
    c2: string,
    ringWorth: number,
    rectScale: number,
    value: number,
};

export function GaugeFill ({ r1, r2, c1, c2, ringWorth, rectScale, value }: GaugeFillProps) {
    const id = useId();

    return <>
        <DefsPortal>
            <clipPath id={`${id}-clip`}>
                <GaugePath r1={r1} r2={r2} ringWorth={ringWorth} rectScale={rectScale} value={value} />
            </clipPath>
            <linearGradient id={`${id}-lgrad`} x1="0" x2="0" y1={r1} y2={r2} gradientUnits="userSpaceOnUse">
                <stop stopColor={c1} />
                <stop stopColor={c2} offset="1" />
            </linearGradient>
            <radialGradient id={`${id}-rgrad`} cx="0" cy="0" fr={r1} r={r2} href={`#${id}-lgrad`} />
        </DefsPortal>
        <g clipPath={`url(#${id}-clip)`}>
            <circle fill={`url(#${id}-rgrad)`} r={r2} />
            <rect fill={`url(#${id}-lgrad)`} x="-100%" width="100%" height="50%" />
        </g>
    </>
}
