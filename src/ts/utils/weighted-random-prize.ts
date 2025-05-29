import { Prize, PrizeArray } from "../domain/prize";

export function weightedRandomPrize(): Prize {
    const probabilities = PrizeArray.map(prize => prize.weight);

    const cumulativeProbabilities: number[] = [];
    probabilities.reduce((sum, probability, index) => cumulativeProbabilities[index] = sum + probability, 0);

    const random = Math.random();

    return PrizeArray[cumulativeProbabilities.findIndex(cumulativeProbability => random < cumulativeProbability)];
}
