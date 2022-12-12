/*
TODO: add missing ratios, clean up comments, prepare everything for V1 (bulk ingest and sorting)

TODO: for every ratio out there, there has to be comparison logic in comments!

TODO: think of weights ratios might have

TODO: restructure in preparation for V1

NOTE: at this point in time, all of the measurement and ratios fields are optional,
since companies do not expose everything in their financial statements and,
therefore, not all values are available via the API

NOTE: it might be the case we'd need to calculate some missing values, provided
API delivers financial documents (balance sheet, income statement, cash flow statement)

NOTE: Since all values except those under risk must be compared with the same industry,
we should aspire for creating only one profile per industry

Iteration 0 (24-11-2022):

At this point in time we have only 2 profiles, both sculpted from my core positions:
NIO and APPS -- Automotive and Digital Advertising, respectively

This might/will change with further business ideas
*/

export interface IIndustryProfile {

      /*
      ALL RATIOS EXCEPT RISK MUST BE COMPARED WITHIN THE SAME INDUSTRY
      */
      industry: string,

      /*
      Compound Annual Growth Rate (CAGR) — mean annual growth rate of an investment
      over a specified period of time longer than one year.
      It represents one of the most accurate ways to calculate and determine returns for an asset.
      */
      cagr: number,

      /*
      Size measurement of the stock
      */
      marketCap: {

        label: 'small' | 'medium' | 'large',

        value: number
      },

      risk: {

        /*
        Indicates how much the current return is deviating from its expected historical normal returns.
        The higher standard deviation, the greater possible outcomes, both negative and positive.
        */
        standardDeviation: number,

        /*
        Measures rate of return on the asset above risk-free investment, such as treasury bonds or cash.
        In other words, measures whether the risk is justified against investing into risk-free assets.
        A Sharpe Ratio above 1.0 is considered good, as it indicates potential excess return
        relative to the volatility of the asset.
        */
        sharpeRatio: number,

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
        beta: number,

        /*
        Measures excess returns/losses against the return of the index.
        Expressed in a decimal (0.N) that is a percentage of over or under performance.

        Alpha Ranges:
            * > 0: Outperforms the index
            * < 0: Underperforms the index.
        */
        alpha: number,

        /*
        Measures how much the movement of the assets is influenced by the movement of the index.
        Ranges from 0 to 100.

        R-Squared Ranges:
            * >= 85 && <= 100: Closely correlates with index (influenced by 85-100%).
            * <= 70: Does not perform like index (influenced by 70% or less).
        */
        rSquared: number
    },

    valuation: {

        /*
        Denotes the price you pay for $1 of earnings.
        Rule of thumb — stocks trading at a lower P/E ratio than their industry peers are considered value stocks.
        */
        priceToEarning: number,

        /*
        Helps to understand future growth prospects of the company and its stock.
        The lower the number, the better.
        */
        priceToEarningsGrowth: number,

        /*
        Denotes the price you pay for $1 of sales.
        Reflects how good stock performs against the sales operations of the business.
        Considered to be more reliable.
        */
        priceToSales: number,

        /*
        Denotes the price you pay for $1 of equity, a.k.a. book value (assets - liabilities).
        Reflects how stock is priced against company’s actual worth.
        */
        priceToBook: number,

        /*
        Denotes how much interest you earn from dividends.
        */
        dividendYield: number,

        /*
        A percentage of profit distributed to investors.
        Helps to understand if company can sustain its dividend payouts in the future.
        */
        dividendPayout: number
    },

    profitability: {

        /*
        Displays how effectively the company is using its assets to generate income.
        The higher the number, the better.
        */
        returnOnAssets: number,

        /*
        Displays how effective the company is using its investment from shareholders to generate income.
        The higher the number, the better.
        */
        returnOnEquity: number,

        /*
        Denotes how much profit company makes after deducting liabilites.
        */
        profitMargin: number
    },

    liquidity: {

        /*
        Denotes company’s capacity to meet it’s short-term obligations (debt),
        where short-term obligations are debt due within 1 year period.
        */
        currentRatio: number,

        /*
        Similar to Current Ratio, but is more conservative. As a rule, lower than Current Ratio.
        */
        quickRatio: number
    },

    debt: {

        /*
        Measures the relationship between the amount of capital that has been borrowed (debt),
        and the amount of capital contributed by shareholders (equity).
        Displays company’s ability to service it’s long-term debt obligations. The lower the number, the better.
        */
        debtToEquity: number,

        /*
        Measures how easily a company can pay interest on its outstanding debt.
        It represents how many (typically the number of quarters or fiscal years)
        times the company can pay its obligations using its earnings.
        The higher the number, the better
        */
        interestCoverage: number
    }
}

export interface IIndustryProfileSchema extends IIndustryProfile {

    _id: string
}
