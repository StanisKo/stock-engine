import fetch from 'node-fetch';

import yahooFinance from 'yahoo-finance2';

import moment from 'moment';

import {
    ITickerFundamentals,
    ITickerPrice,
    ITickerFinancialData,
    IBenchmarkPrice
} from '../../interfaces/ticker.interface';

export class FinancialApiService {

    static benchmarkTicker: string;

    ticker: string;

    financialDataApiUrl: string;

    constructor(ticker: string) {

        FinancialApiService.benchmarkTicker = process.env.BENCHMARK_TICKER || '';

        this.ticker = ticker;

        this.financialDataApiUrl = process.env.FINANCIAL_DATA_API_URL || '';
    }

    private async requestFundamentalsTickerData(): Promise<ITickerFundamentals> {

        const request = await fetch(`${this.financialDataApiUrl}/fundamentals/${this.ticker}.US?api_token=demo`);

        const fundametals = await request.json() as ITickerFundamentals;

        return fundametals;
    }

    private async requestBenchmarkPrices(): Promise<IBenchmarkPrice[]> {

        const now = moment();

        let oneYearBack = moment().subtract(1, 'year');

        const dayOfWeekOneYearBack = oneYearBack.day();

        if (dayOfWeekOneYearBack === 5) {

            oneYearBack = oneYearBack.subtract(1, 'day');
        }

        if (dayOfWeekOneYearBack === 6) {

            oneYearBack = oneYearBack.subtract(2, 'day');
        }

        const benchmarkPrices = await yahooFinance.historical(
            FinancialApiService.benchmarkTicker,
            {
                period1: oneYearBack.format('MM-DD-YYYY'),
                period2: now.format('MM-DD-YYYY'),
                interval: '1d',
                includeAdjustedClose: true
            }
        ) as IBenchmarkPrice[];

        return benchmarkPrices;
    }

    private async requestHistoricalTickerPrices(): Promise<ITickerPrice[]> {

        const request = await fetch(`${this.financialDataApiUrl}/eod/${this.ticker}.US?fmt=json&api_token=demo`);

        const prices = await request.json() as ITickerPrice[];

        return prices;
    }

    public async requestFinancicalTickerData(): Promise<ITickerFinancialData> {

        const fundamentals = await this.requestFundamentalsTickerData();

        const prices = await this.requestHistoricalTickerPrices();

        const benchmarkPrices = await this.requestBenchmarkPrices();

        console.log(`${this.ticker}: Fundamentals, prices and benchmark data is successfully retrieved`);

        return { fundamentals, prices, benchmarkPrices };
    }
}