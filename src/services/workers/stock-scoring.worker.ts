import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { WeightConfiguratorService } from '../core/weight-configurator.service';

import { RatiosExtractorService } from '../helpers/ratios-extractor.service';


export default async (industry: string): Promise<void> => {

    const weightConfiguratorService = new WeightConfiguratorService();

    const ratiosExtractorService = new RatiosExtractorService();

    const profilesToScore = await StockProfile.find({ industry }).lean();

    // const scoredProfiles = [];

    ratiosExtractorService.extractRatiosFromProfiles(profilesToScore);

    // const categoryScores = {
    //     cagr: 0, risk: 0, valuation: 0, profitability: 0, liquidity: 0, debt: 0, efficiency: 0
    // };
};
