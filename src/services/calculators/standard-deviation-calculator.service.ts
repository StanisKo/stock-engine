/*
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

On Standard Deviation: https://www.investopedia.com/terms/s/standarddeviation.asp
*/

import { ITickerPrice } from  '../../interfaces/ticker.interface';

export class StandardDeviationCalculatorService {

    prices: ITickerPrice[];

    constructor(prices: ITickerPrice[]) {

        this.prices = prices;
    }

    private calculateAverageRateOfReturn(prices: ITickerPrice[]): [number[], number] {

        const dayOnDayReturns: number[] = [];

        let sumOfDayOnDayReturns = 0;

        for (let i = 0; i < prices.length; i++) {

            /*
            There is no percentage change from nothing to first entry
            */
            if (i === 0) {

                continue;
            }

            /*
            Otherwise, calculate percentange change over each day
            */
            const currentPrice = prices[i].adjusted_close;

            const previousPrice = prices[i - 1].adjusted_close;

            const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;

            dayOnDayReturns.push(percentageChange);

            sumOfDayOnDayReturns += percentageChange;
        }

        return [dayOnDayReturns, sumOfDayOnDayReturns / dayOnDayReturns.length];
    }

    /*
    To calculate variance we sum the squares of
    diffs between daily rate of return and average rate of return
    and then divide it by count of daily returns - 1
    */
    private calculateVariance(returns: number[], averageRateOfReturn: number): number {

        let sumOfSquares = 0;

        for (let i = 0; i < returns.length; i++) {

            sumOfSquares += Math.pow(returns[i] - averageRateOfReturn, 2);
        }

        const variance = sumOfSquares / returns.length - 1;

        return variance;
    }

    public calculateStandardDeviation(): number {

        const [returns, averageRateOfReturn] = this.calculateAverageRateOfReturn(this.prices);

        const variance = this.calculateVariance(returns, averageRateOfReturn);

        const standardDeviation = Math.sqrt(variance);

        console.log('Calculated Standard Deviation');

        return standardDeviation;
    }
}
