import { Discard } from '../../utils/discard.decorator';

import { ITickerPrice, IGenericPrice } from '../../interfaces/ticker.interface';

import { CalculatorHelperService } from '../helpers/calculator-helper.service';

/*
SD = SQRT(V)

V = SUM(RoR - ARoR) ^ 2 / N(RoR) - 1

RoR = (P2 - P1) / P1 * 100 where P2 is Nth price and P1 is previous

ARoR = SUM(RoR) / N(RoR) where N is count of datapoints we have

****

Sharpe Ratio = (Ticker RoR - Risk-Free RoR) / Ticker SD

RoR = Rate of Return

SD = Standard Deviation

NOTE: Our Risk-Free Rate of Return is US 1 Year Treasury Bond Yield

****

Alpha — measures excess returns/losses against the return of the index

Alpha = (R – Rf) – Beta * (Rm - Rf)

R = Ticker Rate of Return

Rf = Risk-Free Rate of Return

Beta = Systematic Risk of a Ticker

Rm = Benchmark Rate of Return

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
*/

export class RiskCalculatorService {

    @Discard
    public static calculateStandardDeviation(prices: ITickerPrice[]): number {

        /*
        NOTE: we do not calculate returns and ARoR during inputs construction,
        since for SD we need returns and ARoR over prices since IPO, yet,
        in other cases -- over TTM prices
        */
        const [returns, averageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            prices as unknown as IGenericPrice[]
        );

        const variance = CalculatorHelperService.calculateVariance(returns, averageRateOfReturn);

        const standardDeviation = Math.sqrt(variance);

        return standardDeviation;
    }

    @Discard
    public static calculateSharpeRatio(
        tickerRateOfReturn: number, treasuryBondYield: number, tickerStandardDeviation: number): number {

        const sharpeRatio = (tickerRateOfReturn - treasuryBondYield) / tickerStandardDeviation;

        return sharpeRatio;
    }

    @Discard
    public static calculateAlpha(
        tickerRateOfReturn: number, benchmarkRateOfReturn: number, treasuryBondYield: number, beta: number): number {

        /*
        NOTE: we do not express alhpa in decimals (therefore, no division by 100)
        we want to see immediate percentage value
        */
        return (
            (tickerRateOfReturn - treasuryBondYield) - beta * (benchmarkRateOfReturn - treasuryBondYield)
        );
    }

    private static calculateCorrelation(tickerReturns: number[], benchmarkReturns: number[]): number {

        /*
        Get the covariance, sum of returns, and sum of squared returns
        */
        const {
            covariance,
            sumOfTickerReturns,
            sumOfSquaredTickerReturns,
            sumOfBenchmarkReturns,
            sumOfSquaredBenchmarkReturns
        } = CalculatorHelperService.calculateCovariance(tickerReturns, benchmarkReturns);

        /*
        Then find standard deviation of returns
        */
        const standardDeviationOfTickerReturns =
            CalculatorHelperService.calculateStandardDeviationOverReturns(
                tickerReturns.length,
                sumOfTickerReturns,
                sumOfSquaredTickerReturns
            );

        const standardDeviationOfBenchmarkReturns =
            CalculatorHelperService.calculateStandardDeviationOverReturns(
                benchmarkReturns.length,
                sumOfBenchmarkReturns,
                sumOfSquaredBenchmarkReturns
            );

        /*
        Finally, calculate correlation
        */
        const correlation = covariance / Math.sqrt(
            standardDeviationOfTickerReturns * standardDeviationOfBenchmarkReturns
        );

        return correlation;
    }

    @Discard
    public static calculateRSquared(tickerTTMReturns: number[], benchmarkTTMReturns: number[]): number {

        const correlation = this.calculateCorrelation(
            tickerTTMReturns,
            benchmarkTTMReturns
        );

        const rSquared = Math.pow(correlation, 2) * 100;

        return rSquared;
    }
}
