/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Slices incoming (historical dataset) into TTM subset

TTM: Trailing Twelve Months
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import moment from 'moment';

export class TimeSeriesHelperService {

    static returnTTMMargin(format: 'YYYY-MM-DD' | 'MM-DD-YYYY'): [oneYearBack: string, now: string] {

        const now = moment();

        let oneYearBack = moment(now).subtract(1, 'year');

        const dayOfWeekOneYearBack = oneYearBack.day();

        if (dayOfWeekOneYearBack === 5) {

            oneYearBack = oneYearBack.subtract(1, 'day');
        }

        if (dayOfWeekOneYearBack === 6) {

            oneYearBack = oneYearBack.subtract(2, 'day');
        }

        return [oneYearBack.format(format), now.format(format)];
    }

    static sliceDataSetIntoTTM(prices: ITickerPrice[]): ITickerPrice[] {

        const [oneYearBack, _] = TimeSeriesHelperService.returnTTMMargin('YYYY-MM-DD');

        const startingPrice = prices.find(price => price.date === oneYearBack);

        return prices.slice(prices.indexOf(startingPrice!) ?? 0);
    }
}
