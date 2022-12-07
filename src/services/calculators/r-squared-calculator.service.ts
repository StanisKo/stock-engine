/* eslint-disable @typescript-eslint/no-unused-vars */

/*
R-Squared — measures how much the movement of the assets is influenced by the movement of the index.
Ranges from 0 to 100.

NOTE: We're using correlation-based formula to calculate r-squared:

R-Squared = r^2

On R-Squared: https://www.investopedia.com/terms/r/r-squared.asp

On Correlation: https://www.investopedia.com/terms/c/correlationcoefficient.asp

The goal is to find investments that will beat the market
Look for lower r-squared because we're seeking stocks that don’t just match the index
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class RSquaredCalculatorService {

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

        const tickerStandardDeviation = (N * squareSumOfTickerReturns - Math.pow(sumOfTickerReturns, 2));

        const benchmarkStandardDeviation = (N * squareSumOfBenchmarkReturns - Math.pow(sumOfBenchmarkReturns, 2));

        const correlationCoefficient = covariance / Math.sqrt(tickerStandardDeviation * benchmarkStandardDeviation);

        return correlationCoefficient;
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
