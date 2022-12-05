/* eslint-disable @typescript-eslint/no-unused-vars */

import moment from 'moment';
import fetch from 'node-fetch';
import yahooFinance from 'yahoo-finance2';

import { ITickerFundamentals, ITickerPrice, ITickerFinancialData } from '../../interfaces/ticker.interface';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

export class FinancialApiService {

    ticker: string;

    benchmarkTicker: string;

    fundametalsDataApiUrl: string;

    constructor(ticker: string) {

        this.ticker = ticker;

        this.benchmarkTicker = process.env.BENCHMARK_TICKER || '';

        this.fundametalsDataApiUrl = process.env.FUNDAMENTALS_DATA_API_URL || '';
    }

    private async requestFundamentalsTickerData(): Promise<ITickerFundamentals> {

        const request = await fetch(`${this.fundametalsDataApiUrl}/${this.ticker}.US?api_token=demo`);

        const fundametals = await request.json() as ITickerFundamentals;

        return fundametals;
    }

    /*
    We request ticker prices since IPO until latest price available
    */
    private async requestHistoricalTickerPrices(tickerIpoDate: string): Promise<ITickerPrice[]> {

        const prices = await yahooFinance.historical(
            this.ticker,
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
    private async requestBenchmarkPrices(): Promise<ITickerPrice[]> {

        let [firstDayOfCurrentMonthOneYearBack, lastDayOfLastMonth] = TimeSeriesHelperService.getTTMMargin();

        /*
        It seems that for benchmark ticker API returns values one day into past,
        so we need to do additional ops for the sake of precision
        */
        firstDayOfCurrentMonthOneYearBack = moment(
            firstDayOfCurrentMonthOneYearBack, 'MM-DD-YYYY').add(1, 'day').format('MM-DD-YYYY');

        lastDayOfLastMonth = moment(
            lastDayOfLastMonth, 'MM-DD-YYYY').add(1, 'day').format('MM-DD-YYYY');

        const benchmarkPrices = await yahooFinance.historical(
            this.benchmarkTicker,
            {
                period1: firstDayOfCurrentMonthOneYearBack,
                period2: lastDayOfLastMonth,
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
