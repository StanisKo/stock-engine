/*
CAGR = ( [ (Ending Price / Start Price) ^ (1 / N years to look back) ] - 1) * 100
*/

import moment from 'moment';

import { ITickerPrice, ITickerSplit } from '../../interfaces/ticker.interface';

export class CAGRCalculatorService {

    splitFactor: number;

    startingPrice: number;

    endingPrice: number;

    constructor(prices: ITickerPrice[], splits: ITickerSplit[]) {

        this.splitFactor = 1;

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

        this.startingPrice = prices.find(price => price.date === oneYearBackAsString)?.close || 0;

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
    }

    public calculateCAGR(): number {

        /*
        Here, we can simply subtract 1, since we're always looking one year back
        */
        const cagr =  ((this.endingPrice / this.startingPrice) - 1) * 100;

        return cagr;
    }

}
