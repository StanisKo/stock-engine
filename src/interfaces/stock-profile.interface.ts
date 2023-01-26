/* eslint-disable @typescript-eslint/no-explicit-any */

import { MarketCapLabel } from '../enums';

export interface IStockProfile {

    score: number,

    ticker: string,

    industry: string,

    /*
    Compound Annual Growth Rate (CAGR) — mean annual growth rate of an investment
    over a specified period of time longer than one year.
    It represents one of the most accurate ways to calculate and determine returns for an asset.

    Target: > Industry Peers

    We're looking for HIGHEST CAGR since we need stocks that historically are most profitable
    */
    cagr: number,

    marketCap: {

    value: number,

    label: MarketCapLabel
    },

    risk: {

        standardDeviation: number,

        sharpeRatio: number,

        beta: number,

        alpha: number,

        rSquared: number
    },

    valuation: {

        priceToEarnings: number,

        priceToEarningsGrowth: number,

        priceToSales: number,

        priceToBook: number,

        enterpriseValueToRevenue: number,

        enterpriseValueToEbitda: number

        priceToFreeCashFlow: number
    },

    profitability: {

        returnOnAssets: number,

        returnOnEquity: number,

        profitMargin: number
    },

    liquidity: {

        currentRatio: number,

        quickRatio: number
    },

    debt: {

        debtToEquity: number,

        interestCoverage: number
    },

    efficiency: {

        assetTurnover: number,

        inventoryTurnover: number
    },

    dividends: {

        dividendYield: number,

        dividendPayout: number
    }
}

export interface IStockProfileSchema extends IStockProfile {

    _id: string
}

export interface IIndexableStockProfile extends IStockProfile {

    [key: string]: any
}
