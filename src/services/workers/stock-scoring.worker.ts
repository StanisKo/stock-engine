import mongoose from 'mongoose';

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { Industry } from '../../schemas/industry.schema';

import { RatiosExtractorService } from '../helpers/ratios-extractor.service';


export default async (industry: string): Promise<IStockProfile[]> => {

    const ratiosExtractorService = new RatiosExtractorService();

    /*
    NOTE: newly spawned threads do not share database connection established in the main thread

    Therefore, we need to manually hook into database from each thread
    */
    const { MONGO_PROTOCOL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;

    await mongoose.connect(
        `${MONGO_PROTOCOL}://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`
    );

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

    console.log(JSON.stringify(ratiosExtractorService, null, 4));

    return scoredProfiles;
};
