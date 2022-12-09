/*
Current Ratio denotes company’s capacity to meet it’s short-term obligations (debt),
where short-term obligations are debt due within 1 year period

Current Ratio = Current Assets / Current Liabilities

Quick Ratio similar to Current Ratio, but is more conservative. As a rule, lower than Current Ratio

Quick Ratio = (Cash & Equivalents + Marketable Securities + Account Receivable) / Current Liabilities
*/

export class LiquidityCalculatorService {

    static calculateCurrentRatio(currentAssets: number, currentLiabilities: number): number {

        return currentAssets / currentLiabilities;
    }

    static calculateQuickRatio(
        cashAndEquivalents: number,
        marketableSecurities: number,
        accountReceivable: number,
        currentLiabilities: number
    ): number {

        return (cashAndEquivalents + marketableSecurities + accountReceivable) / currentLiabilities;
    }
}
