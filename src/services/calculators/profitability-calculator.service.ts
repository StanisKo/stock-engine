import { Discard } from '../../utils/discard.decorator';

export class ProfitabilityCalculatorService {

    @Discard
    public static calculateReturnOnAssets(netIncome: number, totalAssets: number): number {

        return netIncome / totalAssets;
    }
}
