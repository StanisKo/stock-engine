import { Discard } from '../../utils/discard.decorator';

/*
Current Ratio = Current Assets / Current Liabilities

Quick Ratio = Quick Assets / Current Liabilities

Quick Assets = Cash + Cash Equivalents + Marketable Securities + Net Receivables
*/

export class LiquidityCalculatorService {

    @Discard
    public static calculateCurrentRatio(currentAssets: number, currentLiabilities: number): number {

        return currentAssets / currentLiabilities;
    }

    @Discard
    public static calculateQuickRatio(
        cash: number,
        cashAndEquivalents: number,
        shortTermInvestments: number, netReceivables: number, currentLiabilities: number): number {

        return (cash + cashAndEquivalents + shortTermInvestments + netReceivables) / currentLiabilities;
    }
}
