/*
EV/R = (Market Cap + Debt - CC) / Revenue

CC = Cash + Cash Equivalents (a.k.a., Cash And Equivalents)

Debt = Short-Term Debt + Long-Term Debt

NOTE: API provides Debt as shortLongTermDebtTotal

****

On EV/R: https://www.investopedia.com/terms/e/ev-revenue-multiple.asp
*/

export class EVRCalculatorService {

    static calculateEnterpriseValueToRevenue(
        marketCap: number,
        debt: number,
        cash: number,
        cashAndEquivalents: number,
        revenue: number
    ): number {

        return (marketCap + debt - cash - cashAndEquivalents) / revenue;
    }
}
