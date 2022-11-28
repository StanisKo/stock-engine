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

export interface ITickerSplit {

    execution_date: string;

    split_from: number;

    split_to: number;

    ticker: string;
}

export interface ITickerFinancialData {

    fundamentals: ITickerFundamentals,

    prices: ITickerPrice[],

    splits: ITickerSplit[],
}
