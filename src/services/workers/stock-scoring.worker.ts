import { establishDatabaseConnection } from '../../utils/database.connector';

import { IIndexableStockProfile, IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { Industry } from '../../schemas/industry.schema';

import { RatiosExtractorService } from '../helpers/ratios-extractor.service';

import { WeightConfiguratorService } from '../core/weight-configurator.service';

import { StockProcessorService } from '../processors/stock-processor.service';

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

    let scoredProfiles: IStockProfile[] = [];

    /*
    Initialize ratios storage and weights
    */
    const ratiosExtractorService = new RatiosExtractorService();

    const weightConfiguratorService = new WeightConfiguratorService();

    /*
    Query profiles related to given industry
    */
    const profilesToScore = await StockProfile.find({ industry }).lean() as IIndexableStockProfile[];

    /*
    If no profiles exist for given industry -- stocks were discarded during profiling
    Remove empty industry
    */
    if (!profilesToScore.length) {

        await Industry.deleteOne({ name: industry });

        return scoredProfiles;
    }

    /*
    If there is only one stock in the industry, we do not score it, as we cannot
    make an objective judgement whether it is a good stock or bad stock
    */
    if (profilesToScore.length === 1) {

        return profilesToScore;
    }

    /*
    Precalculate and store inputs for processors
    */
    ratiosExtractorService.extractRatiosFromProfiles(profilesToScore);

    /*
    Make data and weights accessible to processors and score
    */
    StockProcessorService.ratiosExtractorService = ratiosExtractorService;

    StockProcessorService.weightConfiguratorService = weightConfiguratorService;

    scoredProfiles = StockProcessorService.processCategory(profilesToScore);

    return scoredProfiles;
};
