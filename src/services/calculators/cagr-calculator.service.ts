/*
CAGR = ([(Ending Value / Beginning Value) ^ (1 / # of years)] - 1) * 100

base = 1 share

for each stock split:

    if to > from:

        base *= to

    else:

        base /= to

Then:

endingValue = last price * base

beginningValue = first price (* 1, duh)

# of years = sum of unique years in prices dataset

TODO: docs and validation needed! THIS IS WRONG, you have to consdier time frames

On CAGR:

https://www.investopedia.com/terms/c/cagr.asp

Don't do it historical, calculate as of today 1 year back

index from prices: prices[prices.length - 365] (factor in leap year as well)

Keep since-IPO calculation as curiosity
*/

import { ITickerPrice, ITickerSplit } from '../../interfaces/ticker.interface';

export class CAGRCalculatorService {

    base: number;

    startingPrice: number;

    endingPrice: number;

    numberOfUniqueYears: number;

    constructor(prices: ITickerPrice[], splits: ITickerSplit[], ipoDate: string) {

        this.base = 1;

        this.startingPrice = prices[0].close;

        /*
        We want number of unique years since stock is listed - 1, since we disregard current year
        (within any point in time prices are always incomplete for this year)
        */
        this.numberOfUniqueYears = Number(new Date().getFullYear()) - Number(new Date(ipoDate).getFullYear()) - 1;

        for (let i = 0; i < splits.length; i++) {

            if (splits[i].split_to > splits[i].split_from) {

                this.base *= splits[i].split_to;
            }
            else {

                this.base /= splits[i].split_to;
            }
        }

        /*
        This would signify the end value of 1 share held since the IPO date,
        even if stock was split multiple times

        E.g., if one holds 1 share, then splits of 1:2, 1:3, and 1:4 happen,
        one would end up holding 2 * 3 * 4 = 24 shares

        Each valued by the latest market price; total value of which is then the measure
        of the growth of than one share
        */
        this.endingPrice = prices[prices.length - 1].close * this.base;
    }

    public calculateCAGR(): number {

        const cagr =  (
            (this.endingPrice / this.startingPrice) * (1 / this.numberOfUniqueYears) - 1
        ) * 100;

        console.log(cagr);

        return cagr;
    }

}
