import { useKHState } from "../context/KHStateContext.js";
import { Gauge } from "./Gauge.js";
import { GaugeFill } from "./GaugeFill.js";
import { MpSplitters } from "./MpSplitters.js";

export function MpGauge () {
    const { maxMp, mp, ch } = useKHState()!;

    return (
        <Gauge
            r1={180}
            r2={240}
            c1="rgb(49,131,221)"
            c2="rgb(71,65,187)"
            ringWorth={9}
            rectScale={120}
            max={maxMp}
            value={mp}
        >
            <GaugeFill
                r1={220}
                r2={240}
                c1="rgb(254,136,1)"
                c2="rgb(255,169,5)"
                ringWorth={9}
                rectScale={120}
                value={ch}
            />
            <MpSplitters />
        </Gauge>
    );
}
