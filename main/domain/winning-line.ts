import { Line } from "./line.enum";

export interface WinningLine {
    line: Line,
    symbol: Symbol,
    noSymbols: number,
    amountWon: number
}
