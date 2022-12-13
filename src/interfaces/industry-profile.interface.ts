/*
TODO: add missing ratios, clean up comments, prepare everything for V1 (bulk ingest and sorting)

TODO: for every ratio out there, there has to be comparison logic in comments!

TODO: think of weights ratios might have

TODO: restructure in preparation for V1

TODO: rename to IStockProfile
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

      Target: > Industry Peers

      Find investments that historically are most profitable

      We're looking for HIGHEST CAGR since we need stocks that are more profitable
      than others on the market
      */
      cagr: number,

      /*
      Size measurement of the stock

      No target: all small, medium and large caps have a potential to be profitable investments
      */
      marketCap: {

        label: 'small' | 'medium' | 'large',

        value: number
      },

      risk: {

        /*
        Indicates how much the current return is deviating from its expected historical normal returns.
        The higher standard deviation, the greater possible outcomes, both negative and positive.

        Target: > Market Peers

        Find investments that have potential for fast growth

        We're looking for HIGHEST Standard Deviation since we need stocks that
        can potentially outperform their expected historical normal returns
        */
        standardDeviation: number,

        /*
        Measures rate of return on the asset above risk-free investment, such as treasury bonds or cash.
        In other words, measures whether the risk is justified against investing into risk-free assets.
        A Sharpe Ratio above 1.0 is considered good, as it indicates potential excess return
        relative to the volatility of the asset.

        Target: > 1.0 && > Market Peers

        Find investments that justify the risk of investing

        We're looking for HIGHEST Sharpe Ratio since we need stocks that are safer than investing
        into risk-free assets (bonds, cash, gold, etc.)
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

        Target: > 1.0 && > Market Peers

        Find investments that have potential to grow faster than the market

        We're looking for HIGHEST Beta since we need stocks that
        can move more intensely (faster) than the market
        */
        beta: number,

        /*
        Measures excess returns/losses against the return of the index.
        Expressed in a decimal (0.N) that is a percentage of over or under performance.

        NOTE: we express alpha in direct percentage

        Alpha Ranges:
            * > 0: Outperforms the index
            * < 0: Underperforms the index.

        Target: > 0 && > Market Peers

        Find investments that outperform the market

        We're looking for HIGHEST Alpha since we need stocks that perform better than index (market)
        */
        alpha: number,

        /*
        Measures how much the movement of the assets is influenced by the movement of the index.
        Ranges from 0 to 100.

        R-Squared Ranges:
            * >= 85% && <= 100%: Closely correlates with index (influenced by 85-100%).
            * <= 70%: Does not perform like index (influenced by 70% or less).
        
        Target: < 70% && < Market Peers

        Find investments that do not follow the market

        We're looking for LOWEST R-Squared since we need stocks that deviate from the index (market)
        */
        rSquared: number
    },

    valuation: {

        /*
        Denotes the price you pay for $1 of earnings.
        Rule of thumb — stocks trading at a lower P/E ratio than their industry peers are considered value stocks.

        Target: < Industry Peers

        Find investments that cost as little as possible against their performance

        We're looking for LOWEST P/E, since we need stocks that are undervalued for their perfomance
        */
        priceToEarning: number,

        /*
        Helps to understand future growth prospects of the company and its stock.
        The lower the number, the better.

        Target: < 1.0 && < Industry Peers

        Find investments that cost as little as possible against their potential

        We're looking for LOWEST PEG, since we need stocks that are undervalued for their future performance
        */
        priceToEarningsGrowth: number,

        /*
        Denotes the price you pay for $1 of sales.
        Reflects how good stock performs against the sales operations of the business.
        Considered to be more reliable.

        Target: < Industry Peers

        Find investments that cost as little as possible against their sales

        We're looking for LOWEST P/S, since we need stocks that are undervalued for their sales operations
        */
        priceToSales: number,

        /*
        Denotes the price you pay for $1 of equity, a.k.a. book value (assets - liabilities).
        Reflects how stock is priced against company’s actual worth.

        Target: < 1.0 && < Industry Peers

        Find investments that cost as little as possible against their actual value as a company

        We're looking for LOWEST P/B, since we need stocks that are undervalues for their value as a company
        */
        priceToBook: number,

        /*
        Denotes the total enterprise worth in comparison to its revenue.
        One of several fundamental indicators that investors use to determine whether a stock is priced fairly.
        The lower the better, in that, a lower EV/R signals a company is undervalued.

        Target: < Industry Peers

        Find investments that are undervalued for their enterprise value

        We're looking for LOWEST EV/R, since we need stocks that are undervalues for their value as a company

        NOTE: similar to P/B, yet used more to evaluate early-stage/growth companies that might not have much
        of assets behind them
        */
        enterpriseValueToRevenue: number,

        /*
        Denotes how much interest you earn from dividends.

        Target: <= 5% && > Industry Peers

        NOTE: we do not concern ourselves with dividends yet
        */
        dividendYield: number,

        /*
        A percentage of profit distributed to investors.
        Helps to understand if company can sustain its dividend payouts in the future.

        Target: >= 50% && <= 70%

        NOTE: we do not concern ourselves with dividends yet
        */
        dividendPayout: number
    },

    profitability: {

        /*
        Displays how effectively the company is using its assets to generate income.
        The higher the number, the better.

        Target: > Industry Peers

        Find investments that have the highest potential to be profitable based on company's assets

        We're looking for HIGHEST ROA, since we need stocks whose assets are managed
        in the most profitable manner
        */
        returnOnAssets: number,

        /*
        Displays how effective the company is using its investment from shareholders to generate income.
        The higher the number, the better.

        Target: > Industry Peers

        Find investments that have the highest potential to be profitable based on capital gained from
        issued shares

        We're looking for HIGHEST ROE, since we need stocks whose common stock is managed
        in the most profitable manner
        */
        returnOnEquity: number,

        /*
        Denotes how much profit company makes after deducting liabilites.

        Target: > Industry Peers

        Find investments that have the highest potential to be profitable based on company's operations

        We're looking for HIGHEST Profit Margin, since we need stocks whose issuers make most profit
        */
        profitMargin: number
    },

    liquidity: {

        /*
        Denotes company’s capacity to meet it’s short-term obligations (debt),
        where short-term obligations are debt due within 1 year period.

        Target: > Industry Peers

        Find investments whose companies are safe from the prospects of bancruptcy

        We're looking for HIGHEST Current Ratio, since we want stocks whose issuers
        have little to no issues managing their short-term capital
        */
        currentRatio: number,

        /*
        Similar to Current Ratio, but is more conservative. As a rule, lower than Current Ratio.

        Target: > Industry Peers

        See Current Ratio
        */
        quickRatio: number
    },

    debt: {

        /*
        Measures the relationship between the amount of capital that has been borrowed (debt),
        and the amount of capital contributed by shareholders (equity).
        Displays company’s ability to service it’s long-term debt obligations. The lower the number, the better.

        Target: < Industry Peers

        Find investments that have sensible leverage and are not burdened by debt

        We're looking for LOWEST D/E since we want stocks whose issuers have prospects
        to continue into the future without defaulting on their obligations
        */
        debtToEquity: number,

        /*
        Measures how easily a company can pay interest on its outstanding debt.
        It represents how many (typically the number of quarters or fiscal years)
        times the company can pay its obligations using its earnings.
        The higher the number, the better

        Target: > 1.0 && > Industry Peers

        Find investments that make enough money to service their long-term debt

        We're looking for HIGHEST Interest Coverage as it is an indicator of company's survivability
        */
        interestCoverage: number
    }
}

export interface IIndustryProfileSchema extends IIndustryProfile {

    _id: string
}
