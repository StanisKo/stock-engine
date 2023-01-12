import { keys } from 'ts-transformer-keys';

import { IStockProfile } from '../../interfaces/stock-profile.interface';

export class RatiosExtractorService {

    ratios: (keyof IStockProfile)[];

    public extractRatiosFromProfiles(): { [key: string]: number } {

        const ratios = keys<IStockProfile>();

        console.log(ratios);

        return { 'foo': 1 };
    }
}
