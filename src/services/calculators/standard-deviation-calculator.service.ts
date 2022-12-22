/* eslint-disable @typescript-eslint/no-unused-vars */

/*
Standard deviation — indicates how much the current return is deviating from its expected historical normal returns
The higher standard deviation, the greater possible outcomes, both negative and positive.

SD = SQRT(V)

V = SUM(RoR - ARoR) ^ 2 / N(RoR) - 1

RoR = (P2 - P1) / P1 * 100 where P2 is Nth price and P1 is previous

ARoR = SUM(RoR) / N(RoR) where N is count of datapoints we have

****

On Standard Deviation: https://www.investopedia.com/terms/s/standarddeviation.asp
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class StandardDeviationCalculatorService {

    /*
    To calculate variance we sum the squares of
    diffs between daily rate of return and average rate of return
    and then divide it by count of daily returns - 1
    */
    private static calculateVariance(returns: number[], averageRateOfReturn: number): number {

        let sumOfSquares = 0;

        for (let i = 0; i < returns.length; i++) {

            sumOfSquares += Math.pow(returns[i] - averageRateOfReturn, 2);
        }

        const variance = sumOfSquares / returns.length - 1;

        return variance;
    }

    static calculateStandardDeviation(prices: ITickerPrice[]): number {

        const [returns, averageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(prices);

        const variance = this.calculateVariance(returns, averageRateOfReturn);

        const standardDeviation = Math.sqrt(variance);

        return standardDeviation;
    }
}
