import moment from 'moment';

import { workerData } from 'node:worker_threads';

import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { IFundamentals } from '../../interfaces/fundamentals.interface';

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { ApiConnectorService } from '../core/api-connector.service';

import { StockParserService } from '../parsers/stock-parser.service';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

/*
A meta-layer function sole purpose of which is to process batch of given fundamentals by using StockParserService

Called in parallel on every batch by StockProfilingService
*/
export default async (batch: IFundamentals[]): Promise<IStockProfile[]> => {

    /*
    Since threads do not share memory with each other,
    we don't have access to connector from the main thread

    Worker threads support cloning of simple objects, or transfer of buffers

    None of these approaches are capable of sharing a static (initialized) class,
    therefore, we have no other way, but initialize it within the context of current thread
    */
    ApiConnectorService.initializeSharedFields();

    const stockProfiles: IStockProfile[] = [];

    /*
    Fortunately, we can share previously requested benchmark prices and treasury bond yield
    */
    const { benchmarkPrices, treasuryBondYield } = workerData;

    for (let i = 0; i < batch.length; i++) {

        const set = batch[i];

        let tickerPrices: ITickerPrice[] = [];

        /*
        If financial documents are exposed not in USD, we have to grab exchange rate
        for set's currency, since some calculations factor in price (which is always expressed in USD)
        */
        let exchangeRate;

        try {

            tickerPrices  = await ApiConnectorService.requestTickerPrices(
                set.ticker,
            );

            /*
            If prices are availalable, yet they do not fall into TTM margin, skip the stock
            */
            const [ttmMarginStart] = TimeSeriesHelperService.getTTMMargin();

            const pricesDoNotFallIntoTTMMargin = moment(tickerPrices[0].date).isAfter(
                moment(ttmMarginStart, 'MM-DD-YYYY')
            );

            if (pricesDoNotFallIntoTTMMargin) {

                continue;
            }

            const figuresExpressedIn = set.data.Financials.Balance_Sheet.yearly_last_0.currency_symbol;

            if (figuresExpressedIn !== 'USD') {

                exchangeRate = await ApiConnectorService.requestExchangeRateAgainstUSD(
                    figuresExpressedIn
                );
            }

        } catch (error) {

            /*
            If prices are unavailable for currently iterated ticker, skip the stock
            */
            continue;
        }

        const stockParserService = new StockParserService(
            set.data,
            tickerPrices,
            benchmarkPrices,
            treasuryBondYield,
            exchangeRate
        );

        const profile = stockParserService.parseStockProfile();

        stockProfiles.push(profile);
    }

    return stockProfiles;
};
