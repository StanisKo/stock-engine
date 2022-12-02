import fetch from 'node-fetch';

import yahooFinance from 'yahoo-finance2';

import moment from 'moment';

import {
    ITickerFundamentals,
    ITickerPrice,
    ITickerFinancialData,
    IBenchmarkPrice
} from '../interfaces/ticker.interface';

export class FinancialApiService {

    /*
    We always scale tickers against SP500 returns
    */
    static riskFreeBenchmarkTicker = '^GSPC';

    ticker: string;

    financialDataApiUrl: string;

    constructor(ticker: string) {

        this.ticker = ticker;

        this.financialDataApiUrl = process.env.FINANCIAL_DATA_API_URL || '';
    }

    private async requestFundamentalsTickerData(): Promise<ITickerFundamentals> {

        const request = await fetch(`${this.financialDataApiUrl}/fundamentals/${this.ticker}.US?api_token=demo`);

        const fundametals = await request.json() as ITickerFundamentals;

        return fundametals;
    }

    /*
    TODO: Use lib for prices on stocks as well!
    */
    private async requestRiskFreeBenchmarkPrices(): Promise<IBenchmarkPrice[]> {

        const now = moment();

        let oneYearBack = moment().subtract(1, 'year');

        const dayOfWeekOneYearBack = oneYearBack.day();

        if (dayOfWeekOneYearBack === 5) {

            oneYearBack = oneYearBack.subtract(1, 'day');
        }

        if (dayOfWeekOneYearBack === 6) {

            oneYearBack = oneYearBack.subtract(2, 'day');
        }

        const riskFreeBenchmarkPrices = await yahooFinance.historical(
            FinancialApiService.riskFreeBenchmarkTicker,
            {
                period1: oneYearBack.format('MM-DD-YYYY'),
                period2: now.format('MM-DD-YYYY'),
                interval: '1d',
                includeAdjustedClose: true
            }
        );

        return riskFreeBenchmarkPrices;
    }

    private async requestHistoricalTickerPrices(): Promise<ITickerPrice[]> {

        const request = await fetch(`${this.financialDataApiUrl}/eod/${this.ticker}.US?fmt=json&api_token=demo`);

        const prices = await request.json() as ITickerPrice[];

        return prices;
    }

    public async requestFinancicalTickerData(): Promise<ITickerFinancialData> {

        const fundamentals = await this.requestFundamentalsTickerData();

        const prices = await this.requestHistoricalTickerPrices();

        const riskFreeBenchmarkPrices = await this.requestRiskFreeBenchmarkPrices();

        console.log(`${this.ticker}: Fundamentals, prices and risk free benchmark data is successfully retrieved`);

        return { fundamentals, prices, riskFreeBenchmarkPrices };
    }
}
