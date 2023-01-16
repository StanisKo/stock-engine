import { IStockProfile } from '../../interfaces/stock-profile.interface';

import { CategoryProcessorService } from './category-processor.service';

import { mergeSort } from '../../algos/merge-sort.algo';

export class RiskProcessorService extends CategoryProcessorService {

    private static key = 'risk';

    /*
    Each sub-class must implement mountable logic that is applied to it's ratios
    */
    public static processRatios(profile: IStockProfile): void {

        const ratiosToProcess = Object.keys(profile[this.key as keyof IStockProfile]);

        for (let i = 0 ; i < ratiosToProcess.length; i++) {

            
        }
    }
}
