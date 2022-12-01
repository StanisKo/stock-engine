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

Keep since-IPO calculation as curiosity
*/

import { ITickerPrice, ITickerSplit } from '../../interfaces/ticker.interface';

export class CAGRCalculatorService {

    splitFactor: number;

    startingPrice: number;

    endingPrice: number;

    numberOfUniqueYears: number;

    constructor(prices: ITickerPrice[], splits: ITickerSplit[]) {

        this.splitFactor = 1;

        const now = new Date();

        const splitYearToDate = splits.find(
            split => new Date(split.execution_date).getFullYear === now.getFullYear
        );

        if (splitYearToDate) {

            const { split_to, split_from } = splitYearToDate;

            /*
            This would signify the end value of 1 share held,
            even if stock was split multiple times witin year-to-date

            E.g., if one holds 1 share, then splits of 1:2, 1:3, and 1:4 happen,
            one would end up holding 2 * 3 * 4 = 24 shares

            Each valued by the latest market price; total value of which is then the measure
            of the growth of than one share

            The reverse, is true as well: if reverse split took place, the split factor would decrease
            */
            split_to > split_from ? this.splitFactor *= split_to : this.splitFactor /= split_to;
        }

        /*
        We then apply the split factor to the ending price
        */
        this.endingPrice = prices[prices.length - 1].close * this.splitFactor;

        /*
        
        */
        
        this.startingPrice = prices.find(
            price =>
                price.date === `${new Date().getFullYear() - 1}-${new Date().getMonth() + 1}-${new Date().getDate()}`
        )?.close || 0;

        this.endingPrice = prices[prices.length - 1].close;

        console.log(this.startingPrice);
    }

    public calculateCAGR(): number {

        /*
        Here, we can simply subtract 1, since we're always looking one year back
        */
        const cagr =  ((this.endingPrice / this.startingPrice) - 1) * 100;

        console.log(cagr);

        return cagr;
    }

}
