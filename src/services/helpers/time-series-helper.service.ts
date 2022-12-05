/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/*
Returns TTM margin (starting price date, ending price date)

Slices incoming (historical dataset) into TTM subset

TTM: Trailing Twelve Months
*/

import moment from 'moment';

import { ITickerPrice } from '../../interfaces/ticker.interface';

export class TimeSeriesHelperService {

    /*
    TODO: TTM does not include current month!
    */
    static getTTMMargin(): [string, string] {

        const lastDateOfPreviousMonth = moment().subtract(1, 'month').endOf('month');

        const firstDayOfMonthOneYearBack = moment().subtract(1, 'year').startOf('month');

        return [firstDayOfMonthOneYearBack.format('MM-DD-YYYY'), lastDateOfPreviousMonth.format('MM-DD-YYYY')];
    }

    static getEndingAndStartingPrice(prices: ITickerPrice[]): [number, number] {

        return [prices[prices.length - 1].adjClose, prices[0].adjClose];
    }

    static sliceDataSetIntoTTM(prices: ITickerPrice[]): ITickerPrice[] {

        const [oneYearBack, _] = TimeSeriesHelperService.getTTMMargin();

        const startingPrice = prices.find(price => moment(price.date).format('MM-DD-YYYY') === oneYearBack);

        return prices.slice(prices.indexOf(startingPrice!) ?? 0);
    }
}
