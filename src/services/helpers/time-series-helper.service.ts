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

import { IGenericPrice, ITickerPrice } from '../../interfaces/ticker.interface';

export class TimeSeriesHelperService {

    public static getTTMMargin(withOneDayForward = false): [start: string, end: string] {

        let firstDayOfCurrentMonthOneYearBack = moment().subtract(1, 'year').startOf('month');

        let lastDayOfLastMonth = moment().subtract(1, 'month').endOf('month');

        if (withOneDayForward) {

            firstDayOfCurrentMonthOneYearBack = firstDayOfCurrentMonthOneYearBack.add(1, 'day');

            lastDayOfLastMonth = lastDayOfLastMonth.add(1, 'day');
        }

        /*
        TODO: On MM-DD-YYYY: this has been done to adhere to yahoo API. Now we use it only for benchmark prices

        This has to be moved to DD-MM-YYYY
        */
        return [firstDayOfCurrentMonthOneYearBack.format('MM-DD-YYYY'), lastDayOfLastMonth.format('MM-DD-YYYY')];
    }

    public static getStartingAndEndingPrice(prices: IGenericPrice[]): [startingPrice: number, endingPrice: number] {

        /*
        NOTE: on coalesce operator -- we need to get starting and ending price
        from prices delivered by different APIs
        */
        return [
            prices[0].adjusted_close ?? prices[0].adjClose,
            prices[prices.length - 1].adjusted_close ?? prices[prices.length - 1].adjClose
        ];
    }

    public static sliceDatasetIntoTTM(prices: ITickerPrice[]): ITickerPrice[] {

        /*
        Get margins
        */
        const [firstDayOfCurrentMonthOneYearBack, lastDayOfLastMonth] = TimeSeriesHelperService.getTTMMargin();

        /*
        Lookup starting and ending price
        */

        const startingPrice = prices.findIndex(price => {

            const priceDate = new Date(price.date);

            let priceMonth: string | number = priceDate.getMonth() + 1;

            /*
            Pad with 0 to adhere to margin
            */
            priceMonth = priceMonth >= 10 ? priceMonth : `0${priceMonth}`;

            const priceYearAndMonth = `${priceDate.getFullYear()}-${priceMonth}`;

            const [month, _, year] = firstDayOfCurrentMonthOneYearBack.split('-');

            const lowerMarginYearAndMonth = `${year}-${month}`;

            return priceYearAndMonth === lowerMarginYearAndMonth;
        });

        const endingPrice = prices.findIndex(price => {

            const priceDate = new Date(price.date);

            let priceMonth: string | number = priceDate.getMonth() + 1;

            /*
            Pad with 0 to adhere to margin
            */
            priceMonth = priceMonth >= 10 ? priceMonth : `0${priceMonth}`;

            const priceYearAndMonth = `${priceDate.getFullYear()}-${priceMonth}`;

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
            If we're on the last month, use next year, first month
            */
            if (month === '12') {
                upperMarginYearAndMonth = `${Number(year) + 1}-01`;
            }
            /*
            Otherwise, use current year, increment the month
            */
            else {
                let nextMonth: string | number = Number(month);

                nextMonth = nextMonth >= 10 ? nextMonth + 1 : `0${nextMonth + 1}`;

                upperMarginYearAndMonth = `${year}-${nextMonth}`;
            }

            return priceYearAndMonth === upperMarginYearAndMonth;
        });

        /*
        If no starting price one year back -- stock is young, grab the first index
        */
        return prices.slice(startingPrice < 0 ? 0 : startingPrice, endingPrice);
    }

    public static sliceDatasetIntoLastNTradingDays(prices: ITickerPrice[], days: number): ITickerPrice[] {

        return prices.slice(prices.length - 1 - days);
    }
}
