/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { CategoryProcessorService } from './category-processor.service';

export class ValuationProcessorService extends CategoryProcessorService {

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

    /*
    NOTE: we score profiles with negative values as 0, since almost in all of those cases
    if the ratio is in negative territory, company is either:
    losing money, not making earnings, has more total liabilities than assets,
    or burning liquidity (free cash flow), etc.
    */
    static margins = {

        priceToEarnings: (value: number) => value > 0 && value < 1,

        priceToEarningsGrowth: (value: number) => value > 0 && value < 1,

        priceToBook: (value: number) => value > 0 && value < 1,

        enterpriseValueToRevenue: (value: number) => value > 1 && value < 3,

        enterpriseValueToEbitda: (value: number) => value > 0 && value < 10,

        priceToFreeCashFlow: (value: number) => value > 0 && value < 5
    };
}
