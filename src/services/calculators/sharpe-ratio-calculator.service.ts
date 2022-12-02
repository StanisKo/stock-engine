/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
As our risk-free investment benchmark we take SP500's rate of return TTM (trailing twelve months)

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

import { IBenchmarkPrice } from  '../../interfaces/ticker.interface';

import { CalculatorHelperService } from './calculator-helper.service';

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

        const endingPrice = this.benchmarkPrices[this.benchmarkPrices.length - 1].adjClose!;

        const startingPrice = this.benchmarkPrices[0].adjClose!;

        const benchmarkAverageRateOfReturn = CalculatorHelperService.calculatRateOfReturnOverBenchmark(
            endingPrice,
            startingPrice
        );

        const sharpeRatio = (this.cagr - benchmarkAverageRateOfReturn) / this.standardDeviation;

        console.log('Calculated Sharpe Ratio');

        return sharpeRatio;
    }

}
