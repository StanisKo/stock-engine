/*
Alpha — measures excess returns/losses against the return of the index
Expressed in a decimal (0.N) that is a percentage of over or under performance

Alpha = (R – Rf) – beta * (Rm - Rf)

R represents ticker rate of return

Rf represents risk-free rate of return

Beta represents the systematic risk of a ticker

Rm represents benchmark rate of return

On Alpha: https://www.investopedia.com/terms/a/alpha.asp

****

GOAL:

Find investments that outperform the market
We're looking for HIGHEST Alpha since we need stocks that perform better than index (market)
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
