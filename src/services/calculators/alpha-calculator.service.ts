/*
Alpha = (R – Rf) – beta * (Rm - Rf)

R represents ticker rate of return

Rf represents risk-free rate of return

Beta represents the systematic risk of a portfolio

Rm represents benchmark rate of return

On Alpha: https://www.investopedia.com/terms/a/alpha.asp
*/

export class AlphaCalculatorService {

    static calculateAlpha(
        tickerRateOfReturn: number,
        benchmarkRateOfReturn: number,
        treasuryBondYield: number,
        beta: number
    ): number {

        /*
        Alpha is always expressed in decimals, therefore we divide the result by 100
        */
        return (
            (tickerRateOfReturn - treasuryBondYield) - beta * (benchmarkRateOfReturn - treasuryBondYield)
        ) / 100;
    }
}
