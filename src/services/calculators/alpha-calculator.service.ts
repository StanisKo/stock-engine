/*
Alpha = R – Rf – beta (Rm-Rf)

R represents the portfolio return

Rf represents the risk-free rate of return

Beta represents the systematic risk of a portfolio

Rm represents the benchmark return

On Alpha: https://www.investopedia.com/terms/a/alpha.asp
*/

export class AlphaCalculatorService {

    static calculateAlpha(tickerCagr: number, benchmarkCagr: number): number {

        return tickerCagr - benchmarkCagr;
    }
}
