import { createContext, use, type ActionDispatch } from "react";

export const GaugeSimContext = createContext<GaugeSimState | undefined>(undefined);
export const GaugeSimDispatchContext = createContext<ActionDispatch<[action: GaugeSimAction]> | undefined>(undefined);

export function useGaugeSim () {
    return use(GaugeSimContext);
}

export function useGaugeSimDispatch () {
    return use(GaugeSimDispatchContext);
}

export type GaugeSimState = {
    maxHp: number,
    hp: number,
    maxMp: number,
    mp: number,
    ch: number,
};

export type GaugeSimAction =
    | { type: "statChange", maxHp: number, maxMp: number }
    | { type: "hpGain", amount: number }
    | { type: "hpLoss", amount: number, secondChance?: boolean }
    | { type: "mpGain", amount: number, clearCh?: boolean }
    | { type: "mpLoss", amount: number, balance?: boolean }
    | { type: "chGain", amount: number, balance?: boolean }
    | { type: "chLoss", amount: number, balance?: boolean }
    | { type: "balance" }
    ;

export function gaugeSimReducer (state: GaugeSimState, action: GaugeSimAction): GaugeSimState {
    console.assert(!("amount" in action) || action.amount > 0, "amount in %o must be positive", action);

    switch (action.type) {
        case "statChange":
            return {
                maxHp: action.maxHp,
                hp: Math.min(state.hp, action.maxHp),
                maxMp: action.maxMp,
                mp: Math.min(state.mp, action.maxMp),
                ch: Math.min(state.ch, action.maxMp),
            };
        case "hpGain": {
            const hp = Math.min(state.maxHp, state.hp + action.amount);
            return { ...state, hp };
        }
        case "hpLoss": {
            const zero = action.secondChance && state.hp > 1 ? 1 : 0;
            const hp = Math.max(zero, state.hp - action.amount);
            return { ...state, hp };
        }
        case "mpGain": {
            const mp = Math.min(state.maxMp, state.mp + action.amount);
            return action.clearCh && mp > state.mp
                ? { ...state, mp, ch: 0 }
                : { ...state, mp };
        }
        case "mpLoss": {
            if (action.amount === Infinity) {
                return { ...state, mp: 0, ch: 0 };
            }
            const mp = Math.max(0, state.mp - action.amount);
            return action.balance ?? true
                ? balanceChToMp({ ...state, mp })
                : { ...state, mp };
        }
        case "chGain": {
            const ch = state.ch + action.amount;
            return action.balance ?? true
                ? balanceChToMp({ ...state, ch })
                : { ...state, ch };
        }
        case "chLoss": {
            const ch = state.ch - action.amount;
            return action.balance ?? true
                ? balanceMpToCh({ ...state, ch })
                : { ...state, ch };
        }
        case "balance": {
            return balanceChToMp(balanceMpToCh(state));
        }
        default:
            throw new Error("Unknown action");
    }
}

function balanceMpToCh (state: GaugeSimState): GaugeSimState {
    let { mp, ch } = state;

    while (ch < 0 && mp > 0) {
        ch += mp--;
    }
    if (ch < 0) {
        ch = 0;
    }
    return { ...state, mp, ch };
}

function balanceChToMp (state: GaugeSimState): GaugeSimState {
    let { mp, ch } = state;
    while (ch >= mp + 1 && mp < state.maxMp) {
        ch -= ++mp;
    }
    if (ch > state.maxMp) {
        ch = state.maxMp;
    }
    return { ...state, mp, ch };
}
