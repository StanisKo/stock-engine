/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Sharpe Ratio = (Ticker Rate of Return - Risk Free Rate of Return) / Ticker Standard Deviation

Sharpe Ratio has to be calculated over period of time, in our case -- TTM, Trailing Twelve Month RoR of ticker

Our Risk Free Rate of Return is US 10 Year Treasury Bond Yield

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp

On Treasury Bond Yield: https://www.investopedia.com/articles/investing/100814/why-10-year-us-treasury-rates-matter.asp
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
