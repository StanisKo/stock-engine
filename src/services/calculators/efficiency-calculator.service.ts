/*
Asset Turnover = Total Annual Sales / Average Total Assets

Inventory Turnover: COGS / Average Value of Inventory

COGS = Cost of Goods Sold

NOTE: API provides Total Annual Sales as totalRevenue, COGS as costOfRevenue

****

On Asset Turnover: https://www.investopedia.com/terms/a/assetturnover.asp

On Inventory Turnover: https://www.investopedia.com/terms/i/inventoryturnover.asp
*/

export class EfficiencyCalculatorService {

    static calculateAssetTurnover(sales: number, averageTotalAssets: number): number {

        return sales / averageTotalAssets;
    }

    static calculateInventoryTurnover(costOfGoodsSold: number, averageValueOfInventory: number): number {

        return costOfGoodsSold / averageValueOfInventory;
    }
}
