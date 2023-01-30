/* eslint-disable @typescript-eslint/no-explicit-any */

import { MarketCapLabel } from '../enums';

export interface IStockProfile {

    score: number,

    ticker: string,

    industry: string,

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
