import { Prize } from "./prize";

export interface LineWon {
    line: number,
    symbols: number,
    prize: number
}

export interface ScatterWin {
    isWinning: boolean,
    numberOfScatters: number,
    prize: number,
    positions: [number, number][]
}

export interface SpinResult {
    spin: Prize[][],
    linesWon: LineWon[],
    totalPrize: number,
    scatterWin: ScatterWin
}
