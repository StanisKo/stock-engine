import * as uuid from 'uuid';

import mongoose from 'mongoose';

import { IStockProfileSchema } from '../interfaces/stock-profile.interface';


const industryProfileSchema = new mongoose.Schema<IStockProfileSchema>(
    {
        _id: { type: String, default: uuid.v4 },

        industry: {
            type: String
        },

        cagr: {
            type: Number
        },

        marketCap: {

            label: {
                type: String,
                enum: ['small', 'medium', 'large']
            },

            value: {
                type: Number
            }
        },

        risk: {

            standardDeviation: {
                type: Number
            },

            sharpeRatio: {
                type: Number
            },

            beta: {
                type: Number
            },

            alpha: {
                type: Number
            },

            rSquared: {
                type: Number
            }
        },

        valuation: {

            priceToEarning: {
                type: Number
            },

            priceToEarningsGrowth: {
                type: Number
            },

            priceToSales: {
                type: Number
            },

            priceToBook: {
                type: Number
            },

            dividendYield: {
                type: Number
            },

            dividendPayout: {
                type: Number
            }
        },

        profitability: {

            returnOnAssets: {
                type: Number
            },

            returnOnEquity: {
                type: Number
            },

            profitMargin: {
                type: Number
            }
        },

        liquidity: {

            currentRatio: {
                type: Number
            },

            quickRatio: {
                type: Number
            }
        },

        debt: {

            debtToEquity: {
                type: Number
            }
        }

    },

    { collection: 'StockProfiles', timestamps: true }
);

export const IndustryProfile = mongoose.model('StockProfile', industryProfileSchema);
