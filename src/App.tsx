import { useCallback, useRef } from "react";
import { GaugeSimProvider } from "./context/GaugeSimProvider.js";
import { SVGDefsProvider } from "./context/SVGDefsProvider.js";
import { HpGauge } from "./gauge/HpGauge.js";
import { MpGauge } from "./gauge/MpGauge.js";
import { CommandMenu } from "./menu/CommandMenu.js";

export function App () {
    const ref = useRef<SVGSVGElement>(null);

    const download = useCallback(() => {
        if (!ref.current) throw new Error("SVG document ref not set.");
        const svgCode = ref.current.outerHTML.replace(/[«»]/g, "r");

        const a = document.createElement("a");
        a.hidden = true;
        a.href = URL.createObjectURL(new Blob([svgCode], { type: "image/svg+xml" }));
        a.download = "khgauge.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, []);

    return <>
        <GaugeSimProvider>
            <svg ref={ref} viewBox="-1220 -250 1500 500" width={1500} height={500} xmlns="http://www.w3.org/2000/svg">
                <SVGDefsProvider>
                    <HpGauge />
                    <MpGauge />
                </SVGDefsProvider>
            </svg>
            <CommandMenu download={download} />
        </GaugeSimProvider>
    </>
}
