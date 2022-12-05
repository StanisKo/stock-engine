/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Sharpe Ratio = (Ticker Rate of Return - Benchmark Rate of Return) / Ticker Standard Deviation

Sharpe Ratio has to be calculated over period of time,
in our case -- TTM, Trailing Twelve Month RoR of ticker and benchmark

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class SharpeRatioCalculatorService {

    /*
    Don't like it, keep static, but rewrite signature, don't need to copy all these ints into scope
    */
    static calculateSharpeRatio(
        tickerEndingPrice: number,
        tickerStartingPrice: number,
        benchmarkEndingPrice: number,
        benchmarkStartingPrice: number,
        tickerStandardDeviation: number
    ): number {

        const tickerRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            tickerEndingPrice,
            tickerStartingPrice
        );

        const benchmarkRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            benchmarkEndingPrice,
            benchmarkStartingPrice
        );

        const sharpeRatio = (tickerRateOfReturn - benchmarkRateOfReturn) / tickerStandardDeviation;

        console.log('Calculated Sharpe Ratio');

        return sharpeRatio;
    }

}
