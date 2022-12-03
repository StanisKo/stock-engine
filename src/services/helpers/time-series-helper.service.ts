/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Returns TTM margin (starting price date, ending price date)

Slices incoming (historical dataset) into TTM subset

TTM: Trailing Twelve Months
*/

import moment from 'moment';

import { ITickerPrice } from '../../interfaces/ticker.interface';

/*
TODO: TTM does not include current month!

TODO: build method that would actully return two data points [number, number]
rather than margins
*/
export class TimeSeriesHelperService {

    static returnTTMMargin(): [string, string] {

        const now = moment();

        let oneYearBack = moment(now).subtract(1, 'year');

        const dayOfWeekOneYearBack = oneYearBack.day();

        if (dayOfWeekOneYearBack === 5) {

            oneYearBack = oneYearBack.subtract(1, 'day');
        }

        if (dayOfWeekOneYearBack === 6) {

            oneYearBack = oneYearBack.subtract(2, 'day');
        }

        return [oneYearBack.format('MM-DD-YYYY'), now.format('MM-DD-YYYY')];
    }

    static sliceDataSetIntoTTM(prices: ITickerPrice[]): ITickerPrice[] {

        const [oneYearBack, _] = TimeSeriesHelperService.returnTTMMargin();

        const startingPrice = prices.find(price => moment(price.date).format('MM-DD-YYYY') === oneYearBack);

        return prices.slice(prices.indexOf(startingPrice!) ?? 0);
    }
}
