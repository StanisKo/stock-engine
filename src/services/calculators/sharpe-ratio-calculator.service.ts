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
        TODO: Measure against ^GSPC, S&P 500 index

        https://opendata.stackexchange.com/questions/18081/free-rest-api-for-daily-end-of-day-sp-500-index

        https://www.npmjs.com/package/yahoo-finance for docs

        https://www.npmjs.com/package/yahoo-finance2

        NOTE: if you can get prices from here, use this, instead of historical eod to save on api

        Here, get sp500 prices for last year, calc avg return, use in sharpe ratio
        */

        const sharpeRatio = (this.cagr - this.treasuryBondYield) / this.standardDeviation;

        return sharpeRatio;
    }

}
