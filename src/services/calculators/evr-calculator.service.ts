/*
EV/R = (Market Cap + Debt - CC) / Revenue

Debt = Short-Term Debt + Long-Term Debt

CC = Cash + Cash (And) Equivalents

NOTE: API provides Debt as shortLongTermDebtTotal

****

On EV/R: https://www.investopedia.com/terms/e/ev-revenue-multiple.asp
*/

export class EVRCalculatorService {

    static calculateEVR(
        marketCap: number,
        debt: number,
        cash: number,
        cashAndEquivalents: number,
        revenue: number
    ): number {

        return (marketCap + debt - cash - cashAndEquivalents) / revenue;
    }
}
