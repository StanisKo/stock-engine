import { Discard } from '../../utils/discard.decorator';

/*
CAGR = ( [ (Ending Price / Starting Price) ^ (1 / N of years to look back) ] - 1) * 100
*/

export class CAGRCalculatorService {

    @Discard
    public static calculateCAGR(startingPrice: number, endingPrice: number): number {

        /*
        NOTE: we're calculating CAGR over TTM (1 year), we don't need to bring
        the division product to exponent of 1 / N of years:

        Math.pow((this.endingPrice / this.startingPrice), 1 / N of years) - 1

        We can simply:

        ((this.endingPrice / this.startingPrice) - 1) * 100

        In fact, we could've used normal Rate of Return calculation, yet,
        we're keeping it here in case we'd like to adjust the timeframe in the future
        (06-12-2022)
        */
        const cagr = (
            ((endingPrice / startingPrice) - 1)
        ) * 100;

        return cagr;
    }
}
