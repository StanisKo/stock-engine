/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { CategoryProcessorService } from './category-processor.service';

export class LiquidityProcessorService extends CategoryProcessorService {

    static category = 'liquidity';

    static targets = {

        currentRatio: '>',

        quickRatio: '>'
    };

    static margins = {

        currentRatio: (value: number) => value > 0,

        quickRatio: (value: number) => value > 0
    };
}
