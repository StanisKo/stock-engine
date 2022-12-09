/*
Current Ratio = Current Assets / Current Liabilities
*/

export class LiquidityCalculatorService {

    static calculateCurrentRatio(currentAssets: number, currentLiabilities: number): number {

        return currentAssets / currentLiabilities;
    }
}
