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

    private static calculateCorrelationCoefficient(X: number[], Y: number[], n: number): number {
         
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

    static calculateRSquared(prices: ITickerPrice[], benchmarkPrices: ITickerPrice[]): number {

        const [tickerReturns, tickerAverageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            prices
        );

        const [benchmarkReturns, benchmarkAverageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            benchmarkPrices
        );

        // const tickerStandardDeviation = CalculatorHelperService.calculateStandardDeviation(
        //     tickerReturns,
        //     tickerAverageRateOfReturn
        // );

        // const benchmarkStandardDeviation = CalculatorHelperService.calculateStandardDeviation(
        //     benchmarkReturns,
        //     benchmarkAverageRateOfReturn
        // );

        // let sumOfMultipliedDifferences = 0;

        // for (let i = 0; i < tickerReturns.length; i++) {

        //     const multipliedDifference =
        //         (tickerReturns[i] - tickerAverageRateOfReturn) * (benchmarkReturns[i] - benchmarkAverageRateOfReturn);

        //     sumOfMultipliedDifferences += multipliedDifference;
        // }

        // const differencesDividedByDeviations =
        //     sumOfMultipliedDifferences / (tickerStandardDeviation * benchmarkStandardDeviation);

        // const correlation = differencesDividedByDeviations / tickerReturns.length - 1;

        const correlation = RSquaredCalculatorService.calculateCorrelationCoefficient(
            tickerReturns,
            benchmarkReturns,
            tickerReturns.length
        );

        const rSquared = Math.pow(correlation, 2) * 100;

        console.log('Calculated R-Squared');

        return rSquared;
    }
}
