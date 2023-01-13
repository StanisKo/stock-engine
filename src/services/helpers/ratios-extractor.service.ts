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

                const categoryKey = keysOfCurrentlyIteratedProfile[j];

                /*
                Skip key if it's non-data related (or dividends, since we don't process them yet)
                */
                if (!this.categories.includes(categoryKey)) {

                    continue;
                }

                /*
                Handle CAGR explicitly
                */
                if (categoryKey === 'cagr') {

                    if (!this.ratios[categoryKey]) {

                        this.ratios[categoryKey] = [profile[categoryKey]];
                    }
                    else {

                        this.ratios[categoryKey].push(profile[categoryKey]);
                    }
                }

                /*
                Otherwise, traverse and extract
                */
                const ratiosWithinCurrentlyIteratedCategory = Object.keys(profile[categoryKey]);

                for (let k = 0; k < ratiosWithinCurrentlyIteratedCategory.length; k++) {

                    const ratioKey = ratiosWithinCurrentlyIteratedCategory[k];

                    const ratio = profile[categoryKey][ratioKey];

                    if (!this.ratios[ratioKey]) {

                        this.ratios[ratioKey] = [ratio];
                    }
                    else {

                        this.ratios[ratioKey].push(ratio);
                    }
                }
            }
        }
    }
}
