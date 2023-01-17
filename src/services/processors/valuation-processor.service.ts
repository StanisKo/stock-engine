/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { RatiosProcessorService } from './ratios-processor.service';

export class ValuationProcessorService extends RatiosProcessorService {

    static category = 'valuation';

    static targets = {

        priceToEarnings: '<',

        priceToEarningsGrowth: '<',

        priceToSales: '<',

        priceToBook: '<',

        enterpriseValueToRevenue: '<',

        enterpriseValueToEbitda: '<',

        priceToFreeCashFlow: '<'
    };

    static margins = {

        priceToEarningsGrowth: (value: number) => value < 1,

        priceToBook: (value: number) => value < 1,

        enterpriseValueToRevenue: (value: number) => value > 1 && value < 3,

        enterpriseValueToEbitda: (value: number) => value < 10,

        priceToFreeCashFlow: (value: number) => value < 5
    };
}
