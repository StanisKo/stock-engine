/*
Calculates ratios missing from the API

On SD: https://www.businessinsider.com/personal-finance/how-to-find-standard-deviation?international=true&r=US&IR=T

       https://www.fincash.com/l/equity/standard-deviation

       https://financetrain.com/variance-standard-deviation ! (RoR included)

On RoR: https://www.investopedia.com/terms/r/rateofreturn.asp
*/

import { ITickerPrice } from  '../interfaces/ticker.interface';

export class RatiosCalculatorService {

    prices: ITickerPrice[];

    constructor(prices: ITickerPrice[]) {

        this.prices = prices;
    }

    private calculateHistoricRateOfReturn(): void {

        console.log(this.prices);
    }

    public calculateStandardDeviation(): void {

        const historicRateOfReturn = this.calculateHistoricRateOfReturn();
    }
}
