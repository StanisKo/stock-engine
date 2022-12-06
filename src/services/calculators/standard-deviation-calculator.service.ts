/*
Standard deviation — indicates how much the current return is deviating from its expected historical normal returns
The higher standard deviation, the greater possible outcomes, both negative and positive.

Standard Deviation is the square root of Variance

Therefore, in order to get to SD we need to calculate V

Variance, in it's turn, is the sum of squares of diffs
between Rate of Return and Avarage Rate of Return divided by count of returns minus one


Therefore, in order to get to V we need to calculate RoR and ARoR

In such, RoR and ARoR are the fundament of calculating SD

To get to RoR and ARoR we got to make use of available adjusted EOD (end of day) prices

****

The described can be expressed as following:

SD = SQRT(V)

V = SUM(RoR - ARoR)² / N(RoR) - 1

RoR = (P2 - P1) / P1 * 100 where P2 is Nth price and P1 is previous

In such, we're calculating RoR over each closing price of current day against previous day*

ARoR = SUM(RoR) / N(RoR) where N is count of datapoints we have

****

On Standard Deviation: https://www.investopedia.com/terms/s/standarddeviation.asp

TODO: how to use (check r squared)
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class StandardDeviationCalculatorService {

    /*
    To calculate variance we sum the squares of
    diffs between daily rate of return and average rate of return
    and then divide it by count of daily returns
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

        console.log('Calculated Standard Deviation');

        return standardDeviation;
    }
}
