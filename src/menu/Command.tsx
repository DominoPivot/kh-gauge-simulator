import type { ComponentPropsWithoutRef } from "react";
import { useGaugeSim, useGaugeSimDispatch } from "../context/GaugeSimContext.js";

export type CommandProps = ComponentPropsWithoutRef<"button"> & {
    hpGain?: number,
    hpLoss?: number,
    mpGain?: number,
    mpLoss?: number,
    chGain?: number,
    chLoss?: number,

    secondChance?: boolean,
    clearCh?: boolean,
    balance?: boolean,
};

export function Command ({
    hpGain = 0,
    hpLoss = 0,
    mpGain = 0,
    mpLoss = 0,
    chGain = 0,
    chLoss = 0,
    secondChance = false,
    clearCh = false,
    balance = true,
    disabled,
    onClick,
    children,
    ...buttonProps
}: CommandProps) {
    const { mp, ch } = useGaugeSim()!;
    const dispatch = useGaugeSimDispatch()!;

    disabled ??= mpLoss > mp || chLoss > mp + ch;
    onClick ??= () => {
        if (hpGain)
            dispatch({ type: "hpGain", amount: hpGain });
        else if (hpLoss)
            dispatch({ type: "hpLoss", amount: hpLoss, secondChance });

        if (mpGain)
            dispatch({ type: "mpGain", amount: mpGain, clearCh });
        else if (mpLoss)
            dispatch({ type: "mpLoss", amount: mpLoss, balance });
        else if (chGain)
            dispatch({ type: "chGain", amount: chGain, balance });
        else if (chLoss)
            dispatch({ type: "chLoss", amount: chLoss, balance });
    };

    return (
        <button type="button" className="Command" onClick={onClick} disabled={disabled} {...buttonProps}>
            {children}
        </button>
    );
}
