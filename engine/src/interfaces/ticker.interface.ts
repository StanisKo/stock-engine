/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ITickerFundamentals {

    /*
    We have no intention of typing out the whole API response
    */
    [key: string]: any;
}

export interface ITickerPrice {

    date: string;

    open: number;

    high: number;

    low: number;

    close: number;

    adjusted_close: number;

    volume: number;
}

export interface IBenchmarkPrice {

    date: Date;

    open: number;

    high: number;

    low: number;

    close: number;

    adjClose: number;

    volume: number;
}

/*
Exists to perform equiavalent calculations over prices fetched from different sources
*/
export interface IGenericPrice {

    adjusted_close: number;

    adjClose: number;
}

export type FundamentalsApiResponse = { [key: number]: ITickerFundamentals };
