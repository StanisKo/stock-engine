export class DebtCalculatorService {

    static calculateDebtToEquity(totalLiabilities: number, totalStockholderEquity: number): number {

        return totalLiabilities / totalStockholderEquity;
    }

    static calculateInterestCoverage(ebitda: number, interestExpense: number): number {

        return ebitda / interestExpense;
    }
}
