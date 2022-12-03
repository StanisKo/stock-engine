/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Slices incoming (historical dataset) into TTM subset
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import moment from 'moment';

export class TimeSeriesHelperService {

    static sliceDataSetIntoTTM(prices: ITickerPrice[]): ITickerPrice[] {

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

        const startingPrice = prices.find(price => price.date === oneYearBackAsString);

        return prices.slice(prices.indexOf(startingPrice!) ?? 0);
    }
}
