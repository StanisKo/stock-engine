import { Discard } from '../../utils/discard.decorator';

export class ProfitabilityCalculatorService {

    @Discard
    public static calculateReturnOnAssets(netIncome: number, totalAssets: number): number {

        return netIncome / totalAssets;
    }

    @Discard
    public static calculateReturnOnEquity(
        netIncome: number, startingShareholderEquity: number, endingShareholderEquity: number): number {

        const averageShareholderEquity = (startingShareholderEquity + endingShareholderEquity) / 2;

        return netIncome / averageShareholderEquity;
    }

    @Discard
    public static calculateProfitMargin(netSales: number, netProfit: number): number {

        return netSales / netProfit;
    }
}
