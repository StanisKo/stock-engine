import { IGenericPrice, ITickerPrice } from '../../interfaces/ticker.interface';

export class CalculatorHelperService {

    public static calculateRateOfReturn(startingPrice: number, endingPrice: number): number {

        return ((endingPrice - startingPrice) / startingPrice) * 100;
    }

    public static calculateAverageRateOfReturn(prices: IGenericPrice[]): [number[], number] {

        const returns: number[] = [];

        let sumOfReturns = 0;

        for (let i = 0; i < prices.length; i++) {

            /*
            There is no percentage change from nothing to first entry
            */
            if (i === 0) {

                continue;
            }

            /*
            Otherwise, calculate percentange change over each period

            NOTE: on coalesce operator -- we need to calculate averages
            over prices delivered by different APIs
            */
            const currentPrice = prices[i].adjusted_close ?? prices[i].adjClose;

            const previousPrice = prices[i - 1].adjusted_close ?? prices[i - 1].adjClose;

            const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;

            returns.push(percentageChange);

            sumOfReturns += percentageChange;
        }

        /*
        We need returns for standard deviation
        */
        return [returns, sumOfReturns / returns.length];
    }

    public static calculateStandardDeviationOverReturns(
        datasetSize: number, sumOfReturns: number, sumOfSquaredReturns: number): number {

        return datasetSize * sumOfSquaredReturns - Math.pow(sumOfReturns, 2);
    }

    /*
    05-01-2023: used only for ticker prices
    */
    public static calculateAveragePrice(prices: ITickerPrice[]): number {

        let sum = 0;

        for (let i = 0; i < prices.length; i++) {

            sum += prices[i].adjusted_close;
        }

        return sum / prices.length;
    }

    public static calculateTickerBenchmarkCovariance(tickerReturns: number[], benchmarkReturns: number[]): number {

        const N = tickerReturns.length;

        let sumOfTickerReturns = 0, sumOfBenchmarkReturns = 0, sumOfMultipliedReturns = 0;

        /*
        We first loop through returns, sum both datasets against themselves,
        sum the products of multiplication between each ticker-benchmark return pair,
        and sum the squares of each instance within each dataset
        */
        for(let i = 0; i < N; i++){

            sumOfTickerReturns += tickerReturns[i];

            sumOfBenchmarkReturns += benchmarkReturns[i];

            sumOfMultipliedReturns += tickerReturns[i] * benchmarkReturns[i];
        }

        /*
        We then calculate covariance between ticker-benchmark returns
        */
        const covariance = N * sumOfMultipliedReturns - sumOfTickerReturns * sumOfBenchmarkReturns;

        return covariance;
    }
}
