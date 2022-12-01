/*
On Sharpe Ratio: https://www.investopedia.com/terms/s/sharperatio.asp
*/

export class SharpeRatioCalculatorService {

    cagr: number;

    standardDeviation: number;

    constructor(cagr: number, standardDeviation: number) {

        this.cagr = cagr;

        this.standardDeviation = standardDeviation;
    }

    public calculateSharpeRatio(): number {

        console.log('Calculated Sharpe Ratio');

        /*
        This has to factor in risk-free return: US treasury bond
        */
        return this.cagr / this.standardDeviation;
    }

}
