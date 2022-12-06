import { ITickerPrice } from '../../interfaces/ticker.interface';

export class CalculatorHelperService {

    static calculateRateOfReturn(startingPrice: number, endingPrice: number): number {

        return ((endingPrice - startingPrice) / startingPrice) * 100;
    }

    static calculateAverageRateOfReturn(prices: ITickerPrice[]): [number[], number] {

        const returns: number[] = [];

        let sumOfReturns = 0;

        for (let i = 0; i < prices.length; i++) {

            /*
            There is no percentage change from nothing to first entry
            */
            if (i === 0) {

                continue;
            }

            /*
            Otherwise, calculate percentange change over each period
            */
            const currentPrice = prices[i].adjClose;

            const previousPrice = prices[i - 1].adjClose;

            const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;

            returns.push(percentageChange);

            sumOfReturns += percentageChange;
        }

        /*
        We need returns for standard deviation
        */
        return [returns, sumOfReturns / returns.length];
    }

    /*
    To calculate variance we sum the squares of
    diffs between daily rate of return and average rate of return
    and then divide it by count of daily returns
    */
    static calculateVariance(returns: number[], averageRateOfReturn: number): number {

        let sumOfSquares = 0;

        for (let i = 0; i < returns.length; i++) {

            sumOfSquares += Math.pow(returns[i] - averageRateOfReturn, 2);
        }

        const variance = sumOfSquares / returns.length - 1;

        return variance;
    }
}
