/* eslint-disable @typescript-eslint/no-unused-vars */

/*
R-Squared — measures how much the movement of the assets is influenced by the movement of the index.
Ranges from 0 to 100.

R-Squared = 1 – ( Sum of squared ticker returns (X) / Sum of squared benchmark returns (Y) )

X is the dependant variable, Y is the predictor

On implementation:

! https://www.educba.com/r-squared-formula/ !

The goal is to find investments that will beat the market
Look for lower r-squared because we're seeking stocks that don’t just match the index

TODO: this is wrong
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class RSquaredCalculatorService {

    static calculateRSquared(prices: ITickerPrice[], benchmarkPrices: ITickerPrice[]): number {

        const [tickerReturns, averageTickerRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            prices
        );

        const [sumOfSquaredTickerReturns] = CalculatorHelperService.calculateVariance(
            tickerReturns,
            averageTickerRateOfReturn
        );

        const [benchmarkReturns, averagebenchmarkRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            benchmarkPrices
        );

        const [sumOfSquaredBenchmarkReturns] = CalculatorHelperService.calculateVariance(
            benchmarkReturns,
            averagebenchmarkRateOfReturn
        );

        return 1 - (sumOfSquaredTickerReturns / sumOfSquaredBenchmarkReturns);
    }
}
