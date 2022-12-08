/*
Alpha — measures excess returns/losses against the return of the index

Alpha = (R – Rf) – Beta * (Rm - Rf)

R = Ticker Rate of Return

Rf = Risk-Free Rate of Return

Beta = Systematic Risk of a Ticker

Rm = Benchmark Rate of Return

****

On Alpha: https://www.investopedia.com/terms/a/alpha.asp

****

GOAL:

Find investments that outperform the market
We're looking for HIGHEST Alpha since we need stocks that perform better than index (market)

Alpha Ranges:
    * > 0: Outperforms the index
    * < 0: Underperforms the index.
*/

export class AlphaCalculatorService {

    static calculateAlpha(
        tickerRateOfReturn: number,
        benchmarkRateOfReturn: number,
        treasuryBondYield: number,
        beta: number
    ): number {

        console.log('Calculated Alpha');

        /*
        NOTE: we do not express alhpa in decimals (therefore, no division by 100)
        we want to see immediate percentage value
        */
        return (
            (tickerRateOfReturn - treasuryBondYield) - beta * (benchmarkRateOfReturn - treasuryBondYield)
        );
    }
}
