import { SymbolName } from "../domain/symbol-name.enum";
import { Symbol } from "../domain/symbol";
import { alphabeticEnumValues } from "./enum-values";
import { Weight } from "../domain/weight.enum";

export function weightedRandomSymbol(): Symbol {
    const probabilities = alphabeticEnumValues(SymbolName).map((symbolName: string): Weight =>
        Symbol[symbolName].weight
    )

    const cumulativeProbabilities: number[] = [];
    probabilities.reduce((sum, probability, index) => cumulativeProbabilities[index] = sum + probability, 0);

    const random = Math.random();

    const symbolIndex = cumulativeProbabilities.findIndex(cumulativeProbability => random < cumulativeProbability)
    return alphabeticEnumValues(SymbolName)
        .map((symbolName: string): Symbol => Symbol[symbolName])
        .at(symbolIndex)!;
}
