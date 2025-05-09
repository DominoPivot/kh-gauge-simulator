import { createContext, use, type ActionDispatch } from "react";
import type { KHState, KHAction } from "../actions.js";

export const KHStateContext = createContext<KHState | undefined>(undefined);
export const KHDispatchContext = createContext<ActionDispatch<[action: KHAction]> | undefined>(undefined);

export function useKHState () {
    return use(KHStateContext);
}

export function useKHDispatch () {
    return use(KHDispatchContext);
}

export function khReducer (state: KHState, action: KHAction): KHState {
    if (!(action.condition?.(state) ?? true))
        throw new Error(`State does not meet the condition for command ${action.command ?? ""}`);
    return action.effect(state);
}
