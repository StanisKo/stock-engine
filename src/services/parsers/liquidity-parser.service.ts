import { StockParserService } from './stock-parser.service';

import { LiquidityCalculatorService } from '../calculators/liquidity-calculator.service';

export const parseLiquidity = (storage: StockParserService): void => {

    /*
    Current Ratio is always missing
    */
    storage.stockProfile.liquidity.currentRatio = LiquidityCalculatorService.calculateCurrentRatio(
        Number(storage.lastAnnualBalanceSheet.totalCurrentAssets),
        Number(storage.lastAnnualBalanceSheet.totalCurrentLiabilities)
    );

    /*
    Quick Ratio is always missing
    */
    storage.stockProfile.liquidity.quickRatio = LiquidityCalculatorService.calculateQuickRatio(
        Number(storage.lastAnnualBalanceSheet.cash),
        Number(storage.lastAnnualBalanceSheet.cashAndEquivalents),
        Number(storage.lastAnnualBalanceSheet.shortTermInvestments),
        Number(storage.lastAnnualBalanceSheet.netReceivables),
        Number(storage.lastAnnualBalanceSheet.totalCurrentLiabilities)
    );
};
