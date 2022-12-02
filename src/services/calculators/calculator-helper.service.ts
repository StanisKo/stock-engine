import { ITickerPrice } from '../../interfaces/ticker.interface';

export class CalculatorHelperService {

    /*
    Since different APIs have different naming, we are checking for properties runtime
    */
    static indexOutAdjustedClose(price: ITickerPrice): number {

        return price.adjusted_close ?? price.adjClose;
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
            const currentPrice = CalculatorHelperService.indexOutAdjustedClose(prices[i]);

            const previousPrice = CalculatorHelperService.indexOutAdjustedClose(prices[i - 1]);

            const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;

            returns.push(percentageChange);

            sumOfReturns += percentageChange;
        }

        /*
        We need returns for standard deviation
        */
        return [returns, sumOfReturns / returns.length];
    }
}
