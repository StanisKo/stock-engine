/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Returns TTM margin (starting price date, ending price date)

Returns starting and ending price based on provided set

Slices incoming (historical dataset) into TTM subset

TTM: Trailing Twelve Months

TTM margin example:

If we're running trailing 12 months in July 2020, our starting date will be July 1, 2019
Our ending date will be the last day of the month just completed — June 30, 2020
*/

import moment from 'moment';

import { ITickerPrice } from '../../interfaces/ticker.interface';

export class TimeSeriesHelperService {

    static getTTMMargin(): [start: string, end: string] {

        let firstDayOfCurrentMonthOneYearBack = moment().subtract(1, 'year').startOf('month');

        const lastDayOfLastMonth = moment().subtract(1, 'month').endOf('month');

        /*
        If day of the week one year back falls on the weekend,
        take last adjacent Friday
        */
        const dayOfTheWeekOneYearBack = firstDayOfCurrentMonthOneYearBack.day();

        if ([5, 6].includes(dayOfTheWeekOneYearBack)) {

            firstDayOfCurrentMonthOneYearBack = firstDayOfCurrentMonthOneYearBack.subtract(
                {5: 1, 6: 2}[dayOfTheWeekOneYearBack],
                'day'
            );
        }

        return [firstDayOfCurrentMonthOneYearBack.format('MM-DD-YYYY'), lastDayOfLastMonth.format('MM-DD-YYYY')];
    }

    static getStartingAndEndingPrice(prices: ITickerPrice[]): [startingPrice: number, endingPrice: number] {

        return [prices[0].adjClose, prices[prices.length - 1].adjClose];
    }

    static sliceDataSetIntoTTM(prices: ITickerPrice[]): ITickerPrice[] {

        const [oneYearBack, _] = TimeSeriesHelperService.getTTMMargin();

        const startingPrice = prices.find(price => moment(price.date).format('MM-DD-YYYY') === oneYearBack);

        return prices.slice(prices.indexOf(startingPrice!) ?? 0);
    }
}
