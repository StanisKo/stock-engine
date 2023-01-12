import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { WeightConfiguratorService } from '../core/weight-configurator.service';

import { mergeSort } from '../../utils/merge-sort.algo';


export default async (industry: string): Promise<IStockProfile[]> => {

    const weightConfiguratorService = new WeightConfiguratorService();

    const profilesToScore = await StockProfile.find({ industry }).lean();

    const scoredProfiles = [];

    for (let i = 0; i < profilesToScore.length; i++) {

        const profile = profilesToScore[i];

        let overallProfileScore = 0;

        const categoryScores = {
            cagr: 0, risk: 0, valuation: 0, profitability: 0, liquidity: 0, debt: 0, efficiency: 0
        };

        /*
        TODO: this has to be modularized
        */
        const categoriesToScore = Object.keys(categoryScores);

        for (let j = 0; j < categoriesToScore.length; j++) {

            const category = categoriesToScore[j];

            /*
            We tackle CAGR explicitly, as there are no ratios to it -- we treat it as a separate category
            */
            if (category === 'cagr') {

                const cagrValuesAcrossProfiles = [];

                for (let k = 0; k < profilesToScore.length; k++) {

                    cagrValuesAcrossProfiles.push(profilesToScore[k].cagr);
                }

                const sorted = mergeSort(cagrValuesAcrossProfiles);

                const highest = sorted[sorted.length - 1];

                const lowest = sorted[0];

                const scaledScore = 100 * (profile.cagr - lowest) / (highest - lowest);

                const scaledScoreInProportionToWeight = scaledScore * (weightConfiguratorService.weights.cagr / 100);

                categoryScores.cagr = scaledScoreInProportionToWeight;
            }
        }
    }
};
