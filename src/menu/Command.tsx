import { type PropsWithChildren } from "react";
import type { KHAction } from "../actions.js";
import { useKHDispatch, useKHState } from "../context/KHStateContext.js";
import "./Command.css";

type CommandProps = PropsWithChildren<{
    action?: KHAction,
    disabled?: boolean,
    pressed?: boolean,
    onClick?: () => void,
}>;

export function Command ({ action, disabled, pressed, onClick, children }: CommandProps) {
    const state = useKHState()!;
    const dispatch = useKHDispatch()!;

    disabled ??= !(action?.condition?.(state) ?? true);
    onClick ??= () => action && dispatch(action);

    return (
        <button type="button" className={`Command Command--pressed-${pressed}`} aria-pressed={pressed} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
}
