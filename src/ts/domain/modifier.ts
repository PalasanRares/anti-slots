export enum ModifierType {
    LOW,
    MEDIUM,
    HIGH,
    AMAZING,
    SCATTER,
    JACKPOT
}

export interface Modifier {
    x2?: number,
    x3: number,
    x4: number,
    x5: number
}

export const ModifierMap: Record<ModifierType, Modifier> = {
    [ModifierType.LOW]: {
        x3: 0.25,
        x4: 1,
        x5: 5
    },
    [ModifierType.MEDIUM]: {
        x3: 0.5,
        x4: 2,
        x5: 10
    },
    [ModifierType.HIGH]: {
        x2: 0.25,
        x3: 2,
        x4: 5,
        x5: 25
    },
    [ModifierType.AMAZING]: {
        x2: 0.5,
        x3: 4,
        x4: 20,
        x5: 100
    },
    [ModifierType.SCATTER]: {
        x3: 2,
        x4: 15,
        x5: 50
    },
    [ModifierType.JACKPOT]: {
        x2: 0.5,
        x3: 5,
        x4: 50,
        x5: 250
    }
}
