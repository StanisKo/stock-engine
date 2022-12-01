import fetch from 'node-fetch';

import {
    ITickerFundamentals,
    ITickerPrice,
    ITickerFinancialData
} from '../interfaces/ticker.interface';

export class FinancialApiService {

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

    private async requestHistoricalTickerPrices(): Promise<ITickerPrice[]> {

        const request = await fetch(`${this.financialDataApiUrl}/eod/${this.ticker}.US?fmt=json&api_token=demo`);

        const prices = await request.json() as ITickerPrice[];

        return prices;
    }

    public async requestFinancicalTickerData(): Promise<ITickerFinancialData> {

        const temp = await fetch(
            'https://data.nasdaq.com/api/v3/datasets/USTREASURY/YIELD.json?limit=1&order=desc&api_key=YQjU9q7quLJ7hdx3vszh'
        );

        const data = await temp.json();

        const indexer = data.dataset.column_names.indexOf('10 YR');

        const foo = data.dataset.data[0][indexer];

        console.log(foo);

        console.log(`Retrieving data on ${this.ticker}`);

        const fundamentals = await this.requestFundamentalsTickerData();

        const prices = await this.requestHistoricalTickerPrices();

        console.log(`Fundamentals and prices data on ${this.ticker} is successfully retrieved`);

        return { fundamentals, prices };
    }
}
