import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { useGaugeSim, useGaugeSimDispatch } from "../context/GaugeSimContext.js";
import { Command } from "./Command.js";
import "./CommandMenu.css";
import { ToggleCommand } from "./ToggleCommand.js";

export function CommandMenu ({ download }: { download: () => void }) {
    const { maxMp, mp } = useGaugeSim()!;
    const dispatch = useGaugeSimDispatch()!;

    const [autoAttack, setAutoAttack] = useState(false);
    const [autoHurt, setAutoHurt] = useState(false);
    const [secondChance, setSecondChance] = useState(false);
    const [version, setVersion] = useState<"JP" | "US" | "FM">("FM");

    const autoInterval = useRef(0);

    useEffect(() => {
        autoInterval.current = setInterval(() => {
            if (autoAttack) dispatch({ type: "chGain", amount: 2 / 7, balance: true });
            if (autoHurt) dispatch({ type: "hpLoss", amount: 1, secondChance });
        }, 30);
        return () => clearInterval(autoInterval.current);
    }, [autoAttack, autoHurt, secondChance, dispatch]);

    useEffect(() => {
        switch (version) {
            case "FM":
                dispatch({ type: "statChange", maxHp: 114, maxMp: 19 });
                break;
            case "US":
            case "JP":
                dispatch({ type: "statChange", maxHp: 108, maxMp: 18 });
                break;
        }
    }, [version, dispatch]);

    return (<>
        <div className="CommandMenu">
            <CommandList className="passive-palette">
                <CommandMenuHeading>COMMAND</CommandMenuHeading>
                <Command chGain={1 / 7}>Gain 1/7 charge</Command>
                <ToggleCommand aria-pressed={autoAttack} onClick={() => setAutoAttack(a => !a)}>Auto-Charge</ToggleCommand>
                <Command hpLoss={1}>Take 1 damage</Command>
                <Command hpLoss={18} secondChance={secondChance}>Take 18 damage</Command>
                <ToggleCommand aria-pressed={autoHurt} onClick={() => setAutoHurt(a => !a)}>Auto-Hurt</ToggleCommand>
                <ToggleCommand aria-pressed={secondChance} onClick={() => setSecondChance(a => !a)}>Second Chance</ToggleCommand>
                <ToggleCommand aria-pressed={version === "FM"} onClick={() => setVersion("FM")}>FM Version</ToggleCommand>
                <ToggleCommand aria-pressed={version === "US"} onClick={() => setVersion("US")}>US Version</ToggleCommand>
                <ToggleCommand aria-pressed={version === "JP"} onClick={() => setVersion("JP")}>JP Version</ToggleCommand>
                <Command onClick={download}>Download SVG</Command>
            </CommandList>

            <CommandList className="combat-palette">
                <CommandMenuHeading>LIMIT</CommandMenuHeading>
                <Command mpLoss={2}>Strike Raid</Command>
                <Command mpLoss={2}>Sonic Blade</Command>
                <Command mpLoss={3}>Ars Arcanum</Command>
                <Command mpLoss={3}>Ragnarok</Command>
                <Command mpLoss={Infinity} disabled={mp < 3}>Trinity Limit</Command>
            </CommandList>

            <CommandList className="magic-palette">
                <CommandMenuHeading>MAGIC</CommandMenuHeading>
                <Command chLoss={version === "JP" ? 0.5 : 1}>Fire</Command>
                <Command chLoss={1}>Blizzard</Command>
                <Command mpLoss={1}>Thunder</Command>
                {version === "FM" ? <>
                    <Command mpLoss={1} hpGain={maxMp + 15}>Cure</Command>
                    <Command mpLoss={1} hpGain={maxMp + 27}>Cura</Command>
                    <Command mpLoss={1} hpGain={maxMp + 36}>Curaga</Command></>
                : version === "US" ? <>
                    <Command mpLoss={1} hpGain={3 * maxMp + 6}>Cure</Command>
                    <Command mpLoss={1} hpGain={3 * maxMp + 18}>Cura</Command>
                    <Command mpLoss={1} hpGain={3 * maxMp + 30}>Curaga</Command></>
                : version === "JP" ? <>
                    <Command mpLoss={1} hpGain={3 * maxMp + 9}>Cure</Command>
                    <Command mpLoss={1} hpGain={3 * maxMp + 27}>Cura</Command>
                    <Command mpLoss={1} hpGain={Infinity}>Curaga</Command></>
                : <></>}
                <Command mpLoss={1}>Gravity</Command>
                <Command mpLoss={2}>Stop</Command>
                <Command mpLoss={2}>Aero</Command>
            </CommandList>

            <CommandList className="items-palette">
                <CommandMenuHeading>ITEMS</CommandMenuHeading>
                <Command hpGain={30}>Potion</Command>
                <Command hpGain={60}>Hi-Potion</Command>
                <Command mpGain={3}>Ether</Command>
                <Command hpGain={Infinity} mpGain={Infinity}>Elixir</Command>
            </CommandList>

            <CommandList className="summon-palette">
                <CommandMenuHeading>SUMMON</CommandMenuHeading>
                <Command mpLoss={2}>Simba</Command>
                <Command mpLoss={2}>Genie</Command>
                <Command mpLoss={1}>Bambi</Command>
                <Command mpLoss={3}>Dumbo</Command>
                <Command mpLoss={3}>Tinker Bell</Command>
                <Command mpLoss={3}>Mushu</Command>
            </CommandList>
        </div>
    </>);
}

type CommandListProps = PropsWithChildren<{
    className?: string,
}>;

export function CommandList ({ className = "", children }: CommandListProps ) {
    return (
        <div className={`CommandList ${className}`}>
            {children}
        </div>
    );
}

export function CommandMenuHeading ({ children }: PropsWithChildren) {
    return (
        <div className="CommandMenuHeading">
            {children}
        </div>
    );
}
