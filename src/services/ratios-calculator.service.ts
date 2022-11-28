/*
Calculates ratios missing from the API

On SD: https://www.businessinsider.com/personal-finance/how-to-find-standard-deviation?international=true&r=US&IR=T

       https://www.fincash.com/l/equity/standard-deviation

       https://financetrain.com/variance-standard-deviation ! (RoR included)

On RoR: https://www.investopedia.com/terms/r/rateofreturn.asp

SD = 
*/

import { ITickerPrice, ITickerSplit } from  '../interfaces/ticker.interface';

export class RatiosCalculatorService {

    prices: ITickerPrice[];

    splits: { [key: string]: boolean };

    constructor(prices: ITickerPrice[], splits: ITickerSplit[]) {

        this.prices = prices;

        this.splits = {};

        for (let i = 0; i < splits.length; i++) {

            this.splits[splits[i].execution_date] = true;
        }
    }

    /*
    In order to calcualate average rate of return we got to make use of available EOD prices

    When thinking of average RoR it is crucial to also factor in stocks splits,
    since calculating over the raw dataset would skew the result

    E.g., if one would own 1 share of $100 that would then grow to $120 and then the stock split of,
    let's say, 6:1 take place, one would end up with 6 shares of $20 each

    This drastically impacts stock price, since the curve would be $100 --> $120 --> $20,
    skewing the calculation of average returns into negative territory

    Nevertheless and luckily for us, we have information on date and time of stocks splits per ticker

    Therefore, what we need to do:

    Chunk the dataset into subsets divided by stock splits dates

    Calculate average RoR over each subset

    Sum averages per chunk and calculate average (of averages)

    This would yield proper understanding of ticker's RoR
    */
    private calculateAverageRateOfReturnOverSubset(prices: ITickerPrice[]): number {

        const dayOnDayReturns: number[] = [];

        /*
        O(n) time, O(2n) space, can we do better?
        */
        for (let i = 0; i < prices.length; i++) {

            /*
            There is no perecentage change from nothing to first entry
            */
            if (i === 0) {

                continue;
            }

            const currentPrice = prices[i].close;

            const previousPrice = prices[i - 1].close;

            /*
            Otherwise, calculate percentange change over each day
            */
            dayOnDayReturns.push(
                ((currentPrice - previousPrice) / previousPrice) * 100
            );
        }

        /*
        Sum changes and divide over the total number of diffs to get to average
        */
        const sumOfHistoricalReturns = dayOnDayReturns.reduce((x, y) => x + y);

        return sumOfHistoricalReturns / dayOnDayReturns.length;
    }

    private calculateAverageRateOfReturn(): number {

        let historicalRateOfReturn;

        /*
        If there were no stock splits, we can calculate average over
        entire dataset immediately
        */
        if (!Object.keys(this.splits).length) {

            historicalRateOfReturn = this.calculateAverageRateOfReturnOverSubset(this.prices);

            return historicalRateOfReturn;
        }

        /*
        Otherwise, we divide dataset into subsets based on splits and calculate individually,
        to later sum and average over
        */
        const subsets: ITickerPrice[][] = [];

        let currentSubset: ITickerPrice[] = [];

        for (let i = 0; i < this.prices.length; i++) {

            const price = this.prices[i];

            /*
            If currently iterated price falls on split date,
            push subset into wrapper collection, clear current subset,
            remove data string from map and continue looping
            */
            if (this.splits[price.date]) {

                subsets.push(currentSubset);

                currentSubset = [];

                delete this.splits[price.date];
            }

            currentSubset.push(price);
        }

        const rateOfReturnPerSubset = subsets.map(subset => this.calculateAverageRateOfReturnOverSubset(subset));

        const sumOfReturnsAmongstSubsets = rateOfReturnPerSubset.reduce((x, y) => x + y);

        historicalRateOfReturn = sumOfReturnsAmongstSubsets / subsets.length;

        return historicalRateOfReturn;
    }

    public calculateStandardDeviation(): void {

        const historicRateOfReturn = this.calculateAverageRateOfReturn();

        console.log(historicRateOfReturn);
    }
}
