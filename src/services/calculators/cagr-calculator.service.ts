/*
CAGR = ( [ (Ending Price / Starting Price) ^ (1 / N of years to look back) ] - 1) * 100

On CAGR: https://www.investopedia.com/terms/c/cagr.asp
*/

import moment from 'moment';

import { ITickerPrice, ITickerSplit } from '../../interfaces/ticker.interface';

export class CAGRCalculatorService {

    splitFactor: number;

    startingPrice: number;

    endingPrice: number;

    constructor(prices: ITickerPrice[], splits: ITickerSplit[]) {

        this.splitFactor = 1;

        /*
        As we're calculating CAGR on year-to-date basis, we need the price
        exactly on year back

        Yet, there are some edge cases: if one year back falls on Saturday or Sunday,
        we need to take the price from the adjacent Friday
        */

        const now = new Date();

        let oneYearBack = moment(now).subtract(1, 'year');

        const dayOfWeekOneYearBack = oneYearBack.day();

        if (dayOfWeekOneYearBack === 5) {

            oneYearBack = oneYearBack.subtract(1, 'day');
        }

        if (dayOfWeekOneYearBack === 6) {

            oneYearBack = oneYearBack.subtract(2, 'day');
        }

        const oneYearBackAsString = oneYearBack.format('YYYY-MM-DD');

        /*
        Knowing the precise date, we can now define the starting price
        */

        this.startingPrice = prices.find(price => price.date === oneYearBackAsString)?.close || 0;

        /*
        Additionally, we need to factor in any potential splits that might have taken
        place within the last year
        */
        const splitYearToDate = splits.find(
            split => new Date(split.execution_date).getFullYear() === now.getFullYear()
        );

        if (splitYearToDate) {

            const { split_to, split_from } = splitYearToDate;

            /*
            This would signify the end value of 1 share held,
            even if stock was split multiple times within year-to-date

            E.g., if one holds 1 share as of one year back,
            then splits of 1:2, 1:3, and 1:4 happen, one would end up holding 2 * 3 * 4 = 24 shares

            Each valued by the latest market price; total value of which is then the measure
            of the growth/decrease of than one share

            The reverse is true as well: if reverse split took place, the split factor would decrease
            */
            split_to > split_from ? this.splitFactor *= split_to : this.splitFactor /= split_to;
        }

        /*
        We then apply the split factor to the ending price
        */
        this.endingPrice = prices[prices.length - 1].close * this.splitFactor;
    }

    public calculateCAGR(): number {

        /*
        Here, bringing the diff between ending price and starting price to the exponent
        of 1 divided by number of years to look back is unnecessary, since we're always
        calculating one year back

        Yet, kept if business logic will change (V1, 01-12-2022)

        Otherwise, the expression would be:

        ((this.endingPrice / this.startingPrice) - 1) * 100
        */
        const cagr =  (
            Math.pow((this.endingPrice / this.startingPrice), 1 / 1) - 1
        ) * 100;

        console.log('Calculated CAGR');

        return cagr;
    }
}
