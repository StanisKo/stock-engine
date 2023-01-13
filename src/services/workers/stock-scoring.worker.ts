import { StockProfile } from '../../schemas/stock-profile.schema';

import { RatiosExtractorService } from '../helpers/ratios-extractor.service';


export default async (industry: string): Promise<void> => {

    const ratiosExtractorService = new RatiosExtractorService();

    const profilesToScore = await StockProfile.find({ industry }).lean();

    ratiosExtractorService.extractRatiosFromProfiles(profilesToScore);

    console.log(ratiosExtractorService);
};
