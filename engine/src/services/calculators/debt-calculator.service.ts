import { Discard } from '../../utils/discard.decorator';

export class DebtCalculatorService {

    @Discard
    public static calculateDebtToEquity(totalLiabilities: number, totalStockholderEquity: number): number {

        return totalLiabilities / totalStockholderEquity;
    }

    @Discard
    public static calculateInterestCoverage(ebit: number, interestExpense: number): number {

        return ebit / interestExpense;
    }
}
