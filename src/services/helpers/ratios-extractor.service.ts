import { IStockProfile, IIndexableStockProfile } from '../../interfaces/stock-profile.interface';

export class RatiosExtractorService {

    public ratios: { [key: string]: number[] };

    private categories: string[];

    constructor() {

        this.ratios = {};

        this.categories = [
            'risk', 'valuation', 'profitability', 'liquidity', 'debt', 'efficiency'
        ];
    }

    public extractRatiosFromProfiles(profiles: IStockProfile[]): void {

        for (let i = 0; i < profiles.length; i++) {

            const profile = profiles[i] as IIndexableStockProfile;

            const keysOfCurrentlyIteratedProfile = Object.keys(profile);

            for (let j = 0; j < keysOfCurrentlyIteratedProfile.length; j++) {

                /*
                Handle CAGR explicitly
                */
                const key = keysOfCurrentlyIteratedProfile[j];

                if (key === 'cagr') {

                    if (!this.ratios[key]) {

                        this.ratios[key] = [profile[key]];
                    }
                    else {

                        this.ratios[key].push(profile[key]);
                    }
                }

                /*
                Skip key if it's non-data related (or dividends, since we don't process them yet)
                */
                if (!this.categories.includes(key)) {

                    continue;
                }

                /*
                Otherwise, traverse and extract
                */
                const ratiosWithinCurrentlyIteratedCategory = Object.keys(profile[key]);

                for (let k = 0; k < ratiosWithinCurrentlyIteratedCategory.length; k++) {

                    const ratioKey = ratiosWithinCurrentlyIteratedCategory[k];

                    const ratio = profile[key][ratioKey];

                    if (!this.ratios[key]) {

                        this.ratios[key] = [ratio];
                    }
                    else {

                        this.ratios[key].push(ratio);
                    }
                }
            }

        }
    }
}
