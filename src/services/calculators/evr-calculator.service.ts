/*
EV/R = (Market Cap + Debt - CC) / Revenue

Debt = Short-Term Debt + Long-Term Debt

NOTE: API provides Debt as shortLongTermDebtTotal
*/

export class EVRCalculatorService {

    static calculateEnterpriseValueToRevenue(
        marketCap: number,
        debt: number,
        cashAndEquivalents: number,
        revenue: number
    ): number {

        console.log((marketCap + debt - cashAndEquivalents) / revenue);

        return (marketCap + debt - cashAndEquivalents) / revenue;
    }
}
