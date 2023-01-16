import { CategoryProcessorService } from './category-processor.service';

export class RiskProcessorService extends CategoryProcessorService {

    /*
    Each sub-class must implement mountable logic that is applied to it's ratios
    */
    public static processRatios(): void {

        console.log(1);
    }
}
