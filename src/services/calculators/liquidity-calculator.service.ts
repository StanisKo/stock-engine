import { discard } from '../../utils/discard.decorator';

/*
Current Ratio denotes company’s capacity to meet it’s short-term obligations (debt),
where short-term obligations are debt due within 1 year period

Current Ratio = Current Assets / Current Liabilities

Quick Ratio similar to Current Ratio, but is more conservative. As a rule, lower than Current Ratio

Quick Ratio = Quick Assets / Current Liabilities

Quick Assets = Cash + Cash Equivalents + Marketable Securities + Net Receivables

****

On Current Ratio: https://www.investopedia.com/terms/c/currentratio.asp

On Quick Ratio: https://www.investopedia.com/terms/q/quickratio.asp

On Marketable Securities: https://www.investopedia.com/terms/m/marketablesecurities.asp

On Quick Assets: https://www.investopedia.com/terms/q/quickratio.asp
*/

export class LiquidityCalculatorService {

    @discard
    static calculateCurrentRatio(currentAssets: number, currentLiabilities: number): number {

        return currentAssets / currentLiabilities;
    }

    @discard
    static calculateQuickRatio(
        cash: number,
        cashAndEquivalents: number,
        shortTermInvestments: number,
        netReceivables: number,
        currentLiabilities: number
    ): number {

        return (cash + cashAndEquivalents + shortTermInvestments + netReceivables) / currentLiabilities;
    }
}
