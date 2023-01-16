import { IIndexableStockProfile } from './stock-profile.interface';

export interface IProcessor {

    processRatios(profile: IIndexableStockProfile): number;
}
