import { useGaugeSim } from "../context/GaugeSimContext.js";
import { Gauge } from "./Gauge.js";

export function HpGauge () {
    const { maxHp, hp } = useGaugeSim()!;

    return (
        <Gauge
            r1={120}
            r2={180}
            c1="rgb(174,213,8)"
            c2="rgb(34,158,47)"
            ringWorth={54}
            rectScale={20}
            max={maxHp}
            value={hp}
        />
    );
}
