import { IStockProfile } from '../../interfaces/stock-profile.interface';

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

    /*
    Each sub-class must implement mountable logic that is applied to it's ratios
    */
    public static processRatios(profile: IStockProfile): void {

        const ratiosToProcess = Object.keys(profile[this.key as keyof IStockProfile]);

        for (let i = 0 ; i < ratiosToProcess.length; i++) {

            const ratio = ratiosToProcess[i];

            const values = this.ratiosExtractorService.ratios[ratio];

            const sorted = mergeSort(values);

            const [highest, lowest] = this.deduceHighestAndLowestBasedOnTarget(
                this.targets[ratio as keyof typeof this.targets],
                sorted
            );

            const scaledScore = 100 * (profile.cagr - lowest) / (highest - lowest);

            scaledScoreInProportionToWeight = this.weightConfiguratorService.weights[ratio] * (scaledScore / 100);
        }
    }
}
