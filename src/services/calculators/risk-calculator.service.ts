import { Discard } from '../../utils/discard.decorator';

import { ITickerPrice, IBenchmarkPrice, IGenericPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class RiskCalculatorService {

    /*
    To calculate variance we sum the squares of
    diffs between daily rate of return and average rate of return
    and then divide it by count of daily returns - 1
    */
    private static calculateVariance(returns: number[], averageRateOfReturn: number): number {

        let sumOfSquares = 0;

        for (let i = 0; i < returns.length; i++) {

            sumOfSquares += Math.pow(returns[i] - averageRateOfReturn, 2);
        }

        const variance = sumOfSquares / returns.length - 1;

        return variance;
    }

    @Discard
    static calculateStandardDeviation(prices: ITickerPrice[]): number {

        const [returns, averageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            prices as unknown as IGenericPrice[]
        );

        const variance = this.calculateVariance(returns, averageRateOfReturn);

        const standardDeviation = Math.sqrt(variance);

        return standardDeviation;
    }

    @Discard
    static calculateSharpeRatio(
        tickerRateOfReturn: number,
        treasuryBondYield: number,
        tickerStandardDeviation: number
    ): number {

        const sharpeRatio = (tickerRateOfReturn - treasuryBondYield) / tickerStandardDeviation;

        return sharpeRatio;
    }

    @Discard
    static calculateAlpha(
        tickerRateOfReturn: number,
        benchmarkRateOfReturn: number,
        treasuryBondYield: number,
        beta: number
    ): number {

        /*
        NOTE: we do not express alhpa in decimals (therefore, no division by 100)
        we want to see immediate percentage value
        */
        return (
            (tickerRateOfReturn - treasuryBondYield) - beta * (benchmarkRateOfReturn - treasuryBondYield)
        );
    }

    @Discard
    private static calculateCorrelation(tickerReturns: number[], benchmarkReturns: number[]): number {

        const N = tickerReturns.length;

        let sumOfTickerReturns = 0, sumOfBenchmarkReturns = 0, sumOfMultipliedReturns = 0;

        let sumOfSquaredTickerReturns = 0, sumOfSquaredBenchmarkReturns = 0;

        /*
        We first loop through returns, sum both datasets against themselves,
        sum the products of multiplication between each ticker-benchmark return pair,
        and sum the squares of each instance within each dataset
        */
        for(let i = 0; i < N; i++){

            sumOfTickerReturns += tickerReturns[i];

            sumOfBenchmarkReturns += benchmarkReturns[i];

            sumOfMultipliedReturns += tickerReturns[i] * benchmarkReturns[i];

            sumOfSquaredTickerReturns += Math.pow(tickerReturns[i], 2);

            sumOfSquaredBenchmarkReturns += Math.pow(benchmarkReturns[i], 2);
        }

        /*
        We then calculate covariance between ticker-benchmark returns
        */
        const covariance = N * sumOfMultipliedReturns - sumOfTickerReturns * sumOfBenchmarkReturns;

        /*
        Then find standard deviation of returns
        */
        const standardDeviationOfTickerReturns =
            CalculatorHelperService.calculateStandardDeviationOverReturns(
                N,
                sumOfTickerReturns,
                sumOfSquaredTickerReturns
            );

        const standardDeviationOfBenchmarkReturns =
            CalculatorHelperService.calculateStandardDeviationOverReturns(
                N,
                sumOfBenchmarkReturns,
                sumOfSquaredBenchmarkReturns
            );

        /*
        Finally, we calculate correlation
        */
        const correlation = covariance / Math.sqrt(
            standardDeviationOfTickerReturns * standardDeviationOfBenchmarkReturns
        );

        return correlation;
    }

    @Discard
    static calculateRSquared(prices: ITickerPrice[], benchmarkPrices: IBenchmarkPrice[]): number {

        const [tickerReturns] = CalculatorHelperService.calculateAverageRateOfReturn(
            prices as unknown as IGenericPrice[]
        );

        const [benchmarkReturns] = CalculatorHelperService.calculateAverageRateOfReturn(
            benchmarkPrices as unknown as IGenericPrice[]
        );

        const correlation = this.calculateCorrelation(
            tickerReturns,
            benchmarkReturns
        );

        const rSquared = Math.pow(correlation, 2) * 100;

        return rSquared;
    }
}
