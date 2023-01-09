import { StockParserService } from './stock-parser.service';

import { EfficiencyCalculatorService } from '../calculators/efficiency-calculator.service';

export const parseEfficiency = (storage: StockParserService): void => {

    /*
    Asset Turnover is always missing
    */
    storage.stockProfile.efficiency.assetTurnover = EfficiencyCalculatorService.calculateAssetTurnover(
        Number(storage.lastAnnualIncomeStatement.totalRevenue),
        Number(storage.lastAnnualBalanceSheet.totalAssets)
    );

    /*
    Inventory Turnover is always missing
    */
    storage.stockProfile.efficiency.inventoryTurnover = EfficiencyCalculatorService.calculateInventoryTurnover(
        Number(storage.lastAnnualIncomeStatement.costOfRevenue),
        Number(storage.lastAnnualBalanceSheet.inventory)
    );
};
