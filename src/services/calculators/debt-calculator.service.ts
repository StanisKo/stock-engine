import { Discard } from '../../utils/discard.decorator';

/*
Debt to Equity measures the relationship between the amount of capital that has been borrowed (debt),
and the amount of capital contributed by shareholders (equity)
Displays company’s ability to service it’s long-term debt obligations
The lower the number, the better

Interest Coverage measures how easily a company can pay interest on its outstanding debt
It represents how many (typically the number of quarters or fiscal years)
times the company can pay its obligations using its earnings
The higher the number, the better

****

On Debt to Equity: https://www.investopedia.com/terms/d/debtequityratio.asp

On Interest Coverage: https://www.investopedia.com/terms/i/interestcoverageratio.asp
*/

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
