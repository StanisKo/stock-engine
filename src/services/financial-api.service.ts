import fetch from 'node-fetch';

import { ITickerFundamentals, ITickerPrice, ITickerSplit,  ITickerFinancialData } from '../interfaces/ticker.interface';

export class FinancialApiService {

    ticker: string;

    financialDataApiUrl: string;

    splitsApiUrl: string;

    splitsApiKey: string;

    constructor(ticker: string) {

        this.ticker = ticker;

        this.financialDataApiUrl = process.env.FINANCIAL_DATA_API_URL || '';

        this.splitsApiUrl = process.env.STOCK_SPLITS_DATA_API_URL || '';

        this.splitsApiKey = process.env.STOCK_SPLITS_DATA_API_KEY || '';
    }

    private async requestFundamentalsTickerData(): Promise<ITickerFundamentals> {

        const request = await fetch(`${this.financialDataApiUrl}/fundamentals/${this.ticker}.US?api_token=demo`);

        const fundametals = await request.json() as ITickerFundamentals;

        return fundametals;
    }

    private async requestHistoricalTickerPrices(): Promise<ITickerPrice[]> {

        const request = await fetch(`${this.financialDataApiUrl}/eod/${this.ticker}.US?fmt=json&api_token=demo`);

        const prices = await request.json() as ITickerPrice[];

        return prices;
    }

    /*
    TODO: make sure both normal and reverse splits are provided into calculation!
    */
    private async requestSplitsTickerData(): Promise<ITickerSplit[]> {

        const request = await fetch(
            `${this.splitsApiUrl}?ticker=${this.ticker}&reverse_split=false&apiKey=${this.splitsApiKey}`
        );

        const splits = (await request.json() as { results: ITickerSplit[] }).results;

        return splits;
    }

    public async requestFinancicalTickerData(): Promise<ITickerFinancialData> {

        const fundamentals = await this.requestFundamentalsTickerData();

        const prices = await this.requestHistoricalTickerPrices();

        const splits = await this.requestSplitsTickerData();

        return { fundamentals, prices, splits };
    }
}
