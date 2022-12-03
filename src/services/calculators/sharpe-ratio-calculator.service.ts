/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*

Sharpe Ratio = (Ticker Rate of Return - Benchmark Rate of Return) / Ticker Standard Deviation

As our risk-free investment benchmark we take SP500's rate of return

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

import { IBenchmarkPrice, ITickerPrice } from  '../../interfaces/ticker.interface';
import { CalculatorHelperService } from './calculator-helper.service';

export class SharpeRatioCalculatorService {

    tickerPricesTTM: ITickerPrice[];

    benchmarkPricesTTM: IBenchmarkPrice[];

    tickerStandardDeviation: number;

    constructor(tickerPrices: ITickerPrice[], benchmarkPrices: IBenchmarkPrice[], standardDeviation: number) {

        this.tickerPricesTTM = tickerPrices;

        this.benchmarkPricesTTM = benchmarkPrices;

        this.tickerStandardDeviation = standardDeviation;
    }

    public calculateSharpeRatio(): number {

        const tickerEndingPrice = this.tickerPricesTTM[this.tickerPricesTTM.length - 1].adjusted_close;

        const tickerStartingPrice = this.tickerPricesTTM[0].adjusted_close;

        const tickerRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            tickerEndingPrice,
            tickerStartingPrice
        );

        const benchmarkEndingPrice = this.benchmarkPricesTTM[this.benchmarkPricesTTM.length - 1].adjClose;

        const benchmarkStartingPrice = this.benchmarkPricesTTM[0].adjClose;

        const benchmarkRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            benchmarkEndingPrice,
            benchmarkStartingPrice
        );

        const sharpeRatio = (tickerRateOfReturn - benchmarkRateOfReturn) / this.tickerStandardDeviation;

        console.log('Calculated Sharpe Ratio');

        return sharpeRatio;
    }

}
