/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ITickerFundamentals {

    /*
    We have no intention of typing out the whole API response
    */
    [key: string]: any;
}

export interface ITickerPrice {

    date: string | Date;

    open: number;

    high: number;

    low: number;

    close: number;

    adjusted_close: number;

    adjClose?: number,

    volume: number;
}

export interface ITickerFinancialData {

    fundamentals: ITickerFundamentals,

    prices: ITickerPrice[],

    riskFreeBenchmarkPrices: ITickerPrice[],
}
