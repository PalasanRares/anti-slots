import { ModifierType } from "./modifier"

export interface Prize {
    name: string,
    modifierType: ModifierType,
    weight: number
}

export const PrizeArray: Prize[] = [
    {
        name: "J",
        modifierType: ModifierType.LOW,
        weight: 0.14
    },
    {
        name: "Q",
        modifierType: ModifierType.LOW,
        weight: 0.14
    },
    {
        name: "K",
        modifierType: ModifierType.LOW,
        weight: 0.14
    },
    {
        name: "ACE",
        modifierType: ModifierType.MEDIUM,
        weight: 0.12
    },
    {
        name: "VIRUS",
        modifierType: ModifierType.MEDIUM,
        weight: 0.12
    },
    {
        name: "TOILET",
        modifierType: ModifierType.HIGH,
        weight: 0.07
    },
    {
        name: "KANYE",
        modifierType: ModifierType.HIGH,
        weight: 0.07
    },
    {
        name: "DENIS",
        modifierType: ModifierType.AMAZING,
        weight: 0.1
    },
    {
        name: "RARES",
        modifierType: ModifierType.SCATTER,
        weight: 0.07
    },
    {
        name: "TUDOR",
        modifierType: ModifierType.JACKPOT,
        weight: 0.03
    }
]