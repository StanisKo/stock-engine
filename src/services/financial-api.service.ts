import fetch from 'node-fetch';

import yahooFinance from 'yahoo-finance2';

import {
    ITickerFundamentals,
    ITickerPrice,
    ITickerFinancialData,
    IBenchmarkPrice
} from '../interfaces/ticker.interface';

export class FinancialApiService {

    ticker: string;

    financialDataApiUrl: string;

    usTreasuryBondYieldApiURL: string;

    usTreasuryBondYieldApiKey: string;

    constructor(ticker: string) {

        this.ticker = ticker;

        this.financialDataApiUrl = process.env.FINANCIAL_DATA_API_URL || '';

        this.usTreasuryBondYieldApiURL = process.env.US_TREASURY_BOND_YIELD_API || '';

        this.usTreasuryBondYieldApiKey = process.env.US_TREASURY_BOND_YIELD_API_KEY || '';
    }

    private async requestFundamentalsTickerData(): Promise<ITickerFundamentals> {

        const request = await fetch(`${this.financialDataApiUrl}/fundamentals/${this.ticker}.US?api_token=demo`);

        const fundametals = await request.json() as ITickerFundamentals;

        return fundametals;
    }

    /*
    Use lib for prices on stocks as well
    */
    private async requestHistoricalBenchmarkPrices(): Promise<IBenchmarkPrice[]> {
        const historicalSP500Prices = await yahooFinance.historical(
            '^GSPC',
            {
                period1: '12-01-2021',
                period2: '12-01-2022',
                interval: '1d',
                includeAdjustedClose: true
            }
        );

        return historicalSP500Prices;
    }

    private async requestHistoricalTickerPrices(): Promise<ITickerPrice[]> {

        const request = await fetch(`${this.financialDataApiUrl}/eod/${this.ticker}.US?fmt=json&api_token=demo`);

        const prices = await request.json() as ITickerPrice[];

        return prices;
    }

    private async requestUSTreasuryBondYield(): Promise<number> {
        const request = await fetch(
            `${this.usTreasuryBondYieldApiURL}?limit=1&order=desc&api_key=${this.usTreasuryBondYieldApiKey}`
        );

        const data = await request.json();

        const indexer = data.dataset.column_names.indexOf('10 YR');

        const treasuryBondYield = data.dataset.data[0][indexer];

        return treasuryBondYield;
    }

    public async requestFinancicalTickerData(): Promise<ITickerFinancialData> {

        const fundamentals = await this.requestFundamentalsTickerData();

        const prices = await this.requestHistoricalTickerPrices();

        const treasuryBondYield = await this.requestUSTreasuryBondYield();

        console.log(`${this.ticker}: Fundamentals, prices and treasury bond yield data is successfully retrieved`);

        return { fundamentals, prices, treasuryBondYield };
    }
}
