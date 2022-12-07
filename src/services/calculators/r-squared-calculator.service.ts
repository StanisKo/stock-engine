/* eslint-disable @typescript-eslint/no-unused-vars */

/*
R-Squared — measures how much the movement of the assets is influenced by the movement of the index.
Ranges from 0 to 100.

R-Squared = r^2

On R-Squared: https://www.investopedia.com/terms/r/r-squared.asp

On Correlation: https://www.investopedia.com/terms/c/correlationcoefficient.asp

Thank you: https://github.com/rubenvar/calculate-correlation/blob/main/lib/correlation.js

The goal is to find investments that will beat the market
Look for lower r-squared because we're seeking stocks that don’t just match the index
*/

import { ITickerPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class RSquaredCalculatorService {

    static calculateRSquared(prices: ITickerPrice[], benchmarkPrices: ITickerPrice[]): number {

        const [tickerReturns, tickerAverageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            prices
        );

        const [benchmarkReturns, benchmarkAverageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            benchmarkPrices
        );

        const tickerStandardDeviation = CalculatorHelperService.calculateStandardDeviation(
            tickerReturns,
            tickerAverageRateOfReturn
        );

        const benchmarkStandardDeviation = CalculatorHelperService.calculateStandardDeviation(
            benchmarkReturns,
            benchmarkAverageRateOfReturn
        );

        let sumOfMultipliedDifferences = 0;

        for (let i = 0; i < tickerReturns.length; i++) {

            const multipliedDifference =
                (tickerReturns[i] - tickerAverageRateOfReturn) * (benchmarkReturns[i] - benchmarkAverageRateOfReturn);

            sumOfMultipliedDifferences += multipliedDifference;
        }

        const differencesDividedByDeviations =
            sumOfMultipliedDifferences / (tickerStandardDeviation * benchmarkStandardDeviation);

        const correlation = differencesDividedByDeviations / tickerReturns.length - 1;

        const rSquared = Math.pow(correlation, 2);

        console.log(rSquared);

        return rSquared;
    }
}
