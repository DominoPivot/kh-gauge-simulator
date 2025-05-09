import { useCallback, useEffect, useState } from "react";
import { BambiCharge, Dismiss, generics, items, limits, Lose1HP, magics, summons, TinkerBellCure } from "../actions.js";
import { useKHDispatch, useKHState } from "../context/KHStateContext.js";
import { Command } from "./Command.js";
import "./CommandMenu.css";

type CommandMenuProps = {
    onDownload: () => void,
};

export function CommandMenu ({ onDownload }: CommandMenuProps) {
    const { summon } = useKHState()!;
    const [version, setVersion] = useState<"FM" | "US" | "JP">("FM");
    const dispatch = useKHDispatch()!;

    useEffect(() => {
        if (summon === "Tinker Bell") {
            const interval = setInterval(() => { dispatch(TinkerBellCure) }, 1700);
            return () => clearInterval(interval);
        }
        if (summon === "Bambi") {
            const interval = setInterval(() => { dispatch(BambiCharge) }, 10);
            return () => clearInterval(interval);
        }
    }, [summon, dispatch]);

    const [autoHurt, setAutoHurt] = useState(false);
    const toggleAutoHurt = useCallback(() => setAutoHurt(a => !a), []);
    useEffect(() => {
        if (autoHurt) {
            const interval = setInterval(() => { dispatch(Lose1HP) }, 10);
            return () => clearInterval(interval);
        }
    }, [autoHurt, dispatch]);

    return (<>
        <div className="CommandMenu">
            <div className="CommandMenu__list passive-palette">
                <div className="CommandMenu__heading">COMMAND</div>
                {generics.map(action =>
                    <Command action={action} key={action.command}>
                        {action.command}
                    </Command>
                )}
                <Command pressed={autoHurt} onClick={toggleAutoHurt}>Drain HP</Command>
                <Command onClick={onDownload}>Export SVG</Command>
            </div>

            <div className="CommandMenu__list combat-palette">
                <div className="CommandMenu__heading">LIMIT</div>
                {limits.map(action =>
                    <Command action={action} key={action.command}>
                        {action.command}
                    </Command>
                )}
            </div>

            <div className="CommandMenu__list magic-palette">
                <div className="CommandMenu__heading">MAGIC</div>
                {magics[version].map(action =>
                    <Command action={action} key={action.command}>
                        {action.command}
                    </Command>
                )}
                <Command onClick={() => setVersion("FM")} pressed={version === "FM"}>FM mode</Command>
                <Command onClick={() => setVersion("US")} pressed={version === "US"}>US mode</Command>
                <Command onClick={() => setVersion("JP")} pressed={version === "JP"}>JP mode</Command>
            </div>

            <div className="CommandMenu__list items-palette">
                <div className="CommandMenu__heading">ITEMS</div>
                {items.map(action =>
                    <Command action={action} key={action.command}>
                        {action.command}</Command>
                )}
            </div>

            <div className="CommandMenu__list summon-palette">
                <div className="CommandMenu__heading">SUMMON</div>
                {summons.map(action => action.command === summon
                    ? <Command action={Dismiss} key={action.command}>Dismiss</Command>
                    : <Command action={action} key={action.command}>{action.command}</Command>
                )}
            </div>
        </div>
    </>);
}
