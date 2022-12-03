/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*

Sharpe Ratio = (Ticker Rate of Return - Benchmark Rate of Return) / Ticker Standard Deviation

As our risk-free investment benchmark we take SP500's rate of return

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

import { IBenchmarkPrice, ITickerPrice } from  '../../interfaces/ticker.interface';

export class SharpeRatioCalculatorService {

    tickerPricesTTM: ITickerPrice[];

    benchmarkPricesTTM: IBenchmarkPrice[];

    tickerRateOfReturn: number;

    benchmarkRateOfReturn: number;

    tickerStandardDeviation: number;

    constructor(benchmarkPrices: IBenchmarkPrice[], standardDeviation: number) {

        this.benchmarkPricesTTM = benchmarkPrices;

        this.tickerStandardDeviation = standardDeviation;
    }

    public calculateSharpeRatio(): number {

        const sharpeRatio = (this.tickerRateOfReturn - this.benchmarkRateOfReturn) / this.tickerStandardDeviation;

        console.log('Calculated Sharpe Ratio');

        return sharpeRatio;
    }

}
