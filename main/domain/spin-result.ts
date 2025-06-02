import { ScatterWin } from "./scatter-win";
import { WinningLine } from "./winning-line";

export interface SpinResult {
    result: Symbol[][]
    winningLines: WinningLine[],
    totalWon: number,
    scatterWin?: ScatterWin,
}
