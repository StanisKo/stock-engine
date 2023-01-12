import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';

import { WeightConfiguratorService } from '../core/weight-configurator.service';


export default async (industry: string): Promise<IStockProfile[]> => {

    const weightConfiguratorService = new WeightConfiguratorService();

    const profilesToScore = await StockProfile.find({ industry }).lean();

    for (let i = 0; i < profilesToScore.length; i++) {


    }
}