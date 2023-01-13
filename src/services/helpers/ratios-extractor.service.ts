import { IStockProfile } from '../../interfaces/stock-profile.interface';

export class RatiosExtractorService {

    public ratios: { [key: string]: number[] };

    public categories: string[];

    private keys: string[];

    constructor() {

        this.ratios = {};

        this.categories = [
            'risk', 'valuation', 'profitability', 'liquidity', 'debt', 'efficiency'
        ];

        this.keys = [
            'cagr', 'standardDeviation', 'sharpeRatio', 'beta', 'alpha', 'rSquared',
            'priceToEarning', 'priceToEarningsGrowth', 'priceToSales', 'priceToBook',
            'enterpriseValueToRevenue', 'enterpriseValueToEbitda', 'priceToFreeCashFlow',
            'returnOnAssets', 'returnOnEquity', 'profitMargin', 'currentRatio', 'quickRatio',
            'debtToEquity', 'interestCoverage', 'assetTurnover', 'inventoryTurnover'
        ];

        for (let i = 0; i < this.keys.length; i++) {

            this.ratios[this.keys[i]] = [];
        }
    }

    public extractRatiosFromProfiles(profiles: IStockProfile[]): void {

        for (let i = 0; i < profiles.length; i++) {

            const profile = profiles[i];

            const keysOfCurrentlyIteratedProfile = Object.keys(profile);

            for (let j = 0; j < keysOfCurrentlyIteratedProfile.length; j++) {

                /*
                Handle CAGR explicitly
                */
                const key = keysOfCurrentlyIteratedProfile[j];

                if (key === 'cagr') {

                    this.ratios[key].push(profile[key]);
                }

                /*
                Skip key if it's non-data related
                */
                if (!this.categories.includes(key)) {

                    continue;
                }

                /*
                Otherwise, traverse and extract
                */
                const ratiosWithinCurrentlyIteratedCategory = Object.keys(profile[key as keyof IStockProfile]);

                for (let k = 0; k < ratiosWithinCurrentlyIteratedCategory.length; k++) {
                    
                }
            }

        }
    }
}
