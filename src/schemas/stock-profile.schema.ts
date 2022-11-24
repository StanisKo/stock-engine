import * as uuid from 'uuid';

import mongoose from 'mongoose';

/*
NOTE: at this point in time, all of the measurement and ratios fields are optional,
since companies do not expose everything in their financial statements and,
therefore, not all values are available via the API

NOTE: it might be the case we'd need to calculate some missing values, provided
API delivers financial documents (balance sheet, income statement, cash flow statement)

Iteration 1 (24-11-2022):

This profile is the result of the average between 2 of my core positions: NIO and APPS

This might change based on further business ideas
*/

const { Schema } = mongoose;

const stockProfileSchema = new Schema(
    {
        _id: { type: mongoose.SchemaTypes.String, default: uuid.v4 },

        /*
        Size measurement of the stock
        */
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

            /*
            Indicates how much the current return is deviating from its expected historical normal returns.
            The higher standard deviation, the greater possible outcomes, both negative and positive.
            */
            standardDeviation: {
                type: Number,
                required: true
            },

            /*
            Measures rate of return on the asset above risk-free investment, such as treasury bonds or cash.
            In other words, measures whether the risk is justified against investing into risk-free assets.
            A Sharpe Ratio above 1.0 is considered good, as it indicates potential excess return
            relative to the volatility of the asset. 
            */
            sharpeRatio: {
                type: Number,
                required: true
            },

            /*
            Measures volatility of an asset against the broader index (S&P 500, Dow Jones, Nasdaq, etc.).
            Displays the intensity of movement, not the direction: the asset moves in the same direction as index,
            either slower, same, or faster.

            Beta Ranges:

                * > 0 && < 1.0: Less volatile than the index.
                * == 1.0: Mirrors the volatility of the index.
                * > 1.0: More volatile than the index.
                * < 0: Moves opposite direction of the index (very rare).
            */
            beta: {
                type: Number,
                required: true
            },

            /*
            Measures excess returns/losses against the return of the index.
            Expressed in a decimal (0.N) that is a percentage of over or under performance.

            Alpha Ranges:
                * > 0: Outperforms the index
                * < 0: Underperforms the index.
            */
            alpha: {
                type: Number,
                required: true
            },

            /*
            Measures how much the movement of the assets is influenced by the movement of the index.
            Ranges from 0 to 100.

            R-Squared Ranges:
                * >= 85 && <= 100: Closely correlates with index (influenced by 85-100%).
                * <= 70: Does not perform like index (influenced by 70% or less).
            */
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
