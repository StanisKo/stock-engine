/* eslint-disable @typescript-eslint/no-unused-vars */

/*
R-Squared — measures how much the movement of the assets is influenced by the movement of the index.
Ranges from 0 to 100.

R-Squared = r^2

On R-Squared: https://www.investopedia.com/terms/r/r-squared.asp

On Correlation: https://www.investopedia.com/terms/c/correlationcoefficient.asp

Thank you: https://github.com/rubenvar/calculate-correlation/blob/main/lib/correlation.js

The goal is to find investments that will beat the market
Look for lower r-squared because we're seeking stocks that don’t just match the index
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class RSquaredCalculatorService {

    static calculateRSquared(prices: ITickerPrice[], benchmarkPrices: ITickerPrice[]): number {

        /*
        Returns of both index and ticker are the basis
        */

        const explainedVariance = 1;

        const [tickerReturns, averageTickerRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            prices
        );

        const totalVariance = CalculatorHelperService.calculateVariance(
            tickerReturns,
            averageTickerRateOfReturn
        );

        return 0;
    }
}
