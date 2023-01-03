/* eslint-disable max-len */

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { IFundamentals } from '../../interfaces/fundamentals.interface';

import { ApiConnectorService } from '../core/api-connector.service';

import { StockParsingService } from '../core/stock-parsing.service';

/*
A meta-layer function sole purpose of which is to process batch of given fundamentals by using StockParsingService

Called in parallel on every batch by StockProfilingService
*/
export default async (batch: IFundamentals[]): Promise<IStockProfile[]> => {

    /*
    Since threads do not share memery with each other (unless explicitly specified),
    we don't have access to connector from the main thread

    Worked threads support cloning of simple objects, or transfer of buffers

    None of these approaches are capable of sharing a static (initialized) class,
    therefore, we have no other way, but initialize it within the context of current thread
    */
    ApiConnectorService.initializeSharedFields();

    const stockProfiles: IStockProfile[] = [];

    for (let i = 0; i < batch.length; i++) {

        const set = batch[i];

        const tickerIpoDate = await ApiConnectorService.requestTickerIPODate(set.data.General.Code);

        const tickerPrices  = await ApiConnectorService.requestTickerPrices(
            set.data.General.Code,
            tickerIpoDate
        );

        const stockParsingService = new StockParsingService(set, tickerPrices);

        const profile = stockParsingService.parseOutStockProfile();

        stockProfiles.push(profile);
    }

    return stockProfiles;
};
