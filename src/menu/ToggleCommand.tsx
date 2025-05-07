import type { ComponentPropsWithoutRef } from "react";

export function ToggleCommand ({ children, ...props }: ComponentPropsWithoutRef<"button">) {
    const pressed = props["aria-pressed"] === "true" || props["aria-pressed"] === true;
    return (
        <button type="button" className="Command" {...props}>
            <span>{children}</span>
            <span aria-hidden className="Command__pressedIndicator">{pressed ? "ON" : ""}</span>
        </button>
    );
}
