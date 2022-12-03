/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Sharpe Ratio = (Ticker Rate of Return - Benchmark Rate of Return) / Ticker Standard Deviation

Sharpe Ratio has to be calculated over period of time,
in our case -- TTM, Trailing Twelve Month RoR of ticker and benchmark

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

import { ITickerPrice } from  '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';
import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

export class SharpeRatioCalculatorService {

    tickerPricesTTM: ITickerPrice[];

    benchmarkPricesTTM: ITickerPrice[];

    tickerStandardDeviation: number;

    constructor(tickerPrices: ITickerPrice[], benchmarkPrices: ITickerPrice[], standardDeviation: number) {

        this.tickerPricesTTM = tickerPrices;

        this.benchmarkPricesTTM = benchmarkPrices;

        this.tickerStandardDeviation = standardDeviation;
    }

    public calculateSharpeRatio(): number {

        const [tickerEndingPrice, tickerStartingPrice ] = TimeSeriesHelperService.getEndingAndStartingPrice(
            this.tickerPricesTTM
        );

        const tickerRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            tickerEndingPrice,
            tickerStartingPrice
        );

        const [benchmarkEndingPrice, benchmarkStartingPrice] = TimeSeriesHelperService.getEndingAndStartingPrice(
            this.benchmarkPricesTTM
        );

        const benchmarkRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            benchmarkEndingPrice,
            benchmarkStartingPrice
        );

        const sharpeRatio = (tickerRateOfReturn - benchmarkRateOfReturn) / this.tickerStandardDeviation;

        console.log('Calculated Sharpe Ratio');

        return sharpeRatio;
    }

}
