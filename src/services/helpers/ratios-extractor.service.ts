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
    }

    public extractRatiosFromProfiles(profiles: IStockProfile[]): void {

        for (let i = 0; i < profiles.length; i++) {

            const profile = profiles[i];

            const keysOfCurrentlyIteratedProfile = Object.keys(profile);

            for (let j = 0; j < keysOfCurrentlyIteratedProfile.length; j++) {

                
            }

        }
    }
}
