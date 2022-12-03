/*
CAGR = ( [ (Ending Price / Starting Price) ^ (1 / N of years to look back) ] - 1) * 100

On CAGR: https://www.investopedia.com/terms/c/cagr.asp
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

export class CAGRCalculatorService {

    startingPrice: number;

    endingPrice: number;

    constructor(prices: ITickerPrice[]) {

        this.startingPrice = prices[0].adjClose;

        this.endingPrice = prices[prices.length - 1].adjClose;
    }

    public calculateCAGR(): number {

        /*
        Here, bringing the diff between ending price and starting price to the exponent
        of 1 divided by number of years to look back is unnecessary, since we're always
        calculating one year back

        Yet, kept if business logic will change (V1, 01-12-2022)

        Otherwise, the expression would be:

        ((this.endingPrice / this.startingPrice) - 1) * 100
        */
        const cagr =  (
            Math.pow((this.endingPrice / this.startingPrice), 1 / 1) - 1
        ) * 100;

        console.log('Calculated CAGR');

        return cagr;
    }
}
