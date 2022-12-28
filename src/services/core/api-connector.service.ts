import moment from 'moment';
import fetch from 'node-fetch';
import yahooFinance from 'yahoo-finance2';

import { ITickerFundamentals, ITickerPrice, ITickerFinancialData } from '../../interfaces/ticker.interface';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

export class ApiConnectorService {

    static EXCHANGES = ['NASDAQ', 'NYSE', 'BATS','AMEX'];

    ticker: string;

    benchmarkTicker: string;

    fundametalsDataApiUrl: string;

    fundametalsDataApiKey: string;

    usTreasuryBondYieldApiURL: string;

    usTreasuryBondYieldApiKey: string;

    constructor() {

        this.benchmarkTicker = process.env.BENCHMARK_TICKER || '';

        this.fundametalsDataApiUrl = process.env.FUNDAMENTALS_DATA_API_URL || '';

        this.fundametalsDataApiKey = process.env.FUNDAMENTALS_DATA_API_KEY || '';

        this.usTreasuryBondYieldApiURL = process.env.US_TREASURY_BOND_YIELD_API_URL || '';

        this.usTreasuryBondYieldApiKey = process.env.US_TREASURY_BOND_YIELD_API_KEY || '';
    }

    async requestBulkFundamentalsData(): Promise<ITickerFundamentals[][]> {

        const bulkFundamentals = [];

        for (let i = 0; i < ApiConnectorService.EXCHANGES.length; i++) {

            const exchange = ApiConnectorService.EXCHANGES[i];

            const request = await fetch(
                `${this.fundametalsDataApiUrl}/${exchange}?api_token=${this.fundametalsDataApiKey}&fmt=json`
            );

            const outputFromExchnage = await request.json() as ITickerFundamentals[];

            console.log(outputFromExchnage);

            bulkFundamentals.push(outputFromExchnage);
        }

        return bulkFundamentals;
    }

    private async requestFundamentalsTickerData(): Promise<ITickerFundamentals> {

        const request = await fetch(
            `${this.fundametalsDataApiUrl}/${this.ticker}.US?api_token=${this.fundametalsDataApiKey}`
        );

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
        ) as ITickerPrice[];

        return benchmarkPrices;
    }

    private async requestUSTreasuryBondYield(): Promise<number> {
        const request = await fetch(
            `${this.usTreasuryBondYieldApiURL}?limit=1&order=desc&api_key=${this.usTreasuryBondYieldApiKey}`
        );

        const data = await request.json();

        const indexer = data.dataset.column_names.indexOf('1 YR');

        const treasuryBondYield = data.dataset.data[0][indexer];

        return treasuryBondYield;
    }

    public async requestFinancicalTickerData(): Promise<ITickerFinancialData> {

        const fundamentals = await this.requestFundamentalsTickerData();

        const prices = await this.requestHistoricalTickerPrices(fundamentals.General.IPODate);

        const benchmarkPrices = await this.requestBenchmarkPrices();

        const treasuryBondYield = await this.requestUSTreasuryBondYield();

        console.log(
            `${this.ticker}: Fundamentals, prices, benchmark and treasury bond yield data is successfully retrieved`
        );

        return { fundamentals, prices, benchmarkPrices, treasuryBondYield };
    }
}
