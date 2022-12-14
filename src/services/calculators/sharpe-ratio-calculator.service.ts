/*
Sharpe Ratio — measures rate of return on the asset above risk-free investment,
such as treasury bonds or cash

In other words, measures whether the risk is justified against investing into risk-free assets

Sharpe Ratio = (Ticker RoR - Risk-Free RoR) / Ticker SD

RoR = Rate of Return

SD = Standard Deviation

NOTE: Our Risk-Free Rate of Return is US 1 Year Treasury Bond Yield

****

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp

On Treasury Bond Yield: https://www.investopedia.com/articles/investing/100814/why-10-year-us-treasury-rates-matter.asp

****

GOAL:

Find investments that justify the risk of investing
We're looking for HIGHEST Sharpe Ratio since we need stocks that are safer than investing
into risk-free assets (bonds, cash, gold, etc.)
*/

export class SharpeRatioCalculatorService {

    static calculateSharpeRatio(
        tickerRateOfReturn: number,
        treasuryBondYield: number,
        tickerStandardDeviation: number
    ): number {

        const sharpeRatio = (tickerRateOfReturn - treasuryBondYield) / tickerStandardDeviation;

        return sharpeRatio;
    }

}
