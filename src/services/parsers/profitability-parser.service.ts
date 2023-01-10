import { StockParserService } from './stock-parser.service';

import { ProfitabilityCalculatorService } from '../calculators/profitability-calculator.service';

export const parseProfitability = (storage: StockParserService): void => {

    storage.stockProfile.profitability.returnOnAssets =
        storage.fundamentals.Highlights.ReturnOnAssetsTTM ?? ProfitabilityCalculatorService.calculateReturnOnAssets(
            Number(storage.lastAnnualIncomeStatement.netIncome),
            Number(storage.lastAnnualBalanceSheet.totalAssets)
        );

    storage.stockProfile.profitability.returnOnEquity =
        storage.fundamentals.Highlights.ReturnOnEquityTTM ?? ProfitabilityCalculatorService.calculateReturnOnEquity(
            Number(storage.lastAnnualIncomeStatement.netIncome),
            Number(storage.lastAnnualBalanceSheet.totalStockholderEquity)
        );

    storage.stockProfile.profitability.profitMargin = storage.fundamentals.Highlights.ProfitMargin;
};
