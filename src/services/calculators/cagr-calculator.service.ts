/*
CAGR = ([(Ending Value / Beginning Value) ^ (1 / # of years)] - 1) * 100

base = 1 share

for each stock split:

    if from > to:

        base *= to

    else:

        base /= to

Then:

endingValue = last price * base

beginningValue = first price (* 1, duh)

# of years = sum of unique years in prices dataset
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

// import { ITickerSplit } from '../../interfaces/ticker.interface';

export class CAGRCalculatorService {

    startingPrice: number;

    endingPrice: number;

    numberOfUniqueYears: number;

    /*
    We can immediately declare it as a constant
    */
    base: 1;

    // splits: ITickerSplit[]

    constructor(prices: ITickerPrice[], ipoDate: string) {

        this.startingPrice = prices[0].close;

        this.endingPrice = prices[prices.length - 1].close;

        /*
        We want number of unique years since stock is listed - 1, since we disregard current year
        (within any point in time prices are always incomplete for this year)
        */
        this.numberOfUniqueYears = Number(new Date().getFullYear()) - Number(new Date(ipoDate).getFullYear()) - 1;

        console.log(this.numberOfUniqueYears);
    }

}
