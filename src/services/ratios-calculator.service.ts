/*
Calculates ratios missing from the API

On SD: https://www.businessinsider.com/personal-finance/how-to-find-standard-deviation?international=true&r=US&IR=T

       https://www.fincash.com/l/equity/standard-deviation

       https://financetrain.com/variance-standard-deviation ! (RoR included)

On RoR: https://www.investopedia.com/terms/r/rateofreturn.asp

SD = 
*/

import { ITickerPrice } from  '../interfaces/ticker.interface';

export class RatiosCalculatorService {

    prices: ITickerPrice[];

    constructor(prices: ITickerPrice[]) {

        this.prices = prices;
    }

    /*
    TODO: how to factor in stock splits?

    calculate in chunks, in between splits, calculate avarage over each chunk, calculate
    average over averages? Should work

    TODO: comments needed, document
    */
    private calculateAverageRateOfReturn(): number {

        const dayOnDayReturns: number[] = [];

        /*
        O(n) time, O(2n) space, can we do better?
        */
        for (let i = 0; i < this.prices.length; i++) {

            /*
            There is no perecentage change from nothing to first entry
            */
            if (i === 0) {

                continue;
            }

            const currentPrice = this.prices[i].close;

            const previousPrice = this.prices[i - 1].close;

            /*
            Otherwise, calculate percentange change over each day
            */
            dayOnDayReturns.push(
                ((currentPrice - previousPrice) / previousPrice) * 100
            );
        }

        /*
        Sum changes and divide over the total number of diffs to get to average
        */
        const sumOfHistoricalReturns = dayOnDayReturns.reduce((x, y) => x + y);

        return sumOfHistoricalReturns / dayOnDayReturns.length;
    }

    public calculateStandardDeviation(): void {

        const historicRateOfReturn = this.calculateAverageRateOfReturn();

        console.log(historicRateOfReturn);
    }
}
