import { useReducer, type PropsWithChildren } from "react";
import { GaugeSimContext, GaugeSimDispatchContext, gaugeSimReducer, type GaugeSimState } from "./GaugeSimContext.js";

const initialState: GaugeSimState = {
    maxHp: 114,
    hp: 114,
    maxMp: 19,
    mp: 19,
    ch: 0,
};

export function GaugeSimProvider ({ children }: PropsWithChildren) {
    const [gaugeSim, dispatch] = useReducer(gaugeSimReducer, initialState);
    return (
        <GaugeSimContext value={gaugeSim}>
            <GaugeSimDispatchContext value={dispatch}>
                {children}
            </GaugeSimDispatchContext>
        </GaugeSimContext>
    );
}
