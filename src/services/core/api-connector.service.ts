/* eslint-disable max-len */

import moment from 'moment';
import fetch from 'node-fetch';
import yahooFinance from 'yahoo-finance2';

import { ITickerFundamentals, ITickerPrice, FundamentalsApiResponse } from '../../interfaces/ticker.interface';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

export class ApiConnectorService {

    private static EXCHANGES: string[];

    private static benchmarkTicker: string;

    private static fundametalsDataApiUrl: string;

    private static fundametalsDataApiKey: string;

    private static usTreasuryBondYieldApiURL: string;

    private static usTreasuryBondYieldApiKey: string;

    public static initialize(): void {

        this.EXCHANGES = process.env.EXCHANGES?.split(', ') ?? [];

        this.benchmarkTicker = process.env.BENCHMARK_TICKER || '';

        this.fundametalsDataApiUrl = process.env.FUNDAMENTALS_DATA_API_URL || '';

        this.fundametalsDataApiKey = process.env.FUNDAMENTALS_DATA_API_KEY || '';

        this.usTreasuryBondYieldApiURL = process.env.US_TREASURY_BOND_YIELD_API_URL || '';

        this.usTreasuryBondYieldApiKey = process.env.US_TREASURY_BOND_YIELD_API_KEY || '';
    }

    public static async requestBulkFundamentals(exchange: string, offset: number): Promise<FundamentalsApiResponse> {

        const request = await fetch(
            `${ApiConnectorService.fundametalsDataApiUrl}/${exchange}?api_token=${ApiConnectorService.fundametalsDataApiKey}&fmt=json&offset=${offset}&limit=500`
        );

        const outputFromExchnage = await request.json();

        return outputFromExchnage;
    }

    /*
    On this:

    Bulk endpoint point does not (yet) deliver IPODate, in such, we are forced to request
    it from individual ticker fundamentals' endpoint

    At least we can filter by Field::Field

    Sigh, this has to be improved
    */
    public static async requestTickerIPODate(ticker: string): Promise<string> {

        const request = await fetch(
            `${ApiConnectorService.fundametalsDataApiUrl}/${ticker}.US?api_token=${ApiConnectorService.fundametalsDataApiKey}&filter=General::IPODate`
        );

        const tickerIpoDate = await request.json();

        return tickerIpoDate;
    }

    /*
    We request ticker prices since IPO until latest price available
    */
    public static async requestTickerPrices(ticker: string, tickerIpoDate: string): Promise<ITickerPrice[]> {

        const prices = await yahooFinance.historical(
            ticker,
            {
                period1: moment(tickerIpoDate).format('MM-DD-YYYY'),
                period2: moment().format('MM-DD-YYYY'),
                interval: '1d',
                includeAdjustedClose: true
            }
        ) as ITickerPrice[];

        return prices;
    }

    /*
    We request benchmark prices as TTM
    */
    public static async requestBenchmarkPrices(): Promise<ITickerPrice[]> {

        /*
        API returns values one day into past, so we need to adapt our margins
        */
        const withOneDayForward = true;

        const [firstDayOfCurrentMonthOneYearBack, lastDayOfLastMonth] = TimeSeriesHelperService.getTTMMargin(
            withOneDayForward
        );

        const benchmarkPrices = await yahooFinance.historical(
            ApiConnectorService.benchmarkTicker,
            {
                period1: firstDayOfCurrentMonthOneYearBack,
                period2: lastDayOfLastMonth,
                interval: '1d',
                includeAdjustedClose: true
            }
        ) as ITickerPrice[];

        return benchmarkPrices;
    }

    public static async requestUSTreasuryBondYield(): Promise<number> {
        const request = await fetch(
            `${ApiConnectorService.usTreasuryBondYieldApiURL}?limit=1&order=desc&api_key=${ApiConnectorService.usTreasuryBondYieldApiKey}`
        );

        const data = await request.json();

        const indexer = data.dataset.column_names.indexOf('1 YR');

        const treasuryBondYield = data.dataset.data[0][indexer];

        return treasuryBondYield;
    }

    public static async requestBulkFundamentalsData(): Promise<ITickerFundamentals[]> {

        /*
        Initialize collection to hold API output
        */
        const bulkFundamentals = [];

        /*
        Loop through every exchange
        */
        for (let i = 0; i < ApiConnectorService.EXCHANGES.length; i++) {

            /*
            API delivers packets in batches of 500, therefore, we keep requesting data from
            exchange until it's fully saturated
            */
            let outputAvailable = true;

            const exchange = ApiConnectorService.EXCHANGES[i];

            let offset = 0;

            while (outputAvailable) {

                const outputFromExchnage = await this.requestBulkFundamentals(exchange, offset);

                if (Object.keys(outputFromExchnage).length) {

                    /*
                    Output from exchange is structured as { int: {} }, where int is index of the data packet
                    Therefore, before requesting the next batch, we flat out the output into initial collection
                    */
                    bulkFundamentals.push(...Object.entries(outputFromExchnage).map(output => output[1]));

                    offset += 500;
                } else {

                    outputAvailable = false;
                }
            }
        }

        return bulkFundamentals;
    }
}
