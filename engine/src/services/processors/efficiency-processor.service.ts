/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { CategoryProcessorService } from './category-processor.service';

export class EfficiencyProcessorService extends CategoryProcessorService {

    static category = 'efficiency';

    static targets = {

        assetTurnover: '>',

        inventoryTurnover: '>'
    };

    static margins = {

        assetTurnover: (value: number) => value > 0,

        /*
        NOTE: the margin on inventory turnover is more or equal zero,
        since we do not want to discard stocks that simply don't have inventory
        (e.g., software, bio research, services, etc.)
        */
        inventoryTurnover: (value: number) => value >= 0
    };
}
