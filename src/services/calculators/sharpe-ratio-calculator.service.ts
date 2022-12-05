/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Sharpe Ratio = (Ticker Rate of Return - Benchmark Rate of Return) / Ticker Standard Deviation

Sharpe Ratio has to be calculated over period of time,
in our case -- TTM, Trailing Twelve Month RoR of ticker and benchmark

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp

TODO: base it on treasury yield
*/

export class SharpeRatioCalculatorService {

    static calculateSharpeRatio(
        tickerRateOfReturn: number,
        benchmarkRateOfReturn: number,
        tickerStandardDeviation: number
    ): number {

        const sharpeRatio = (tickerRateOfReturn - benchmarkRateOfReturn) / tickerStandardDeviation;

        console.log('Calculated Sharpe Ratio');

        return sharpeRatio;
    }

}
