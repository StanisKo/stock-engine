/*
SD for Standard Deviation

V for Variance

RoR for Rate of Return (daily, since we're calculating over daily prices)

ARoR for Average Rate of Return

****

SD = √ V

V = Σ(RoR - ARoR)² / N(RoR) - 1

Or in words:

Standard Deviation is the square root of Variance

Variance is sum of squares of diffs between Rate of Return and Avarage Rate of Return
divided by count of returns minus one
*/

/*
TODO: not done, AAPL is at 2.56 according to internet, you're at 2.58, where did you go wrong?, simplify formulas
*/

import { ITickerPrice, ITickerSplit } from  '../interfaces/ticker.interface';

export class StandardDeviationCalculatorService {

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
    TODO: This has to be moved around file

    In order to calcualate average rate of return we got to make use of available EOD prices

    When thinking of average RoR it is crucial to also factor in stocks splits,
    since calculating over the raw dataset would skew the result

    E.g., if one would own 1 share of $100 that would then grow to $120 and then the stock split of,
    let's say, 1:6 take place, one would end up with 6 shares of $20 each

    This drastically impacts stock price, since the curve would be $100 --> $120 --> $20,
    skewing the calculation of average returns into negative territory

    Nevertheless and luckily for us, we have information on date and time of stocks splits per ticker

    Therefore, what we need to do:

    Chunk the dataset into subsets divided by stock splits dates

    Calculate average RoR over each subset

    Sum averages per subset and calculate average (of averages)

    This would yield proper understanding of ticker's RoR
    */
    private calculateAverageRateOfReturn(prices: ITickerPrice[]): [number[], number] {

        const dayOnDayReturns: number[] = [];

        /*
        O(n) time, O(2n) space, can we do better?
        */
        for (let i = 0; i < prices.length; i++) {

            /*
            There is no percentage change from nothing to first entry
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

        return [dayOnDayReturns, sumOfHistoricalReturns / dayOnDayReturns.length];
    }

    /*
    To calculate variance we sum the squares of
    diffs between daily rate of return and average rate of return
    and then divide it by count of daily returns - 1
    */
    private calculateVariance(returns: number[], averageRateOfReturn: number): number {

        let sumOfSquares = 0;

        for (let i = 0; i < returns.length; i++) {

            sumOfSquares += Math.pow(returns[i] - averageRateOfReturn, 2);
        }

        const variance = sumOfSquares / returns.length - 1;

        return variance;
    }

    public calculateStandardDeviation(): number {

        let standardDeviation;

        /*
        If there are no splits, we can calculate over entire dataset immediately
        */
        if (!Object.keys(this.splits).length) {

            const [returns, averageRateOfReturn] = this.calculateAverageRateOfReturn(this.prices);

            const variance = this.calculateVariance(returns, averageRateOfReturn);

            standardDeviation = Math.sqrt(variance);

            return standardDeviation;
        }

        /*
        Otherwise, we calculate variance over each subset individually, get the average
        and then use as input to calculate standard deviation
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

        const variances: number[] = [];

        for (let i = 0; i < subsets.length; i++) {

            const [returns, averageRateOfReturn] = this.calculateAverageRateOfReturn(subsets[i]);

            const variance = this.calculateVariance(returns, averageRateOfReturn);

            variances.push(variance);
        }

        const variance = variances.reduce((x, y) => x + y) / variances.length;

        standardDeviation = Math.sqrt(variance);

        console.log(standardDeviation);

        return standardDeviation;
    }
}
