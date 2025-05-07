import { ComponentProps, memo } from "react";

export type GaugePathProps = ComponentProps<"path"> & {
    r1: number,
    r2: number,
    ringWorth: number,
    rectScale: number,
    value: number,
};

/**
 * Produces an SVG path in the shape of a KH-style gauge.
 * @param r1 The inner radius.
 * @param r2 The outer radius.
 * @param dt The absolute angle formed inside the annulus sector.
 * @param dx The length by which the gauge extends from the annulus sector.
 */
function path (r1: number, r2: number, dt: number, dx: number) {
    const t = dt - Math.PI;
    const large = t > 0 ? 1 : 0;
    return dx
        ? `M ${-r1} 0 A ${r1} ${r1} 0 ${large} 1 0 ${r1} H ${-dx} V ${r2} H 0 A ${r2} ${r2} 0 ${large} 0 ${-r2} 0 Z`
        : `M ${-r1} 0 A ${r1} ${r1} 0 ${large} 1 ${r1 * Math.cos(t)} ${r1 * Math.sin(t)} L ${r2 * Math.cos(t)} ${r2 * Math.sin(t)} A ${r2} ${r2} 0 ${large} 0 ${-r2} 0 Z`;
}

export const GaugePath = memo(function GaugePath ({ r1, r2, ringWorth, rectScale, value, ...props }: GaugePathProps) {
    const d = value >= ringWorth
        ? path(r1, r2, 1.5 * Math.PI, (value - ringWorth) * rectScale)
        : path(r1, r2, 1.5 * Math.PI * (value / ringWorth), 0);
    return <path d={d} {...props} />;
});
