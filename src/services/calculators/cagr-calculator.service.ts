/*
CAGR = ( [ (Ending Price / Starting Price) ^ (1 / N of years to look back) ] - 1) * 100

On CAGR: https://www.investopedia.com/terms/c/cagr.asp
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

export class CAGRCalculatorService {

    prices: ITickerPrice[];

    constructor(prices: ITickerPrice[]) {

        this.prices = prices;
    }

    public calculateCAGR(): number {

        const [endingPrice, startingPrice] = TimeSeriesHelperService.getEndingAndStartingPrice(this.prices);

        /*
        Since we're calculating CAGR over TTM (1 year), we don't need to bring
        the division product to exponent of 1 / N of years:

        Math.pow((this.endingPrice / this.startingPrice), 1 / N of years) - 1

        We can simply:

        ((this.endingPrice / this.startingPrice) - 1) * 100
        */
        const cagr = (
            ((endingPrice / startingPrice) - 1)
        ) * 100;

        console.log('Calculated CAGR');

        return cagr;
    }
}
