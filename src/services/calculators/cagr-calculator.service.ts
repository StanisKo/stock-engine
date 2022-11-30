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

import { ITickerPrice, ITickerSplit } from '../../interfaces/ticker.interface';

export class CAGRCalculatorService {

    startingPrice: number;

    endingPrice: number;

    numberOfUniqueYears: number;

    /*
    We can immediately declare it as a constant
    */
    base: 1;

    constructor(startingPrice: number, endindPrice: number, prices: ITickerPrice[], splits: ITickerSplit[]) {

        this.startingPrice = startingPrice;

        this.endingPrice = endindPrice;


    }

}
