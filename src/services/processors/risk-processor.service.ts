import { IIndexableStockProfile } from '../../interfaces/stock-profile.interface';

import { CategoryProcessorService } from './category-processor.service';

import { mergeSort } from '../../algos/merge-sort.algo';

export class RiskProcessorService {

    private static category = 'risk';

    /*
    Determines comparison logic for each ratio that belongs to this category
    In the nutshell -- dictates whether we're looking for highest or lowest value amongst profiles
    */
    private static targets: { [key: string]: string } = {

        standardDeviation: '>',

        sharpeRatio: '>',

        beta: '>',

        alpha: '>',

        rSquared: '<'
    };

    /*
    Determines margins for each ratio; if the ratio does not fall into desired margin,
    it automatically gets 0 score
    */
    private static margins: { [key: string]: (value: number) => boolean } = {

        sharpeRatio: (value: number) => value > 1,

        beta: (value: number) => value > 1,

        alpha: (value: number) => value > 0,

        rSquared: (value: number) => value < 70
    };

    public static processRatios(profile: IIndexableStockProfile): number {

        const ratiosToProcess = Object.keys(this.targets);

        /*
        Define category scaled score in proportion to weight
        */
        let scaledScoreInProportionToWeight = 0;

        /*
        Define sum of ratios scaled scores in proportion to their relative weights
        */
        let sumOfRatiosScaledScores = 0;

        /*
        We implement almost identical pattern as one in the parent class, but this time
        we sum the scores per ratio, filling the sum variable, which we then bring to the weight
        of the category, resulting in scaled score (in proportion to weight) of the category itself
        */
        for (let i = 0 ; i < ratiosToProcess.length; i++) {

            const ratio = ratiosToProcess[i];

            const ratioValue = profile[this.category][ratio];

            /*
            We first check if ratio falls into margin and if not we score it as 0,
            without further sorting and calculations
            */
            if (this.margins[ratio]) {

                const valueFallsIntoDesiredMargin = this.margins[ratio](ratioValue);

                if (!valueFallsIntoDesiredMargin) {

                    sumOfRatiosScaledScores += 0;

                    continue;
                }
            }

            /*
            Otherwise, we sort values, calculate scaled score, bring it to weight and sum
            with the rest of the scores
            */
            const values = CategoryProcessorService.ratiosExtractorService.ratios[ratio];

            const sorted = mergeSort(values);

            const [highest, lowest] = CategoryProcessorService.deduceHighestAndLowestBasedOnTarget(
                this.targets[ratio],
                sorted
            );

            const scaledScore = (ratioValue - lowest) / (highest - lowest);

            sumOfRatiosScaledScores +=
                CategoryProcessorService.weightConfiguratorService.weights[ratio] * scaledScore;
        }

        /*
        Finally, we bring the sum of scaled (and weighted) ratio scores to the weight of the category
        */
        scaledScoreInProportionToWeight =
            CategoryProcessorService.weightConfiguratorService.weights[this.category] * (sumOfRatiosScaledScores / 100);

        return scaledScoreInProportionToWeight;
    }
}
