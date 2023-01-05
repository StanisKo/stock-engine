import { IGenericPrice, ITickerPrice } from '../../interfaces/ticker.interface';

export class CalculatorHelperService {

    static calculateRateOfReturn(startingPrice: number, endingPrice: number): number {

        return ((endingPrice - startingPrice) / startingPrice) * 100;
    }

    static calculateAverageRateOfReturn(prices: IGenericPrice[]): [number[], number] {

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

            NOTE: on coalesce operator -- we need to calculate averages
            over prices delivered by different APIs
            */
            const currentPrice = prices[i].adjusted_close ?? prices[i].adjClose;

            const previousPrice = prices[i - 1].adjusted_close ?? prices[i - 1].adjClose;

            const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;

            returns.push(percentageChange);

            sumOfReturns += percentageChange;
        }

        /*
        We need returns for standard deviation
        */
        return [returns, sumOfReturns / returns.length];
    }

    static calculateStandardDeviationOverReturns(
        datasetSize: number,
        sumOfReturns: number,
        sumOfSquaredReturns: number
    ): number {

        return datasetSize * sumOfSquaredReturns - Math.pow(sumOfReturns, 2);
    }

    static calculateAveragePrice(prices: ITickerPrice[]): number {

        let sum = 0;

        for (let i = 0; i < prices.length; i++) {

            sum += prices[i].adjusted_close;
        }

        return sum / prices.length;
    }
}
