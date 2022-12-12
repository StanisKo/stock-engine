/*

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
