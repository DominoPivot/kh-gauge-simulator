import { useCallback, useRef } from "react";
import { useKHState } from "./context/KHStateContext.js";
import { KHStateProvider } from "./context/KHStateProvider.js";
import { DefsProvider } from "./context/DefsProvider.js";
import { HpGauge } from "./gauge/HpGauge.js";
import { MpGauge } from "./gauge/MpGauge.js";
import { CommandMenu } from "./menu/CommandMenu.js";
import { InformationBar } from "./menu/InformationBar.js";

export function App () {
    const information = useKHState()?.information;

    const svgRef = useRef<SVGSVGElement>(null);
    const onDownload = useCallback(() => {
        if (!svgRef.current) throw new Error("SVG document ref not set.");
        const svgCode = svgRef.current.outerHTML.replace(/[«»]/g, "r");

        const a = document.createElement("a");
        a.hidden = true;
        a.href = URL.createObjectURL(new Blob([svgCode], { type: "image/svg+xml" }));
        a.download = "kh-gauge.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, []);

    return <>
        <KHStateProvider>
            <InformationBar>{information}</InformationBar>
            <svg ref={svgRef} viewBox="-1220 -250 1500 500" width={1500} height={500} xmlns="http://www.w3.org/2000/svg">
                <DefsProvider>
                    <HpGauge />
                    <MpGauge />
                </DefsProvider>
            </svg>
            <CommandMenu onDownload={onDownload} />
        </KHStateProvider>
    </>
}
