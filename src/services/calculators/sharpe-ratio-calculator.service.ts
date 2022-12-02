/*
As our risk-free investment benchmark we take SP500's rate of return TTM (trailing twelve months)

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

/*
TODO: build helper class for calculating average rate of return to then be used on ticker prices
and risk free investment prices
*/

import { ITickerPrice } from  '../../interfaces/ticker.interface';

export class SharpeRatioCalculatorService {

    riskFreeBenchmarkPrices: ITickerPrice[];

    cagr: number;

    standardDeviation: number;

    constructor(riskFreeBenchmarkPrices: ITickerPrice[], cagr: number, standardDeviation: number) {

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
