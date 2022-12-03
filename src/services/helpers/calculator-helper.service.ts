export class CalculatorHelperService {

    static calculateRateOfReturn(endingPrice: number, startingPrice: number): number {

        return ((endingPrice - startingPrice) / startingPrice) * 100;
    }
}
