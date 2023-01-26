/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { CategoryProcessorService } from './category-processor.service';

export class DebtProcessorService extends CategoryProcessorService {

    static category = 'debt';

    static targets = {

        debtToEquity: '<',

        interestCoverage: '>'
    };

    static margins = {

        debtToEquity: (value: number) => value > 0,

        interestCoverage: (value: number) => value > 1
    };
}
