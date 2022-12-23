export class EfficiencyCalculatorService {

    static calculateAssetTurnover(sales: number, averageTotalAssets: number): number {

        return sales / averageTotalAssets;
    }
}
