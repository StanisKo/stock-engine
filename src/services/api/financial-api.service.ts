/* eslint-disable @typescript-eslint/no-unused-vars */

import moment from 'moment';
import fetch from 'node-fetch';
import yahooFinance from 'yahoo-finance2';

import {
    ITickerFundamentals,
    ITickerPrice,
    ITickerFinancialData
} from '../../interfaces/ticker.interface';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

export class FinancialApiService {

    static benchmarkTicker: string;

    ticker: string;

    financialDataApiUrl: string;

    ttmMargin: [string, string];

    constructor(ticker: string) {

        FinancialApiService.benchmarkTicker = process.env.BENCHMARK_TICKER || '';

        this.ticker = ticker;

        this.financialDataApiUrl = process.env.FINANCIAL_DATA_API_URL || '';

        this.ttmMargin = TimeSeriesHelperService.getTTMMargin();
    }

    private async requestFundamentalsTickerData(): Promise<ITickerFundamentals> {

        const request = await fetch(`${this.financialDataApiUrl}/fundamentals/${this.ticker}.US?api_token=demo`);

        const fundametals = await request.json() as ITickerFundamentals;

        return fundametals;
    }

    /*
    We request ticker prices since IPO date
    */
    private async requestHistoricalTickerPrices(tickerIpoDate: string): Promise<ITickerPrice[]> {

        const [_, now] = this.ttmMargin;

        const prices = await yahooFinance.historical(
            this.ticker,
            {
                period1: moment(tickerIpoDate).format('MM-DD-YYYY'),
                period2: now,
                interval: '1d',
                includeAdjustedClose: true
            }
        ) as ITickerPrice[];

        return prices;
    }

    /*
    We request benchmark prices as TTM
    */
    private async requestBenchmarkPrices(): Promise<ITickerPrice[]> {

        const [oneYearBack, now] = this.ttmMargin;

        const benchmarkPrices = await yahooFinance.historical(
            FinancialApiService.benchmarkTicker,
            {
                period1: oneYearBack,
                period2: now,
                interval: '1d',
                includeAdjustedClose: true
            }
        ) as ITickerPrice[];

        return benchmarkPrices;
    }

    public async requestFinancicalTickerData(): Promise<ITickerFinancialData> {

        const fundamentals = await this.requestFundamentalsTickerData();

        const prices = await this.requestHistoricalTickerPrices(fundamentals.General.IPODate);

        const benchmarkPrices = await this.requestBenchmarkPrices();

        console.log(`${this.ticker}: Fundamentals, prices and benchmark data is successfully retrieved`);

        return { fundamentals, prices, benchmarkPrices };
    }
}
