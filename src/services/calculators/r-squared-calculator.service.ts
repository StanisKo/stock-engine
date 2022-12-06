/* eslint-disable @typescript-eslint/no-unused-vars */

/*
R-Squared — measures how much the movement of the assets is influenced by the movement of the index.
Ranges from 0 to 100.

R-Squared = 1 - ( Explained Variance / Total Variance ) * 100

On implementation:

https://learn.robinhood.com/articles/1b0pKZVyHexpQy9MaTvlkC/what-is-r-squared/

https://cdn.robinhood.com/learn_on_robinhood_assets/pdfs/instructions-r_squared_04-file.pdf

The goal is to find investments that will beat the market
Look for lower r-squared because we're seeking stocks that don’t just match the index

On R-Squared: https://www.investopedia.com/terms/r/r-squared.asp

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

        return (1 - (sumOfSquaredBenchmarkReturns / sumOfSquaredTickerReturns)) * 100;
    }
}
