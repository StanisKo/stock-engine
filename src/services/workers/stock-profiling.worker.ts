/* eslint-disable max-len */

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { IFundamentals } from '../../interfaces/fundamentals.interface';

/*
A meta-layer function sole purpose of which is to process batch of given fundamentals by using StockParsingService

Called in parallel on every batch by StockProfilingService
*/
export default async (batch: IFundamentals[], benchmarkPrices: ITickerPrice[], treasuryBondYield: number): Promise<IStockProfile[]> => {

    const stockProfiles: IStockProfile[] = [];

    for (let i = 0; i < batch.length; i++) {

        /*
        Request ticker prices
        */

        /*
        Pass fundamentals, prices, benchmark prices and yield into parser

        Consume profile from parser and return
        */
        const profile = {} as IStockProfile;

        stockProfiles.push(profile);
    }

    return stockProfiles;
};
