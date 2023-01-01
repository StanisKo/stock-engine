/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ITickerFundamentals {

    /*
    We have no intention of typing out the whole API response
    */
    [key: string]: any;
}

export interface ITickerPrice {

    date: Date;

    open: number;

    high: number;

    low: number;

    close: number;

    adjClose: number;

    volume: number;
}

export type FundamentalsApiResponse = { [key: number]: ITickerFundamentals };

/*
TODO: remove and break down
*/
export interface ITickerFinancialData {

    fundamentals: ITickerFundamentals,

    prices: ITickerPrice[],

    benchmarkPrices: ITickerPrice[],

    treasuryBondYield: number
}
