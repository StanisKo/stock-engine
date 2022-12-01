/*
CAGR = ( [ (Ending Price / Starting Price) ^ (1 / N of years to look back) ] - 1) * 100

On CAGR: https://www.investopedia.com/terms/c/cagr.asp
*/

import moment from 'moment';

import { ITickerPrice } from '../../interfaces/ticker.interface';

export class CAGRCalculatorService {

    startingPrice: number;

    endingPrice: number;

    constructor(prices: ITickerPrice[]) {

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

        this.startingPrice = prices.find(price => price.date === oneYearBackAsString)?.adjusted_close || 0;

        /*
        We then apply the split factor to the ending price
        */
        this.endingPrice = prices[prices.length - 1].adjusted_close;
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
