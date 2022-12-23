import { MarketCapLabel } from '../enums';

export interface IStockProfile {

    ticker: string,

    industry: string,

    /*
    ALL RATIOS MUST BE COMPARED WITHIN THE SAME INDUSTRY
    */

    /*
    Compound Annual Growth Rate (CAGR) — mean annual growth rate of an investment
    over a specified period of time longer than one year.
    It represents one of the most accurate ways to calculate and determine returns for an asset.

    Target: > Industry Peers

    We're looking for HIGHEST CAGR since we need stocks that historically are most profitable
    */
    cagr: number,

    /*
    Size measurement of the stock

    No target: all small, medium and large caps have a potential to be profitable investments
    */
    marketCap: {

    value: number,

    label: MarketCapLabel
    },

    risk: {

        /*
        Indicates how much the current return is deviating from its expected historical normal returns.
        The higher standard deviation, the greater possible outcomes, both negative and positive.

        Target: > Market Peers

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

        We're looking for HIGHEST Sharpe Ratio since we need stocks that justify the risk involved
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

        We're looking for HIGHEST Beta since we need stocks that have potential to grow faster than the market
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

        We're looking for HIGHEST Alpha since we need stocks that outperform the market (index)
        */
        alpha: number,

        /*
        Measures how much the movement of the assets is influenced by the movement of the index.
        Ranges from 0 to 100.

        R-Squared Ranges:
            * >= 85% && <= 100%: Closely correlates with index (influenced by 85-100%).
            * <= 70%: Does not perform like index (influenced by 70% or less).
        
        Target: < 70% && < Market Peers

        We're looking for LOWEST R-Squared since we need stocks that deviate from the market (index)
        */
        rSquared: number
    },

    valuation: {

        /*
        Denotes the price you pay for $1 of earnings.
        Rule of thumb — stocks trading at a lower P/E ratio than their industry peers are considered value stocks.

        Target: < Industry Peers

        We're looking for LOWEST P/E, since we need stocks that are undervalued for their perfomance
        */
        priceToEarning: number,

        /*
        Helps to understand future growth prospects of the company and its stock.
        The lower the number, the better.

        Target: < 1.0 && < Industry Peers

        We're looking for LOWEST PEG, since we need stocks that are undervalued for their potential performance
        */
        priceToEarningsGrowth: number,

        /*
        Denotes the price you pay for $1 of sales.
        Reflects how good stock performs against the sales operations of the business.
        Considered to be more reliable.

        Target: < Industry Peers

        We're looking for LOWEST P/S, since we need stocks that are undervalued for their sales operations
        */
        priceToSales: number,

        /*
        Denotes the price you pay for $1 of equity, a.k.a. book value (assets - liabilities).
        Reflects how stock is priced against company’s actual worth.

        Target: < 1.0 && < Industry Peers

        We're looking for LOWEST P/B, since we need stocks that are undervalues for their value as a company
        */
        priceToBook: number,

        /*
        Denotes the total enterprise worth in comparison to its revenue.
        One of several fundamental indicators that investors use to determine whether a stock is priced fairly.
        The lower the better, in that, a lower EV/R signals a company is undervalued.

        Target: > 1 && < 3 && < Industry Peers

        We're looking for LOWEST EV/R, since we need stocks that are undervalues for their value as a company

        NOTE: similar to P/B, yet used more to evaluate early-stage/growth companies that might not have much
        of assets behind them
        */
        enterpriseValueToRevenue: number,

        /*
        Denotes the total enterprise worth in comparison to its EBITDA.

        Similar to EV/R, but is more conservative.

        Target: < 10 && < Industry Peers

        We're looking for LOWEST EV/EBITDA, since we need stocks that are undervalues for their earnings
        */
        enterpriseValueToEbitda: number

        /*
        Measures how much cash company is generating relative to its market value (its stock price)

        A good alternative to P/E as cash flows are less susceptible to manipulation than earnings

        Particularly useful for stocks that have positive cash flow but are not profitable yet

        Target: < 5 && < Industry Peers

        We're looking for LOWEST P/FCF, since we need stocks that are undervalued for their free cash flow
        */
        priceToFreeCashFlow: number
    },

    profitability: {

        /*
        Displays how effectively the company is using its assets to generate income.
        The higher the number, the better.

        Target: > Industry Peers

        We're looking for HIGHEST ROA, since we need stocks that have the highest potential
        to be profitable based on company's assets
        */
        returnOnAssets: number,

        /*
        Displays how effective the company is using its investment from shareholders to generate income.
        The higher the number, the better.

        Target: > Industry Peers

        We're looking for HIGHEST ROE, since we need stocks that have the highest potential
        to be profitable based on capital gained from issued shares
        */
        returnOnEquity: number,

        /*
        Denotes how much profit company makes after deducting liabilites.

        Target: > Industry Peers

        We're looking for HIGHEST Profit Margin, since we need stocks that have the highest potential
        to be profitable based on company's operations
        */
        profitMargin: number
    },

    liquidity: {

        /*
        Denotes company’s capacity to meet it’s short-term obligations (debt),
        where short-term obligations are debt due within 1 year period.

        Target: > Industry Peers

        We're looking for HIGHEST Current Ratio, since we need stocks whose companies
        are safe from the prospects of bancruptcy
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

        We're looking for LOWEST D/E since we need stocks whose companies
        have sensible leverage and are not burdened by debt
        */
        debtToEquity: number,

        /*
        Measures how easily a company can pay interest on its outstanding debt.
        It represents how many (typically the number of quarters or fiscal years)
        times the company can pay its obligations using its earnings.
        The higher the number, the better

        Target: > 1.0 && > Industry Peers

        We're looking for HIGHEST Interest Coverage, since we need stocks whose companies
        make enough money to service their long-term debt
        */
        interestCoverage: number
    }

    dividends: {

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
    }
}

export interface IStockProfileSchema extends IStockProfile {

    _id: string
}
