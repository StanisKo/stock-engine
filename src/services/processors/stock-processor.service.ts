/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { IIndexableStockProfile } from '../../interfaces/stock-profile.interface';
import { IProcessor } from '../../interfaces/processor.interface';

import { RatiosExtractorService } from '../helpers/ratios-extractor.service';
import { WeightConfiguratorService } from '../core/weight-configurator.service';

import { RiskProcessorService } from './risk-processor.service';
import { ValuationProcessorService } from './valuation-processor.service';
import { ProfitabilityProcessorService } from './profitability-processor.service';
import { LiquidityProcessorService } from './liquidity-processor.service';
import { DebtProcessorService } from './debt-processor.service';
import { EfficiencyProcessorService } from './efficiency-processor.service';

import { mergeSort } from '../../algos/merge-sort.algo';


export class StockProcessorService {

    public static ratiosExtractorService: RatiosExtractorService;

    public static weightConfiguratorService: WeightConfiguratorService;

    /*
    Used explicitly for CAGR and declared here to avoid re-declaration in calls

    Each sub-processor defines this field according to it's own targets
    */
    private static target = '>';

    private static processorsMap: { [key: string]: IProcessor } = {

        risk: RiskProcessorService,

        valuation: ValuationProcessorService,

        profitability: ProfitabilityProcessorService,

        liquidity: LiquidityProcessorService,

        debt: DebtProcessorService,

        efficiency: EfficiencyProcessorService
    };

    public static processCategory(profilesToScore: IIndexableStockProfile[]): IIndexableStockProfile[] {

        /*
        Loop through profiles
        */
        for (let i = 0; i < profilesToScore.length; i++) {

            let overallProfileScore = 0;

            const profile = profilesToScore[i];

            const categoryScores = {
                cagr: 0, risk: 0, valuation: 0, profitability: 0, liquidity: 0, debt: 0, efficiency: 0
            };

            const categories = Object.keys(categoryScores) as (keyof typeof categoryScores)[];

            /*
            Loop through categories in each profile
            */
            for (let j = 0; j < categories.length; j++) {

                const category = categories[j];

                /*
                Score for the processed category
                */
                let scaledScoreInProportionToWeight = 0;

                /*
                We tackle CAGR explicitly, as there are no ratios to it -- we treat it as a separate category
                */
                if (category === 'cagr') {

                    /*
                    We first merge sort the values

                    Then, grab the highest and lowest, and calculate scaled score of the category based on them

                    Since our scaled score ranges from 0 to 100, we need to bring it to the proportion this score
                    would occupy in relation to other categories

                    In such, we multiply the weight on calculated score, to get to the proportion
                    that score occupied within the weight

                    E.g.: weight * score = 14.2 * 0.42
                    */
                    const sorted = mergeSort(this.ratiosExtractorService.ratios.cagr);

                    const [highest, lowest] = this.deduceHighestAndLowestBasedOnTarget(this.target, sorted);

                    const scaledScore = (profile.cagr - lowest) / (highest - lowest);

                    scaledScoreInProportionToWeight = this.weightConfiguratorService.weights.cagr * scaledScore;
                }
                else {

                    /*
                    Otherwise, we make use of one of the sub-processor classes:

                    Each of them defines it's own targets (per ratio)

                    We index the implementation out of the processors map and let it process ratios for given category:

                    1. Calculate scaled score per ratio and bring it to weight

                    2. Sum ratio scores (resulting in category scaled score) and bring it to weight

                    3. Return here and write to the map of category scores

                    */
                    scaledScoreInProportionToWeight = this.processorsMap[category].processRatios(profile);
                }

                categoryScores[category] = scaledScoreInProportionToWeight;
            }

            overallProfileScore = Object.values(categoryScores).reduce((a, b) => a + b);

            profile.score = overallProfileScore;
        }

        return profilesToScore;
    }

    public static deduceHighestAndLowestBasedOnTarget(target: string, input: number[]): [number, number] {

        const highestIndex = target === '>' ? input.length - 1 : 0;

        const lowestIndex = target === '>' ? 0 : input.length - 1;

        return [input[highestIndex], input[lowestIndex]];
    }
}
