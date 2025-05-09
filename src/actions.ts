
export type KHState = {
    maxHp: number,
    hp: number,
    maxMp: number,
    mp: number,
    ch: number,
    summon: "Dismissed" | "Simba" | "Genie" | "Bambi" | "Dumbo" | "Tinker Bell" | "Mushu",
    information: string,
};

export type KHAction = {
    command: string,
    condition?: (state: KHState) => boolean,
    effect: (state: KHState) => KHState,
};


// conditions

export const hasCh = (cost: 0.5 | 1) => ({ mp, ch }: KHState) => mp >= 1 || ch >= cost;
export const hasMp = (cost: 1 | 2 | 3) => ({ mp }: KHState) => mp >= cost;
export const hasMaxMp = (cost: number) => ({ maxMp }: KHState) => maxMp >= cost;
export const canSummon = (cost: 1 | 2 | 3) => ({ mp, summon }: KHState) => summon === "Dismissed" && mp >= cost;
export const hasHp = (amount: number) => ({ hp }: KHState) => hp >= amount;
export const hasMaxHp = (cost: number) => ({ maxHp }: KHState) => maxHp >= cost;
export const t = () => true;


// effects

const setMaxHp = (amount: number) => ({ maxHp, hp, ...rest }: KHState): KHState =>
    amount < 18 || amount > 114
        ? { maxHp, hp, ...rest }
        : { maxHp: amount, hp: Math.min(hp, amount), ...rest };

const setMaxMp = (amount: number) => ({ maxMp, mp, ch, ...rest }: KHState): KHState =>
    amount < 0 || amount > 19
        ? { ...rest, maxMp, mp, ch }
        : { ...rest, maxMp: amount, mp: Math.min(mp, amount), ch: Math.min(ch, mp, amount) };

const spendCh = (amount: 0.5 | 1) => ({ mp, ch, ...rest }: KHState): KHState =>
    ch >= amount
        ? { ...rest, mp, ch: Math.round((ch - amount) * 30) / 30 }
        : { ...rest, mp: mp - 1, ch: Math.round((ch + mp - amount) * 30) / 30 };

const spendMp = (amount: 1 | 2 | 3) => ({ mp, ch, ...rest }: KHState): KHState => {
    mp -= amount;
    while (ch >= mp + 1)
        ch -= ++mp;
    return { ...rest, mp, ch };
}

const loseHp = (amount: number) => ({ maxHp, hp, ...rest }: KHState): KHState =>
    ({ maxHp, hp: Math.max(0, hp - amount), ...rest });

const gainCh = (amount: number) => ({ maxMp, mp, ch, ...rest }: KHState): KHState => {
    ch += amount;
    while (ch >= mp + 1 && mp < maxMp)
        ch -= ++mp;
    if (ch > maxMp) ch = maxMp;
    return { ...rest, maxMp, mp, ch: Math.round(ch * 30) / 30 };
}

const gainHp = (amount: number) => ({ maxHp, hp, ...rest }: KHState): KHState =>
    ({ maxHp, hp: Math.min(maxHp, hp + amount), ...rest });

const gainMp = (amount: number) => ({ maxMp, mp, ch, ...rest }: KHState): KHState =>
    ({ ...rest, maxMp, mp: Math.min(maxMp, mp + amount), ch });

const setSummon = (summon: KHState["summon"]) => (state: KHState): KHState =>
    ({ ...state, summon });

const compose = (...effects: Array<(state: KHState) => KHState>) =>
    (state: KHState) => effects.reduceRight((s, e) => e(s), state);

const cureEffect = (a: number, b: number) => (state: KHState): KHState =>
    compose(gainHp(state.maxMp * a + b), spendMp(1))(state)


// generic actions

const Gain1of30Charge: KHAction = {
    command: "Attack",
    condition: t,
    effect: gainCh(1 / 30),
};

const Gain7of30Charge: KHAction = {
    command: "Try harder",
    condition: t,
    effect: gainCh(7 / 30),
};

const Lose1HP: KHAction = {
    command: "Lose 1 HP",
    condition: t,
    effect: loseHp(1),
};

const Lose18HP: KHAction = {
    command: "Lose 18 HP",
    condition: t,
    effect: loseHp(18),
};

const Gain3MaxHp: KHAction = {
    command: "Max HP +3",
    condition: state => state.maxHp < 114,
    effect: state => setMaxHp(state.maxHp + 3)(state),
};

const Lose3MaxHp: KHAction = {
    command: "Max HP -3",
    condition: state => state.maxHp > 18,
    effect: state => setMaxHp(state.maxHp - 3)(state),
};

const Gain1MaxMp: KHAction = {
    command: "Max MP +1",
    condition: state => state.maxMp < 19,
    effect: state => setMaxMp(state.maxMp + 1)(state),
};

const Lose1MaxMp: KHAction = {
    command: "Max MP -1",
    condition: state => state.maxMp > 0,
    effect: state => setMaxMp(state.maxMp - 1)(state),
};

// limit actions

const StrikeRaid: KHAction = {
    command: "Strike Raid",
    condition: hasMp(2),
    effect: spendMp(2),
};

const SonicBlade: KHAction = {
    command: "Sonic Blade",
    condition: hasMp(2),
    effect: spendMp(2),
};

const ArsArcanum: KHAction = {
    command: "Ars Arcanum",
    condition: hasMp(3),
    effect: spendMp(3),
};

const Ragnarok: KHAction = {
    command: "Ragnarok",
    condition: hasMp(3),
    effect: spendMp(3),
};

