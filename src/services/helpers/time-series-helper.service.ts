/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Returns TTM margin (starting price date, ending price date)

Returns starting and ending price based on provided set

Slices incoming (historical dataset) into TTM subset

TTM: Trailing Twelve Months
*/

import moment from 'moment';

import { ITickerPrice } from '../../interfaces/ticker.interface';

/*
In other words, if you are running your trailing 12 months reports in July 2020,
your starting date will be July 1, 2019.
Your ending date will be the last day of the month just completed — in this example, June 30, 2020
*/

export class TimeSeriesHelperService {

    static getTTMMargin(): [start: string, end: string] {

        const firstDayOfThisMonth = moment().subtract(1, 'month').endOf('month');

        let firstDayOfSameMonthOneYearBack = moment().subtract(1, 'year').startOf('month');

        /*
        If day of the week one year back falls on the weekend,
        take last adjacent Friday
        */
        const dayOfTheWeekOneYearBack = firstDayOfSameMonthOneYearBack.day();

        if ([5, 6].includes(dayOfTheWeekOneYearBack)) {

            firstDayOfSameMonthOneYearBack = firstDayOfSameMonthOneYearBack.subtract(
                {5: 1, 6: 2}[dayOfTheWeekOneYearBack],
                'day'
            );
        }

        console.log([firstDayOfSameMonthOneYearBack.format('MM-DD-YYYY'), firstDayOfThisMonth.format('MM-DD-YYYY')]);

        return [firstDayOfSameMonthOneYearBack.format('MM-DD-YYYY'), firstDayOfThisMonth.format('MM-DD-YYYY')];
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
