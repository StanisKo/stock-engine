import { ITickerPrice } from '../../interfaces/ticker.interface';

export class CalculatorHelperService {

    static calculateAverageRateOfReturnOverTicker(prices: ITickerPrice[]): [number[], number] {

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
            const currentPrice = prices[i].adjusted_close;

            const previousPrice = prices[i - 1].adjusted_close;

            const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;

            returns.push(percentageChange);

            sumOfReturns += percentageChange;
        }

        /*
        We need returns for standard deviation
        */
        return [returns, sumOfReturns / returns.length];
    }

    static calculatRateOfReturnOverBenchmark(endingPrice: number, startingPrice: number): number {

        const benchmarkRateOfReturn = ((endingPrice - startingPrice) / startingPrice) * 100;

        return benchmarkRateOfReturn;
    }
}