const TrinityLimit: KHAction = {
    command: "Trinity Limit",
    condition: hasMp(3),
    effect: state => ({ ...state, mp: 0, ch: 0 }),
};


// magic actions

const FireJP: KHAction = {
    command: "Fire",
    condition: hasCh(0.5),
    effect: spendCh(0.5),
};

const Fire: KHAction = {
    command: "Fire",
    condition: hasCh(1),
    effect: spendCh(1),
};

const Blizzard: KHAction = {
    command: "Blizzard",
    condition: hasCh(1),
    effect: spendCh(1),
};

const Thunder: KHAction = {
    command: "Thunder",
    condition: hasMp(1),
    effect: spendMp(1),
};

const CureFM: KHAction = {
    command: "Cure",
    condition: hasMp(1),
    effect: cureEffect(1, 15),
};

const CuraFM: KHAction = {
    command: "Cura",
    condition: hasMp(1),
    effect: cureEffect(1, 27),
};

const CuragaFM: KHAction = {
    command: "Curaga",
    condition: hasMp(1),
    effect: cureEffect(1, 36),
};

const CureUS: KHAction = {
    command: "Cure",
    condition: hasMp(1),
    effect: cureEffect(3, 6),
};

const CuraUS: KHAction = {
    command: "Cura",
    condition: hasMp(1),
    effect: cureEffect(3, 18),
};

const CuragaUS: KHAction = {
    command: "Curaga",
    condition: hasMp(1),
    effect: cureEffect(3, 30),
};

const CureJP: KHAction = {
    command: "Cure",
    condition: hasMp(1),
    effect: cureEffect(3, 9),
};

const CuraJP: KHAction = {
    command: "Cura",
    condition: hasMp(1),
    effect: cureEffect(3, 27),
};

const CuragaJP: KHAction = {
    command: "Curaga",
    condition: hasMp(1),
    effect: compose(gainHp(Infinity), spendMp(1)),
};

const Gravity: KHAction = {
    command: "Gravity",
    condition: hasMp(1),
    effect: spendMp(1),
};

const Stop: KHAction = {
    command: "Stop",
    condition: hasMp(2),
    effect: spendMp(2),
};

const Aero: KHAction = {
    command: "Aero",
    condition: hasMp(2),
    effect: spendMp(2),
};


// items actions

const Potion: KHAction = {
    command: "Potion",
    condition: t,
    effect: gainHp(30),
};

const HiPotion: KHAction = {
    command: "Hi-Potion",
    condition: t,
    effect: gainHp(60),
};

const Ether: KHAction = {
    command: "Ether",
    condition: t,
    effect: gainMp(3),
};

const Elixir: KHAction = {
    command: "Elixir",
    condition: t,
    effect: compose(gainMp(Infinity), gainHp(Infinity)),
};


// summon actions

const Simba: KHAction = {
    command: "Simba",
    condition: canSummon(2),
    effect: compose(spendMp(2), setSummon("Simba")),
};

const Genie: KHAction = {
    command: "Genie",
    condition: canSummon(2),
    effect: compose(spendMp(2), setSummon("Genie")),
};

const Bambi: KHAction = {
    command: "Bambi",
    condition: canSummon(1),
    effect: compose(spendMp(1), setSummon("Bambi")),
};

const BambiCharge: KHAction = {
    command: "Bambi Charge",
    condition: ({ summon }: KHState) => summon === "Bambi",
    effect: gainCh(7 / 30),
};

const Dumbo: KHAction = {
    command: "Dumbo",
    condition: canSummon(3),
    effect: compose(spendMp(3), setSummon("Dumbo")),
};

const TinkerBell: KHAction = {
    command: "Tinker Bell",
    condition: canSummon(3),
    effect: compose(spendMp(3), setSummon("Tinker Bell")),
};

const TinkerBellCure: KHAction = {
    command: "Tinker Bell Cure",
    condition: ({ summon }: KHState) => summon === "Tinker Bell",
    effect: (state: KHState) => gainHp(state.maxMp)(state),
}

const Mushu: KHAction = {
    command: "Mushu",
    condition: canSummon(3),
    effect: compose(spendMp(3), setSummon("Mushu")),
};

const Dismiss: KHAction = {
    command: "Dismiss",
    condition: ({ summon }: KHState) => summon !== "Dismissed",
    effect: setSummon("Dismissed"),
};

export const generics = [
    Gain1of30Charge,
    Gain7of30Charge,
    Gain1MaxMp,
    Lose1MaxMp,
    Gain3MaxHp,
    Lose3MaxHp,
    Lose1HP,
    Lose18HP,
];

export { Lose1HP };

export const limits = [
    SonicBlade,
    StrikeRaid,
    ArsArcanum,
    Ragnarok,
    TrinityLimit,
];

export const magics = {
    FM: [
        Fire,
        Blizzard,
        Thunder,
        CureFM,
        CuraFM,
        CuragaFM,
        Gravity,
        Stop,
        Aero,
    ],
    JP: [
        FireJP,
        Blizzard,
        Thunder,
        CureJP,
        CuraJP,
        CuragaJP,
        Gravity,
        Stop,
        Aero,
    ],
    US: [
        Fire,
        Blizzard,
        Thunder,
        CureUS,
        CuraUS,
        CuragaUS,
        Gravity,
        Stop,
        Aero,
    ],
};

export const items = [
    Potion,
    HiPotion,
    Ether,
    Elixir,
];

export const summons = [
    Simba,
    Genie,
    Bambi,
    Dumbo,
    TinkerBell,
    Mushu,
];

export { BambiCharge, TinkerBellCure, Dismiss };
