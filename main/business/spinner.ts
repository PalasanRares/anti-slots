import { weightedRandomPrize } from "../utils/weighted-random-symbol";
import { Modifier } from "../domain/modifier";
import { Subject } from "rxjs";
import { SpinResult } from "../domain/spin-result";
import { WinningLine } from "../domain/winning-line";
import { Line } from "../domain/line.enum";
import { numbericEnumValues } from "../utils/enum-values";
import { Column } from "../domain/column.enum";

export class Spinner {

    private static instance: Spinner | null = null

    private constructor() {}

    public spinResult: Subject<SpinResult> = new Subject()

    public spin(bet: number): SpinResult {
        const winningLines: WinningLine[] = []

        const wasScatterGenerated: boolean[] = []
        for (let _ in numbericEnumValues(Line)) {
            wasScatterGenerated.push(false);
        }

        for (let line of numbericEnumValues(Line)) {
            const lineSymbols: Symbol[] = []
            for (let column in numbericEnumValues(Column)) {
                let randomSymbol = weightedRandomPrize();
                while (wasScatterGenerated[column] && randomPrize.modifierType === ModifierType.SCATTER) {
                    randomPrize = weightedRandomPrize();
                }
                if (!wasScatterGenerated[column] && randomPrize.modifierType === ModifierType.SCATTER) {
                    wasScatterGenerated[column] = true
                }
                rowSpin.push(randomPrize);
            }
            spin.push(rowSpin);
        }

        const linesWon = this.countWinningLines(spin, bet)
        const scatterWin = this.countScatter(spin, bet)

        let totalPrize = 0
        for (let lineWon of linesWon) {
            totalPrize += lineWon.prize
        }
        totalPrize += scatterWin.prize

        return {
            spin,
            linesWon,
            totalPrize,
            scatterWin
        };
    }

    public countWinningLines(spin: Prize[][], bet: number): LineWon[] {
        const linesWon: LineWon[] = []
        // Line 1
        let i = 0;
        let symbols = 1;
        while (spin[0][i].modifierType !== ModifierType.SCATTER && i < Spinner.NO_COLUMNS && spin[0][i] === spin[0][i + 1]) {
            symbols += 1;
            i += 1;
        }
        if ((symbols === 2 && ModifierMap[spin[0][0].modifierType].x2) || symbols > 2) {
            linesWon.push({
                line: 1,
                symbols,
                prize: ModifierMap[spin[0][0].modifierType][`x${symbols}` as keyof Modifier]! * bet
            })
        }

        // Line 2
        i = 0;
        symbols = 1;
        while (spin[1][i].modifierType !== ModifierType.SCATTER && i < Spinner.NO_COLUMNS && spin[1][i] === spin[1][i + 1]) {
            symbols += 1;
            i += 1;
        }
        if ((symbols === 2 && ModifierMap[spin[1][0].modifierType].x2) || symbols > 2) {
            linesWon.push({
                line: 2,
                symbols,
                prize: ModifierMap[spin[1][0].modifierType][`x${symbols}` as keyof Modifier]! * bet
            })
        }

        // Line 3
        i = 0;
        symbols = 1;
        while (spin[2][i].modifierType !== ModifierType.SCATTER && i < Spinner.NO_COLUMNS && spin[2][i] === spin[2][i + 1]) {
            symbols += 1;
            i += 1;
        }
        if ((symbols === 2 && ModifierMap[spin[2][0].modifierType].x2) || symbols > 2) {
            linesWon.push({
                line: 3,
                symbols,
                prize: ModifierMap[spin[2][0].modifierType][`x${symbols}` as keyof Modifier]! * bet
            })
        }

        // Line 4
        i = 0;
        let j = 0;
        let k = 1;
        let changeDirection = false;
        symbols = 1;
        while (spin[0][0].modifierType !== ModifierType.SCATTER && j < Spinner.NO_COLUMNS - 1 && spin[i][j] === spin[i + k][j + 1]) {
            symbols += 1;
            if (i + k < Spinner.NO_ROWS - 1 && !changeDirection) {
                i += 1;
            } else if (i + k === Spinner.NO_ROWS - 1 && !changeDirection) {
                changeDirection = true
                i += 1;
                k = -1;
            } else {
                i -= 1
            }
            j += 1;
        }
        if ((symbols === 2 && ModifierMap[spin[0][0].modifierType].x2) || symbols > 2) {
            linesWon.push({
                line: 4,
                symbols,
                prize: ModifierMap[spin[0][0].modifierType][`x${symbols}` as keyof Modifier]! * bet
            })
        }

        // Line 5
        i = 2
        j = 0
        k = -1
        changeDirection = false
        symbols = 1;
        while (spin[2][0].modifierType !== ModifierType.SCATTER && j < Spinner.NO_COLUMNS - 1 && spin[i][j] === spin[i + k][j + 1]) {
            symbols += 1;
            if (i + k > 0 && !changeDirection) {
                i -= 1;
            } else if (i + k === 0 && !changeDirection) {
                changeDirection = true
                i -= 1;
                k = 1;
            } else {
                i += 1
            }
            j += 1;
        }
        if ((symbols === 2 && ModifierMap[spin[2][0].modifierType].x2) || symbols > 2) {
            linesWon.push({
                line: 5,
                symbols,
                prize: ModifierMap[spin[2][0].modifierType][`x${symbols}` as keyof Modifier]! * bet
            })
        }
    
        return linesWon;
    }

    public countScatter(spin: Prize[][], bet: number): ScatterWin {
        let noScatters = 0
        const positions: [number, number][] = []
        for (let row = 0; row < Spinner.NO_ROWS; row++) {
            for (let column = 0; column < Spinner.NO_COLUMNS; column++) {
                if (spin[row][column].modifierType === ModifierType.SCATTER) {
                    noScatters += 1;
                    positions.push([row, column])
                }
            }
        }
        return {
            isWinning: noScatters >= 3,
            numberOfScatters: noScatters,
            prize: noScatters >= 3 ? ModifierMap[ModifierType.SCATTER][`x${noScatters}` as keyof Modifier]! * bet : 0,
            positions
        }
    }

    public static getInstance(): Spinner {
        if (Spinner.instance === null) {
            Spinner.instance = new Spinner()
        }
        return Spinner.instance!
    }
}
