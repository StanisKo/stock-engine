/*
CAGR = ( [ (Ending Price / Starting Price) ^ (1 / N of years to look back) ] - 1) * 100

On CAGR: https://www.investopedia.com/terms/c/cagr.asp
*/

export class CAGRCalculatorService {

    static calculateCAGR(endingPrice: number, startingPrice: number): number {

        /*
        Since we're calculating CAGR over TTM (1 year), we don't need to bring
        the division product to exponent of 1 / N of years:

        Math.pow((this.endingPrice / this.startingPrice), 1 / N of years) - 1

        We can simply:

        ((this.endingPrice / this.startingPrice) - 1) * 100

        Is kept here for the sake of potentially adjusting ranges in the future
        */
        const cagr = (
            ((endingPrice / startingPrice) - 1)
        ) * 100;

        console.log('Calculated CAGR');

        return cagr;
    }
}
