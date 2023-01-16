import { IIndexableStockProfile } from '../../interfaces/stock-profile.interface';

import { CategoryProcessorService } from './category-processor.service';

import { mergeSort } from '../../algos/merge-sort.algo';

export class RiskProcessorService extends CategoryProcessorService {

    private static key = 'risk';

    private static targets = {

        standardDeviation: '>',

        sharpeRatio: '>',

        beta: '>',

        alpha: '>',

        rSquared: '<'
    };

    public static processRatios(profile: IIndexableStockProfile): number {

        const ratiosToProcess = Object.keys(profile[this.key]);

        let scaledScoreInProportionToWeight = 0;

        for (let i = 0 ; i < ratiosToProcess.length; i++) {

            const ratio = ratiosToProcess[i] as keyof typeof this.targets;

            const values = this.ratiosExtractorService.ratios[ratio];

            const sorted = mergeSort(values);

            const [highest, lowest] = this.deduceHighestAndLowestBasedOnTarget(this.targets[ratio], sorted);

            const scaledScore = 100 * (profile[this.key][ratio] - lowest) / (highest - lowest);

            scaledScoreInProportionToWeight += this.weightConfiguratorService.weights[ratio] * (scaledScore / 100);
        }

        return scaledScoreInProportionToWeight;
    }
}
