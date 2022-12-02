/*
As our risk-free investment benchmark we take SP500's rate of return TTM (trailing twelve months)

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

import { IBenchmarkPrice } from  '../../interfaces/ticker.interface';

export class SharpeRatioCalculatorService {

    riskFreeBenchmarkPrices: IBenchmarkPrice[];

    cagr: number;

    standardDeviation: number;

    constructor(riskFreeBenchmarkPrices: IBenchmarkPrice[], cagr: number, standardDeviation: number) {

        this.riskFreeBenchmarkPrices = riskFreeBenchmarkPrices;

        this.cagr = cagr;

        this.standardDeviation = standardDeviation;
    }

    public calculateSharpeRatio(): number {

        console.log('Calculated Sharpe Ratio');

        console.log(this.riskFreeBenchmarkPrices[0]);

        console.log(this.riskFreeBenchmarkPrices[this.riskFreeBenchmarkPrices.length - 1]);

        const sharpeRatio = (this.cagr - 1) / this.standardDeviation;

        return sharpeRatio;
    }

}
