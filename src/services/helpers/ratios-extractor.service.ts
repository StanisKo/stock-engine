import { IStockProfile } from '../../interfaces/stock-profile.interface';

export class RatiosExtractorService {

    ratios: { [key: string]: number[] };

    constructor() {

        this.ratios = {};
    }

    public extractRatiosFromProfiles(profiles: IStockProfile[]): void {

        for (let i = 0; i < profiles.length; i++) {


        }
    }
}
