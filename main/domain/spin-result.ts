import { ScatterWin } from "./scatter-win";
import { WinningLine } from "./winning-line";
import { Symbol } from "./symbol";

export interface SpinResult {
    result: Symbol[][];
    winningLines: WinningLine[];
    totalWon: number;
    scatterWin?: ScatterWin;
    // FIXME Remove this after migrating full to MVVM
    bet: number;
}
