import * as uuid from 'uuid';

import mongoose from 'mongoose';

import { IStockProfileSchema } from '../interfaces/stock-profile.interface';

const stockProfileSchema = new mongoose.Schema<IStockProfileSchema>(
    {
        _id: { type: String, default: uuid.v4 },

        ticker: {
            type: String,
            required: true
        },

        industry: {
            type: String,
            required: true
        },

        cagr: {
            type: Number,
            required: true
        },

        marketCap: {

            label: {
                type: String,
                required: true
            },

            value: {
                type: Number,
                required: true
            }
        },

        risk: {

            standardDeviation: {
                type: Number,
                required: true
            },

            sharpeRatio: {
                type: Number,
                required: true
            },

            beta: {
                type: Number,
                required: true
            },

            alpha: {
                type: Number,
                required: true
            },

            rSquared: {
                type: Number,
                required: true
            }
        },

        valuation: {

            priceToEarning: {
                type: Number,
                required: true
            },

            priceToEarningsGrowth: {
                type: Number,
                required: true
            },

            priceToSales: {
                type: Number,
                required: true
            },

            priceToBook: {
                type: Number,
                required: true
            },

            enterpriseValueToRevenue: {
                type: Number,
                required: true
            },

            enterpriseValueToEbitda: {
                type: Number,
                required: true
            },

            priceToFreeCashFlow: {
                type: Number,
                required: true
            }
        },

        profitability: {

            returnOnAssets: {
                type: Number,
                required: true
            },

            returnOnEquity: {
                type: Number,
                required: true
            },

            profitMargin: {
                type: Number,
                required: true
            }
        },

        liquidity: {

            currentRatio: {
                type: Number,
                required: true
            },

            quickRatio: {
                type: Number,
                required: true
            }
        },

        debt: {

            debtToEquity: {
                type: Number,
                required: true
            },

            interestCoverage: {
                type: Number,
                required: true
            }
        },

        efficiency: {

            assetTurnover: {
                type: Number,
                required: true
            },

            inventoryTurnover: {
                type: Number,
                required: true
            }
        },

        dividends: {

            dividendYield: {
                type: Number
            },

            dividendPayout: {
                type: Number
            }
        }
    },

    { collection: 'StockProfiles', timestamps: true }
);

export const StockProfile = mongoose.model('StockProfile', stockProfileSchema);
