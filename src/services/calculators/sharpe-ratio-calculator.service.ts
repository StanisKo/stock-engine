/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
As our risk-free investment benchmark we take SP500's rate of return

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

import { IBenchmarkPrice } from  '../../interfaces/ticker.interface';

export class SharpeRatioCalculatorService {

    benchmarkPrices: IBenchmarkPrice[];

    cagr: number;

    standardDeviation: number;

    constructor(benchmarkPrices: IBenchmarkPrice[], cagr: number, standardDeviation: number) {

        this.benchmarkPrices = benchmarkPrices;

        this.cagr = cagr;

        this.standardDeviation = standardDeviation;
    }

    public calculateSharpeRatio(): number {

        const benchmarkRateOfReturn = 1;

        const sharpeRatio = (this.cagr - benchmarkRateOfReturn) / this.standardDeviation;

        console.log('Calculated Sharpe Ratio');

        return sharpeRatio;
    }

}
