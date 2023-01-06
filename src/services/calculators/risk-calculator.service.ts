import { Discard } from '../../utils/discard.decorator';

import { ITickerPrice, IBenchmarkPrice, IGenericPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

/*
Standard deviation — indicates how much the current return is deviating from its expected historical normal returns
The higher standard deviation, the greater possible outcomes, both negative and positive.

SD = SQRT(V)

V = SUM(RoR - ARoR) ^ 2 / N(RoR) - 1

RoR = (P2 - P1) / P1 * 100 where P2 is Nth price and P1 is previous

ARoR = SUM(RoR) / N(RoR) where N is count of datapoints we have

On Standard Deviation: https://www.investopedia.com/terms/s/standarddeviation.asp

****

Sharpe Ratio — measures rate of return on the asset above risk-free investment,
such as treasury bonds or cash

In other words, measures whether the risk is justified against investing into risk-free assets

Sharpe Ratio = (Ticker RoR - Risk-Free RoR) / Ticker SD

RoR = Rate of Return

SD = Standard Deviation

NOTE: Our Risk-Free Rate of Return is US 1 Year Treasury Bond Yield

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp

****

Alpha — measures excess returns/losses against the return of the index

Alpha = (R – Rf) – Beta * (Rm - Rf)

R = Ticker Rate of Return

Rf = Risk-Free Rate of Return

Beta = Systematic Risk of a Ticker

Rm = Benchmark Rate of Return

On Alpha: https://www.investopedia.com/terms/a/alpha.asp

****

R-Squared — measures how much the movement of the assets is influenced by the movement of the index.
Ranges from 0 to 100.

NOTE: We're using correlation-based formula to calculate r-squared:

R-Squared = r^2

TR = Ticker Returns

BR = Benchmark Returns

SD = Standard Deviation

r (Correlation) = Covariance(TR, TB) / SD of TR * SD of BR

Covariance = N * SUM(TR * BR) - SUM(TR) * SUM(BR)

N = Dataset Size

On R-Squared: https://www.investopedia.com/terms/r/r-squared.asp

On Correlation: https://www.investopedia.com/terms/c/correlationcoefficient.asp

On Covariance: https://www.investopedia.com/terms/c/covariance.asp
*/

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
    public static calculateStandardDeviation(prices: ITickerPrice[]): number {

        const [returns, averageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            prices as unknown as IGenericPrice[]
        );

        const variance = this.calculateVariance(returns, averageRateOfReturn);

        const standardDeviation = Math.sqrt(variance);

        return standardDeviation;
    }

    @Discard
    public static calculateSharpeRatio(
        tickerRateOfReturn: number,
        treasuryBondYield: number,
        tickerStandardDeviation: number
    ): number {

        const sharpeRatio = (tickerRateOfReturn - treasuryBondYield) / tickerStandardDeviation;

        return sharpeRatio;
    }

    @Discard
    public static calculateAlpha(
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
    public static calculateRSquared(prices: ITickerPrice[], benchmarkPrices: IBenchmarkPrice[]): number {

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
