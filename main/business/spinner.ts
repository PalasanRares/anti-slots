import { weightedRandomSymbol } from "../utils/weighted-random-symbol";
import { Modifier } from "../domain/modifier";
import { Symbol } from "../domain/symbol";
import { Observable, Subject } from "rxjs";
import { SpinResult } from "../domain/spin-result";
import { WinningLine } from "../domain/winning-line";
import { Line } from "../domain/line.enum";
import { numbericEnumValues, numericEnumSize } from "../utils/enum-utils";
import { Column } from "../domain/column.enum";
import { ScatterPosition, ScatterWin } from "../domain/scatter-win";
import { Row } from "../domain/row.enum";

export class Spinner {

    private static instance: Spinner | null = null

    private constructor() {}

    private _spinResult: Subject<SpinResult> = new Subject()
    get spinResultObservable(): Observable<SpinResult> {
        return this._spinResult.asObservable()
    }

    public spin(bet: number) {
        const rows = numbericEnumValues(Row)
        const columns = numbericEnumValues(Column)

        const wasScatterGenerated: boolean[] = []
        for (let _ in rows) {
            wasScatterGenerated.push(false);
        }

        const result: Symbol[][] = []
        for (let _ of rows) {
            const row: Symbol[] = []
            for (let column of columns) {
                let randomSymbol = weightedRandomSymbol();
                while (wasScatterGenerated[column] && randomSymbol.modifier === Modifier.Scatter) {
                    randomSymbol = weightedRandomSymbol();
                }
                if (!wasScatterGenerated[column] && randomSymbol.modifier === Modifier.Scatter) {
                    wasScatterGenerated[column] = true
                }
                row.push(randomSymbol);
            }
            result.push(row);
        }

        const winningLines = this.countWinningLines(result, bet)
        const scatterWin = this.countScatter(result, bet)

        let totalWon = 0
        for (let winningLine of winningLines) {
            totalWon += winningLine.amountWon
        }
        totalWon += scatterWin ? scatterWin.amountWon : 0

        this._spinResult.next({
            result,
            winningLines,
            totalWon,
            scatterWin,
            bet
        })
    }

    // TODO Refactor this mess, make it pretty
    private countWinningLines(result: Symbol[][], bet: number): WinningLine[] {
        const winningLines: WinningLine[] = []
        const noColumns = numericEnumSize(Column)
        const noRows = numericEnumSize(Row)
        // Line 1
        let i = 0;
        let symbol = result[0][0]
        let noSymbols = 1;
        while (result[0][i].modifier !== Modifier.Scatter && i < noColumns && result[0][i] === result[0][i + 1]) {
            noSymbols += 1;
            i += 1;
        }
        let amountWon = symbol.modifier[`x${noSymbols}`] * bet
        if (noSymbols >= 2 && amountWon > 0) {
            winningLines.push({
                line: Line.ONE,
                symbol: symbol,
                noSymbols: noSymbols,
                amountWon: amountWon
            })
        }

        // Line 2
        i = 0;
        symbol = result[1][0]
        noSymbols = 1;
        while (result[1][i].modifier !== Modifier.Scatter && i < noColumns && result[1][i] === result[1][i + 1]) {
            noSymbols += 1;
            i += 1;
        }
        amountWon = symbol.modifier[`x${noSymbols}`] * bet
        if (noSymbols >= 2 && amountWon > 0) {
            winningLines.push({
                line: Line.TWO,
                symbol: symbol,
                noSymbols: noSymbols,
                amountWon: amountWon
            })
        }

        // Line 3
        i = 0;
        symbol = result[2][0]
        noSymbols = 1;
        while (result[2][i].modifier !== Modifier.Scatter && i < noColumns && result[2][i] === result[2][i + 1]) {
            noSymbols += 1;
            i += 1;
        }
        amountWon = symbol.modifier[`x${noSymbols}`] * bet
        if (noSymbols >= 2 && amountWon > 0) {
            winningLines.push({
                line: Line.THREE,
                symbol: symbol,
                noSymbols: noSymbols,
                amountWon: amountWon
            })
        }

        // Line 4
        i = 0;
        let j = 0;
        let k = 1;
        let changeDirection = false;
        symbol = result[0][0]
        noSymbols = 1;
        while (result[0][0].modifier !== Modifier.Scatter && j < noColumns - 1 && result[i][j] === result[i + k][j + 1]) {
            noSymbols += 1;
            if (i + k < noRows - 1 && !changeDirection) {
                i += 1;
            } else if (i + k === noRows - 1 && !changeDirection) {
                changeDirection = true
                i += 1;
                k = -1;
            } else {
                i -= 1
            }
            j += 1;
        }
        amountWon = symbol.modifier[`x${noSymbols}`] * bet
        if (noSymbols >= 2 && amountWon > 0) {
            winningLines.push({
                line: Line.FOUR,
                symbol: symbol,
                noSymbols: noSymbols,
                amountWon: amountWon
            })
        }

        // Line 5
        i = 2
        j = 0
        k = -1
        changeDirection = false
        noSymbols = 1
        symbol = result[2][0]
        while (result[2][0].modifier !== Modifier.Scatter && j < noColumns - 1 && result[i][j] === result[i + k][j + 1]) {
            noSymbols += 1;
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
        amountWon = symbol.modifier[`x${noSymbols}`] * bet
        if (noSymbols >= 2 && amountWon > 0) {
            winningLines.push({
                line: Line.FIVE,
                symbol: symbol,
                noSymbols: noSymbols,
                amountWon: amountWon
            })
        }
    
        return winningLines;
    }

    private countScatter(result: Symbol[][], bet: number): ScatterWin | undefined {
        let noScatters = 0
        const positions: ScatterPosition[] = []
        const noRows = numericEnumSize(Row)
        const noColumns = numericEnumSize(Column)
        for (let row = 0; row < noRows; row++) {
            for (let column = 0; column < noColumns; column++) {
                if (result[row][column].modifier === Modifier.Scatter) {
                    noScatters += 1;
                    positions.push([row, column])
                }
            }
        }
        return noScatters >= 3 ? {
            noScatters,
            amountWon: Modifier.Scatter[`x${noScatters}`] * bet,
            positions: positions
        } : undefined
    }

    public static getInstance(): Spinner {
        if (Spinner.instance === null) {
            Spinner.instance = new Spinner()
        }
        return Spinner.instance!
    }
}
