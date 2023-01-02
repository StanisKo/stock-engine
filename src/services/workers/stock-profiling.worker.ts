/* eslint-disable max-len */

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { IFundamentals } from '../../interfaces/fundamentals.interface';
import { ApiConnectorService } from '../core/api-connector.service';

/*
A meta-layer function sole purpose of which is to process batch of given fundamentals by using StockParsingService

Called in parallel on every batch by StockProfilingService
*/
export default async (batch: IFundamentals[], benchmarkPrices: ITickerPrice[], treasuryBondYield: number): Promise<IStockProfile[]> => {

    const stockProfiles: IStockProfile[] = [];

    for (let i = 0; i < batch.length; i++) {

        const set = batch[i];

        /*
        Request ticker prices
        */
        const tickerIpoDate = await ApiConnectorService.requestTickerIPODate(set.data.General.Code);

        const tickerPrices  = await ApiConnectorService.requestTickerPrices(
            set.data.General.Code,
            tickerIpoDate
        );

        /*
        Pass fundamentals, prices, benchmark prices and yield into parser

        Consume profile from parser and return
        */
        const profile = {} as IStockProfile;

        stockProfiles.push(profile);
    }

    return stockProfiles;
};
