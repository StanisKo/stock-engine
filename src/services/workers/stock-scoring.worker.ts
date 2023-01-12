import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { StockProfile } from '../../schemas/stock-profile.schema';


export default async (industry: string): Promise<IStockProfile[]> => {

    const profilesToScore = await StockProfile.find({ industry }).lean();

    
}