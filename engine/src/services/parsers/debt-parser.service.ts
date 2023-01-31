import { StockParserService } from './stock-parser.service';

import { DebtCalculatorService } from '../calculators/debt-calculator.service';

export const parseDebt = (storage: StockParserService): void => {

    /*
    Debt to Equity Ratio is always missing
    */
    storage.stockProfile.debt.debtToEquity = DebtCalculatorService.calculateDebtToEquity(
        Number(storage.lastAnnualBalanceSheet.totalLiab),
        Number(storage.lastAnnualBalanceSheet.totalStockholderEquity)
    );

    /*
    Interest Coverage is always missing
    */
    storage.stockProfile.debt.interestCoverage = DebtCalculatorService.calculateInterestCoverage(
        Number(storage.lastAnnualIncomeStatement.ebit),
        Number(storage.lastAnnualIncomeStatement.interestExpense)
    );
};
