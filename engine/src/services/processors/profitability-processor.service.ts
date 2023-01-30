/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { CategoryProcessorService } from './category-processor.service';

export class ProfitabilityProcessorService extends CategoryProcessorService {

    static category = 'profitability';

    static targets = {

        returnOnAssets: '>',

        returnOnEquity: '>',

        profitMargin: '>'
    };

    static margins = {

        returnOnAssets: (value: number) => value > 0,

        returnOnEquity: (value: number) => value > 0,

        profitMargin: (value: number) => value > 0
    };
}
