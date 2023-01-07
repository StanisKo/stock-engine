/* eslint-disable max-len */

import fetch from 'node-fetch';

import yahooFinance from 'yahoo-finance2';

import {
    ITickerFundamentals,
    ITickerPrice,
    IBenchmarkPrice,
    FundamentalsApiResponse
} from '../../interfaces/ticker.interface';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

export class ApiConnectorService {

    private static EXCHANGES: string[];

    private static benchmarkTicker: string;

    private static fundametalsDataApiUrl: string;

    private static fundametalsDataApiKey: string;

    private static usTreasuryBondYieldApiURL: string;

    private static usTreasuryBondYieldApiKey: string;

    public static initializeSharedFields(): void {

        this.EXCHANGES = process.env.EXCHANGES?.split(', ') ?? [];

        this.benchmarkTicker = process.env.BENCHMARK_TICKER || '';

        this.fundametalsDataApiUrl = process.env.FUNDAMENTALS_DATA_API_URL || '';

        this.fundametalsDataApiKey = process.env.FUNDAMENTALS_DATA_API_KEY || '';

        this.usTreasuryBondYieldApiURL = process.env.US_TREASURY_BOND_YIELD_API_URL || '';

        this.usTreasuryBondYieldApiKey = process.env.US_TREASURY_BOND_YIELD_API_KEY || '';
    }

    public static async requestBulkFundamentals(exchange: string, offset: number): Promise<FundamentalsApiResponse> {

        const request = await fetch(
            `${this.fundametalsDataApiUrl}/bulk-fundamentals/${exchange}?api_token=${this.fundametalsDataApiKey}&version=1.2&fmt=json&offset=${offset}&limit=500`
        );

        const outputFromExchnage = await request.json();

        return outputFromExchnage;
    }

    public static async requestTickerFundamentals(ticker: string): Promise<ITickerFundamentals> {

        let fundamentals;

        try {

            const request = await fetch(
                `${this.fundametalsDataApiUrl}/fundamentals/${ticker}.US?api_token=${this.fundametalsDataApiKey}`
            );

            fundamentals = await request.json();
        }
        catch (_) {

            /*
            Bubble up the error if fundametals are unavailable for provided ticker
            */
            throw new Error();

        }

        return fundamentals;
    }

    /*
    We request ticker prices since IPO until latest price available
    */
    public static async requestTickerPrices(ticker: string): Promise<ITickerPrice[]> {

        let prices: ITickerPrice[] = [];

        try {

            const request = await fetch(
                `${this.fundametalsDataApiUrl}/eod/${ticker}.US?api_token=${this.fundametalsDataApiKey}&fmt=json`
            );

            prices = await request.json();

        } catch (_) {

            /*
            Bubble up the error if prices are unavailable for provided ticker
            */
            throw new Error();
        }

        return prices;
    }

    /*
    We request benchmark prices as TTM
    */
    public static async requestBenchmarkPrices(): Promise<IBenchmarkPrice[]> {

        /*
        API returns values one day into past, so we need to adapt our margins
        */
        const withOneDayForward = true;

        const [firstDayOfCurrentMonthOneYearBack, lastDayOfLastMonth] = TimeSeriesHelperService.getTTMMargin(
            withOneDayForward
        );

        const benchmarkPrices = await yahooFinance.historical(
            this.benchmarkTicker,
            {
                period1: firstDayOfCurrentMonthOneYearBack,
                period2: lastDayOfLastMonth,
                interval: '1d',
                includeAdjustedClose: true
            }
        ) as IBenchmarkPrice[];

        return benchmarkPrices;
    }

    public static async requestUSTreasuryBondYield(): Promise<number> {
        const request = await fetch(
            `${this.usTreasuryBondYieldApiURL}?limit=1&order=desc&api_key=${this.usTreasuryBondYieldApiKey}`
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
        for (let i = 0; i < this.EXCHANGES.length; i++) {

            /*
            API delivers packets in batches of 500, therefore, we keep requesting data from
            exchange until it's fully saturated
            */
            let outputAvailable = true;

            const exchange = this.EXCHANGES[i];

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
