import * as uuid from 'uuid';

import mongoose from 'mongoose';

const { Schema } = mongoose;

const stockProfileSchema = new Schema(
    {
        _id: { type: mongoose.SchemaTypes.String, default: uuid.v4 },

        marketCap: {

            label: {
                type: String,
                enum: ['small', 'medium', 'large'],
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

            dividendYield: {
                type: Number,
                required: true
            },

            dividendPayout: {
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
        }

    },

    { collection: 'StockProfiles', timestamps: true }
);

export const StockProfile = mongoose.model('StockProfile', stockProfileSchema);
