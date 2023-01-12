import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { WeightConfiguratorService } from '../core/weight-configurator.service';


export default async (industry: string): Promise<IStockProfile[]> => {

    const weightConfiguratorService = new WeightConfiguratorService();

    const profilesToScore = await StockProfile.find({ industry }).lean();

    for (let i = 0; i < profilesToScore.length; i++) {

        const profile = profilesToScore[i];

        let overallProfileScore = 0;

        const categoryScores = {

            cagr: 0,

            risk: 0,

            valuation: 0,

            profitability: 0,

            liquidity: 0,

            debt: 0,

            efficiency: 0
        };


    }
};