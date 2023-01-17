/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { RatiosProcessorService } from './ratios-processor.service';

export class RiskProcessorService extends RatiosProcessorService {

    static category = 'risk';

    static targets = {

        standardDeviation: '>',

        sharpeRatio: '>',

        beta: '>',

        alpha: '>',

        rSquared: '<'
    };

    static margins = {

        sharpeRatio: (value: number) => value > 1,

        beta: (value: number) => value > 1,

        alpha: (value: number) => value > 0,

        rSquared: (value: number) => value < 70
    };
}
