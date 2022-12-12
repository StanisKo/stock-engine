/*

Debt to Equity Measures the relationship between the amount of capital that has been borrowed (debt),
and the amount of capital contributed by shareholders (equity)
Displays company’s ability to service it’s long-term debt obligations. The lower the number, the better

Interest Coverage

****

On Debt to Equity: https://www.investopedia.com/terms/d/debtequityratio.asp

On Interest Coverage: https://www.investopedia.com/terms/i/interestcoverageratio.asp
*/

export class DebtCalculatorService {

    static calculateDebtToEquity(totalLiabilities: number, totalStockholderEquity: number): number {

        return totalLiabilities / totalStockholderEquity;
    }

    static calculateInterestCoverage(ebit: number, interestExpense: number): number {

        return ebit / interestExpense;
    }
}
