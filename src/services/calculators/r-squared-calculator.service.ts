/* eslint-disable @typescript-eslint/no-unused-vars */

/*
R-Squared — measures how much the movement of the assets is influenced by the movement of the index.
Ranges from 0 to 100.

R-Squared = r^2

On R-Squared: https://www.investopedia.com/terms/r/r-squared.asp

On Correlation: https://www.investopedia.com/terms/c/correlationcoefficient.asp

The goal is to find investments that will beat the market
Look for lower r-squared because we're seeking stocks that don’t just match the index
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class RSquaredCalculatorService {

    private static foo(X: number[], Y: number[], n: number): number {
         
        let sum_X = 0, sum_Y = 0, sum_XY = 0;
        let squareSum_X = 0, squareSum_Y = 0;
        
        for(let i = 0; i < n; i++)
        {
             
            // Sum of elements of array X.
            sum_X = sum_X + X[i];
        
            // Sum of elements of array Y.
            sum_Y = sum_Y + Y[i];
        
            // Sum of X[i] * Y[i].
            sum_XY = sum_XY + X[i] * Y[i];
        
            // Sum of square of array elements.
            squareSum_X = squareSum_X + X[i] * X[i];
            squareSum_Y = squareSum_Y + Y[i] * Y[i];
        }
        
        // Use formula for calculating correlation
        // coefficient.
        const corr = (n * sum_XY - sum_X * sum_Y)/
                   (Math.sqrt((n * squareSum_X -
                           sum_X * sum_X) *
                              (n * squareSum_Y -
                           sum_Y * sum_Y)));
        
        return corr;
    }

    private static calculateCorrelationCoefficient(tickerReturns: number[], benchmarkReturns: number[]): number {

        const N = tickerReturns.length;

        let sumOfTickerReturns = 0, sumOfBenchmarkReturns = 0, sumOfMultipliedReturns = 0;

        let squareSumOfTickerReturns = 0, squareSumOfBenchmarkReturns = 0;

        for(let i = 0; i < N; i++){

            sumOfTickerReturns += tickerReturns[i];

            sumOfBenchmarkReturns += benchmarkReturns[i];

            sumOfMultipliedReturns += tickerReturns[i] * benchmarkReturns[i];

            squareSumOfTickerReturns += Math.pow(tickerReturns[i], 2);

            squareSumOfBenchmarkReturns += Math.pow(benchmarkReturns[i], 2);
        }

        const covariance = (N * sumOfMultipliedReturns - sumOfTickerReturns * sumOfBenchmarkReturns);

        const correlation = covariance /
                   Math.sqrt(
                       (N * squareSumOfTickerReturns - Math.pow(sumOfTickerReturns, 2))
                        * (N * squareSumOfBenchmarkReturns - Math.pow(sumOfBenchmarkReturns, 2))
                   );

        return correlation;
    }

    static calculateRSquared(prices: ITickerPrice[], benchmarkPrices: ITickerPrice[]): number {

        const [tickerReturns] = CalculatorHelperService.calculateAverageRateOfReturn(
            prices
        );

        const [benchmarkReturns] = CalculatorHelperService.calculateAverageRateOfReturn(
            benchmarkPrices
        );

        const correlation = RSquaredCalculatorService.calculateCorrelationCoefficient(
            tickerReturns,
            benchmarkReturns
        );

        const rSquared = Math.pow(correlation, 2) * 100;

        console.log('Calculated R-Squared');

        return rSquared;
    }
}
