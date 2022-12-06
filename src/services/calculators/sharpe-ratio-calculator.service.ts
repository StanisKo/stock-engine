/*
Sharpe Ratio — measures rate of return on the asset above risk-free investment,
such as treasury bonds or cash
In other words, measures whether the risk is justified against investing into risk-free assets
A Sharpe Ratio above 1.0 is considered good,
as it indicates potential excess return relative to the volatility of the asset

Sharpe Ratio = (Ticker Rate of Return - Risk Free Rate of Return) / Ticker Standard Deviation

Our Risk Free Rate of Return is US 1 Year Treasury Bond Yield

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp

On Treasury Bond Yield: https://www.investopedia.com/articles/investing/100814/why-10-year-us-treasury-rates-matter.asp

TODO: how to use (check r squared)
*/

export class SharpeRatioCalculatorService {

    static calculateSharpeRatio(
        tickerRateOfReturn: number,
        treasuryBondYield: number,
        tickerStandardDeviation: number
    ): number {

        const sharpeRatio = (tickerRateOfReturn - treasuryBondYield) / tickerStandardDeviation;

        console.log('Calculated Sharpe Ratio');

        return sharpeRatio;
    }

}
