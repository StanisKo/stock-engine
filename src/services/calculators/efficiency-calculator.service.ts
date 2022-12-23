/*
Asset Turnover = Total Annual Sales / Average Total Assets

NOTE: API provides Total Annual Sales as totalRevenue

****

On Asset Turnover: https://www.investopedia.com/terms/a/assetturnover.asp
*/

export class EfficiencyCalculatorService {

    static calculateAssetTurnover(sales: number, averageTotalAssets: number): number {

        return sales / averageTotalAssets;
    }
}
