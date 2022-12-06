/*
R-Squared — measures how much the movement of the assets is influenced by the movement of the index.
Ranges from 0 to 100.

R-Squared = 1 − (Total Variation / Unexplained Variation)

To calculate the total variance, you would subtract the average actual value from each of the actual values,
square the results and sum them
From there, divide the first sum of errors (unexplained variance) by the second sum (total variance),
subtract the result from one, and you have the R-squared

On R-Squared: https://www.investopedia.com/terms/r/r-squared.asp

On margins: https://groww.in/p/r-squared

The goal is to find investments that will beat the market
Look for lower r-squared because we're seeking stocks that don’t just match the index
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class RSquaredCalculatorService {

    static calculateRSquared(prices: ITickerPrice[]): number {

        const [returns, averageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(prices);

        const variance = CalculatorHelperService.calculateVariance(returns, averageRateOfReturn);

        return 0;
    }
}
