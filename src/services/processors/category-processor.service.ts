/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { WeightConfiguratorService } from '../core/weight-configurator.service';

import { mergeSort } from '../../algos/merge-sort.algo';

export class CategoryProcessorService {

    public static weightConfiguratorService: WeightConfiguratorService;

    public static processCategory(category: string, profile: IStockProfile, valuesToScore?: number[]): number {

        let scaledScoreInProportionToWeight = 0;

        /*
        We tackle CAGR explicitly, as there are no ratios to it -- we treat it as a separate category

        In such, we also pass CAGR values accross profiles from the outside, to avoid unnecessary queries
        */
        if (category === 'cagr') {

            /*
            We first merge sort the values

            Then, grab the highest and lowest, and calculate scaled score of the category based on them

            Since our scaled score ranges from 0 to 100, we need to bring it to the proportion this score
            would occupy in relation to other categories

            In such, we multiply the weight on calculated score divided by 100, to get to the proportion
            that score occupied within the weight

            E.g.: weight * (score / 100) = 14.2 * (42 / 100)
            */
            const sorted = mergeSort(valuesToScore!);

            const highest = sorted[sorted.length - 1];

            const lowest = sorted[0];

            const scaledScore = 100 * (profile.cagr - lowest) / (highest - lowest);

            scaledScoreInProportionToWeight = this.weightConfiguratorService.weights.cagr * (scaledScore / 100);
        }
        else {

            /*
            We process by ratio
            */
        }

        return scaledScoreInProportionToWeight;
    }
}
