import { IIndexableStockProfile } from '../../interfaces/stock-profile.interface';

import { CategoryProcessorService } from './category-processor.service';

import { mergeSort } from '../../algos/merge-sort.algo';

export class RiskProcessorService extends CategoryProcessorService {

    private static category = 'risk';

    private static targets = {

        standardDeviation: '>',

        sharpeRatio: '>',

        beta: '>',

        alpha: '>',

        rSquared: '<'
    };

    public static processRatios(profile: IIndexableStockProfile): number {

        const ratiosToProcess = Object.keys(profile[this.category]);

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

            const ratio = ratiosToProcess[i] as keyof typeof this.targets;

            const values = this.ratiosExtractorService.ratios[ratio];

            const sorted = mergeSort(values);

            const [highest, lowest] = this.deduceHighestAndLowestBasedOnTarget(this.targets[ratio], sorted);

            const scaledScore = 100 * (profile[this.category][ratio] - lowest) / (highest - lowest);

            sumOfRatiosScaledScores += this.weightConfiguratorService.weights[ratio] * (scaledScore / 100);
        }

        scaledScoreInProportionToWeight =
            this.weightConfiguratorService.weights[this.category] * (sumOfRatiosScaledScores / 100);

        return scaledScoreInProportionToWeight;
    }
}
