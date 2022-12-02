/*
Standard Deviation is the square root of Variance

Therefore, in order to get to SD we need to calculate V

Variance, in it's turn, is the sum of squares of diffs
between Rate of Return and Avarage Rate of Return divided by count of returns


Therefore, in order to get to V we need to calculate RoR and ARoR

In such, RoR and ARoR are the fundament of calculating SD

To get to RoR and ARoR we got to make use of available adjusted EOD (end of day) prices

****

The described can be expressed as following:

SD = SQRT(V)

V = SUM(RoR - ARoR)² / N(RoR)

RoR = (P2 - P1) / P1 * 100 where P2 is Nth price and P1 is previous

In such, we're calculating RoR over each closing price of current day against previous day*

ARoR = SUM(RoR) / N(RoR) where N is count of datapoints we have

****

On Standard Deviation: https://www.investopedia.com/terms/s/standarddeviation.asp

NOTE: we do not subtract 1 from count of returns, since we're calculating over entire dataset:

https://www.thoughtco.com/population-vs-sample-standard-deviations-3126372
*/

import { ITickerPrice } from  '../../interfaces/ticker.interface';

import { CalculatorHelperService } from './calculator-helper.service';

export class StandardDeviationCalculatorService {

    prices: ITickerPrice[];

    calculatorHelperService: CalculatorHelperService;

    constructor(prices: ITickerPrice[]) {

        this.prices = prices;
    }

    /*
    To calculate variance we sum the squares of
    diffs between daily rate of return and average rate of return
    and then divide it by count of daily returns
    */
    private calculateVariance(returns: number[], averageRateOfReturn: number): number {

        let sumOfSquares = 0;

        for (let i = 0; i < returns.length; i++) {

            sumOfSquares += Math.pow(returns[i] - averageRateOfReturn, 2);
        }

        const variance = sumOfSquares / returns.length;

        return variance;
    }

    public calculateStandardDeviation(): number {

        const [returns, averageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(this.prices);

        const variance = this.calculateVariance(returns, averageRateOfReturn);

        const standardDeviation = Math.sqrt(variance);

        console.log('Calculated Standard Deviation');

        return standardDeviation;
    }
}
