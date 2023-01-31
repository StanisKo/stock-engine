import { MarketCapMargin, MarketCapLabel } from '../../enums';

export class MarketCapLabelService {

    static createMarketLevelCapLabel(marketCap: number): MarketCapLabel {

        /*
        Small by default, otherwise it falls into medium/large
        */
        let marketCapLabel = MarketCapLabel.SMALL;

        if (marketCap >= MarketCapMargin.SMALL && marketCap < MarketCapMargin.LARGE) {

            marketCapLabel = MarketCapLabel.MEDIUM;
        }

        if (marketCap >= MarketCapMargin.LARGE) {

            marketCapLabel = MarketCapLabel.LARGE;
        }

        return marketCapLabel;
    }
}
