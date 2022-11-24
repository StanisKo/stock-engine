// https://eodhistoricaldata.com/api/eod/AAPL.US?api_token=demo&fmt=json

import { ITickerFundamentals } from '../interfaces/ticker-fundamentals.interface';

import { ITickerPrice } from '../interfaces/ticker-price.interface';

export class FinancialApiService {

    ticker: string;

    apiUrl: string;

    constructor() {

        this.apiUrl = process.env.FINANCIAL_DATA_API_URL || '';
    }

    private async requestFundamentalTickerData(): Promise<ITickerFundamentals> {

        const request = await fetch(`${this.apiUrl}/fundamentals/${this.ticker}.US?api_token=demo`);

        const fundametals = await request.json() as ITickerFundamentals;

        return fundametals;
    }

    private async requestHistoricalTickerPrices(): Promise<ITickerPrice[]> {

        const request = await fetch(`${this.apiUrl}/eod/${this.ticker}.US?api_token=demo`);

        const prices = await request.json() as ITickerPrice[];

        return prices;
    }

    public async requestFinancicalTickerData(): Promise<{ fundamentals: ITickerFundamentals, prices: ITickerPrice[] }> {

        const fundamentals = await this.requestFundamentalTickerData();

        const prices = await this.requestHistoricalTickerPrices();

        return { fundamentals, prices };
    }
}
