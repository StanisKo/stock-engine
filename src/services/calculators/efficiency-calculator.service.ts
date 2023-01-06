import { Discard } from '../../utils/discard.decorator';

/*
Asset Turnover = Total Annual Sales / Average Total Assets

Inventory Turnover = COGS / Average Value of Inventory

COGS = Cost of Goods Sold

NOTE: API provides Total Annual Sales as totalRevenue, COGS as costOfRevenue

****

On Asset Turnover: https://www.investopedia.com/terms/a/assetturnover.asp

On Inventory Turnover: https://www.investopedia.com/terms/i/inventoryturnover.asp
*/

export class EfficiencyCalculatorService {

    @Discard
    public static calculateAssetTurnover(sales: number, averageTotalAssets: number): number {

        return sales / averageTotalAssets;
    }

    @Discard
    public static calculateInventoryTurnover(costOfGoodsSold: number, averageValueOfInventory: number): number {

        /*
        If we're looking at a service company that does not have inventory, we return 0

        This would not influence scoring, since such profile is compared with other profiles
        in the same industry -- stocks that also do not have inventory
        */
        if (!averageValueOfInventory) {

            return 0;
        }

        return costOfGoodsSold / averageValueOfInventory;
    }
}
