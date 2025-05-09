import { useReducer, type PropsWithChildren } from "react";
import { type KHState } from "../actions.js";
import { KHDispatchContext, khReducer, KHStateContext } from "./KHStateContext.js";

const initialState: KHState = {
    maxHp: 114,
    hp: 114,
    maxMp: 19,
    mp: 19,
    ch: 0,
    summon: "Dismissed",
    information: "",
};

export function KHStateProvider ({ children }: PropsWithChildren) {
    const [state, dispatch] = useReducer(khReducer, initialState);
    return (
        <KHStateContext value={state}>
            <KHDispatchContext value={dispatch}>
                {children}
            </KHDispatchContext>
        </KHStateContext>
    );
}
