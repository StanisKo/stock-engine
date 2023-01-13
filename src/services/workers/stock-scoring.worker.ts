import { establishDatabaseConnection } from '../../utils/database.connector';

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { Industry } from '../../schemas/industry.schema';

import { RatiosExtractorService } from '../helpers/ratios-extractor.service';

/*
A meta-layer function that queries profiles by given industry and scores them using various processors

Called in parallel on every industry by StockScoringService
*/
export default async (industry: string): Promise<IStockProfile[]> => {

    const ratiosExtractorService = new RatiosExtractorService();

    /*
    NOTE: newly spawned threads do not share database connection established in the main thread

    Therefore, we need to manually hook into database from each thread
    */
    await establishDatabaseConnection();

    const profilesToScore = await StockProfile.find({ industry }).lean();

    const scoredProfiles: IStockProfile[] = [];

    /*
    If no profiles exist for given industry -- stocks were discarded during profiling

    Remove empty industry
    */
    if (!profilesToScore.length) {

        await Industry.deleteOne({ name: industry });

        return scoredProfiles;
    }

    ratiosExtractorService.extractRatiosFromProfiles(profilesToScore);

    return scoredProfiles;
};
