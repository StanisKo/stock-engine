/*
As our risk-free investment benchmark we take US 10 years Treasury Bond yield

On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

export class SharpeRatioCalculatorService {

    treasuryBondYield: number;

    cagr: number;

    standardDeviation: number;

    constructor(treasuryBondYield: number, cagr: number, standardDeviation: number) {

        this.treasuryBondYield = treasuryBondYield;

        this.cagr = cagr;

        this.standardDeviation = standardDeviation;
    }

    public calculateSharpeRatio(): number {

        console.log('Calculated Sharpe Ratio');

        /*
        Measure against ^GSPC, S&P 500 index
        */

        const sharpeRatio = (this.cagr - this.treasuryBondYield) / this.standardDeviation;

        return sharpeRatio;
    }

}
