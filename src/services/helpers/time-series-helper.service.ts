/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Returns TTM margin (starting price date, ending price date)

Returns starting and ending price based on provided set

Slices incoming dataset into TTM subset

TTM: Trailing Twelve Months

TTM margin example:

If we're running trailing 12 months in July 2020, our starting date is July 1, 2019
Our ending date is the last day of the month just completed — June 30, 2020
*/

import moment from 'moment';

import { ITickerPrice } from '../../interfaces/ticker.interface';

export class TimeSeriesHelperService {

    public static getTTMMargin(withOneDayForward = false): [start: string, end: string] {

        let firstDayOfCurrentMonthOneYearBack = moment().subtract(1, 'year').startOf('month');

        let lastDayOfLastMonth = moment().subtract(1, 'month').endOf('month');

        if (withOneDayForward) {

            firstDayOfCurrentMonthOneYearBack = firstDayOfCurrentMonthOneYearBack.add(1, 'day');

            lastDayOfLastMonth = lastDayOfLastMonth.add(1, 'day');
        }

        return [firstDayOfCurrentMonthOneYearBack.format('MM-DD-YYYY'), lastDayOfLastMonth.format('MM-DD-YYYY')];
    }

    public static getStartingAndEndingPrice(prices: ITickerPrice[]): [startingPrice: number, endingPrice: number] {

        return [prices[0].adjClose, prices[prices.length - 1].adjClose];
    }

    public static sliceDatasetIntoTTM(prices: ITickerPrice[]): ITickerPrice[] {

        /*
        Get margins
        */
        const [firstDayOfCurrentMonthOneYearBack, lastDayOfLastMonth] = TimeSeriesHelperService.getTTMMargin();

        /*
        Lookup starting and ending price
        */

        const startingPrice = prices.find(price => {
            const priceYearAndMonth = `${price.date.getFullYear()}-${price.date.getMonth() + 1}`;

            const [month, _, year] = firstDayOfCurrentMonthOneYearBack.split('-');

            const lowerMarginYearAndMonth = `${year}-${month}`;

            return priceYearAndMonth === lowerMarginYearAndMonth;
        });

        const endingPrice = prices.find(price => {

            const priceYearAndMonth = `${price.date.getFullYear()}-${price.date.getMonth() + 1}`;

            const [month, _, year] = lastDayOfLastMonth.split('-');

            /*
            Here we actually want next month after the upper limit,
            since, in the end, we want the last day of last month

            Yet, since prices are sorted ascending, the lookup
            will return the first date of last month, if we were to use month of the upper limit

            Therefore, we lookup by + 1 month, and slice() ommitting the last
            index will then return us last date of last month
            */

            let upperMarginYearAndMonth;

            /*
            If we're on the last month, use values from margin
            */
            if (month === '12') {
                upperMarginYearAndMonth = `${year}-${month}`;
            }
            /*
            Otherwise, increment the month
            */
            else {
                upperMarginYearAndMonth = `${year}-${Number(month) + 1}`;
            }

            console.log(upperMarginYearAndMonth);

            return priceYearAndMonth === upperMarginYearAndMonth;
        });

        return prices.slice(prices.indexOf(startingPrice!), prices.indexOf(endingPrice!));
    }

    public static sliceDatasetIntoLastNTradingDays(prices: ITickerPrice[], days: number): ITickerPrice[] {

        return prices.slice(prices.length - 1 - days);
    }
}
