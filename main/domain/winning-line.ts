import { Line } from "./line.enum";
import { Symbol } from "./symbol";

export interface WinningLine {
    line: Line;
    symbol: Symbol;
    noSymbols: number;
    amountWon: number;
}
