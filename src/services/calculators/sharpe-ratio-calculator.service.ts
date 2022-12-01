export class SharpeRatioCalculatorService {

    cagr: number;

    standardDeviation: number;

    constructor(cagr: number, standardDeviation: number) {

        this.cagr = cagr;

        this.standardDeviation = standardDeviation;
    }

    public calculateSharpeRatio(): number {

        console.log('Calculated Sharpe Ratio');

        return 0;
    }

}
