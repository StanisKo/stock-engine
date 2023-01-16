import { establishDatabaseConnection } from '../../utils/database.connector';

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { Industry } from '../../schemas/industry.schema';

import { RatiosExtractorService } from '../helpers/ratios-extractor.service';

import { WeightConfiguratorService } from '../core/weight-configurator.service';

import { CategoryProcessorService } from '../processors/category-processor.service';

/*
A meta-layer function that queries profiles by given industry and scores them using various processors

Called in parallel on every industry by StockScoringService
*/
export default async (industry: string): Promise<IStockProfile[]> => {

    /*
    NOTE: newly spawned threads do not share database connection established in the main thread
    Therefore, we need to manually hook into database from each thread
    */
    await establishDatabaseConnection();

    const scoredProfiles: IStockProfile[] = [];

    /*
    Initialize ratios storage and weights
    */
    const ratiosExtractorService = new RatiosExtractorService();

    const weightConfiguratorService = new WeightConfiguratorService();

    /*
    Query profiles related to given industry
    */
    const profilesToScore = await StockProfile.find({ industry }).lean();

    /*
    If no profiles exist for given industry -- stocks were discarded during profiling
    Remove empty industry
    */
    if (!profilesToScore.length) {

        await Industry.deleteOne({ name: industry });

        return scoredProfiles;
    }

    /*
    Precalculate and store inputs for processors
    */
    ratiosExtractorService.extractRatiosFromProfiles(profilesToScore);

    /*
    Make data and weights accessible to processors
    */
    CategoryProcessorService.ratiosExtractorService = ratiosExtractorService;

    CategoryProcessorService.weightConfiguratorService = weightConfiguratorService;

    for (let i = 0; i < profilesToScore.length; i++) {

        let overallProfileScore = 0;

        const profile = profilesToScore[i];

        const categoryScores = {
            cagr: 0, risk: 0, valuation: 0, profitability: 0, liquidity: 0, debt: 0, efficiency: 0
        };

        const categories = Object.keys(categoryScores);

        for (let j = 0; j < categories.length; j++) {

            const category = categories[j];

            const scaledScoreInProportionToWeight = CategoryProcessorService.processCategory(
                category,
                profile
            );

            categoryScores[category as keyof typeof categoryScores] = scaledScoreInProportionToWeight;
        }

        overallProfileScore = Object.values(categoryScores).reduce((a, b) => a + b);

        profile.score = overallProfileScore;
    }

    return scoredProfiles;
};
