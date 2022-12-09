/*
Current Ratio denotes company’s capacity to meet it’s short-term obligations (debt),
where short-term obligations are debt due within 1 year period

Current Ratio = Current Assets / Current Liabilities

Quick Ratio similar to Current Ratio, but is more conservative. As a rule, lower than Current Ratio

Quick Ratio = Quick Assets / Current Liabilities

Quick Assets = Cash + Cash Equivalents + Marketable Securities + Net Receivables

NOTE:

API provides Cash and Cash Equivalents as cashAndEquivalents

API provides Marketable Securities as cashAndShortTermInvestments

****

On marketable securities: https://www.investopedia.com/terms/m/marketablesecurities.asp

On quick assets: https://www.investopedia.com/terms/q/quickratio.asp
*/

export class LiquidityCalculatorService {

    static calculateCurrentRatio(currentAssets: number, currentLiabilities: number): number {

        return currentAssets / currentLiabilities;
    }

    static calculateQuickRatio(
        cashAndEquivalents: number,
        cashAndShortTermInvestments: number,
        accountReceivable: number,
        currentLiabilities: number
    ): number {

        return (cashAndEquivalents + cashAndShortTermInvestments + accountReceivable) / currentLiabilities;
    }
}
