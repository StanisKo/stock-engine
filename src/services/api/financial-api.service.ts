import fetch from 'node-fetch';
import yahooFinance from 'yahoo-finance2';

import {
    ITickerFundamentals,
    ITickerPrice,
    ITickerFinancialData,
    IBenchmarkPrice
} from '../../interfaces/ticker.interface';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

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

    /*
    We request ticker prices since IPO date
    */
    private async requestHistoricalTickerPrices(): Promise<ITickerPrice[]> {

        const request = await fetch(`${this.financialDataApiUrl}/eod/${this.ticker}.US?fmt=json&api_token=demo`);

        const prices = await request.json() as ITickerPrice[];

        return prices;
    }

    /*
    We request benchmark prices as TTM
    */
    private async requestBenchmarkPrices(): Promise<IBenchmarkPrice[]> {

        const [oneYearBack, now] = TimeSeriesHelperService.returnTTMMargin('MM-DD-YYYY');

        const benchmarkPrices = await yahooFinance.historical(
            FinancialApiService.benchmarkTicker,
            {
                period1: oneYearBack,
                period2: now,
                interval: '1d',
                includeAdjustedClose: true
            }
        ) as IBenchmarkPrice[];

        return benchmarkPrices;
    }

    public async requestFinancicalTickerData(): Promise<ITickerFinancialData> {

        const fundamentals = await this.requestFundamentalsTickerData();

        const prices = await this.requestHistoricalTickerPrices();

        const benchmarkPrices = await this.requestBenchmarkPrices();

        console.log(`${this.ticker}: Fundamentals, prices and benchmark data is successfully retrieved`);

        return { fundamentals, prices, benchmarkPrices };
    }
}
