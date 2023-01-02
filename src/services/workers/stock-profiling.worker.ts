import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { IFundamentals } from '../../interfaces/fundamentals.interface';

class StockProfilingWorker {

    public static async process(fundamentals: IFundamentals): Promise<IStockProfile> {

        const ticker = fundamentals.data.General.Code;
    }

}

export const profile = async (batch: IFundamentals[]): Promise<IStockProfile[]> => {

    const stockProfiles: IStockProfile[] = [];

    for (let i = 0; i < batch.length; i++) {

        const profile = await StockProfilingWorker.process(batch[i]);

        stockProfiles.push(profile);
    }

    return stockProfiles;
};
