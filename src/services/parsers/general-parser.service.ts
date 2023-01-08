import { StockParserService } from './stock-parser.service';

import { IGenericPrice } from '../../interfaces/ticker.interface';

import { MarketCapLabelService } from '../helpers/market-cap-label.service';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';
import { CAGRCalculatorService } from '../calculators/cagr-calculator.service';

export class GeneralParserService extends StockParserService {

    public parseGeneral(): void {

        this.stockProfile.ticker = this.fundamentals.General.Code;

        this.stockProfile.industry = this.fundamentals.General.Industry;

        this.stockProfile.marketCap = {

            value: this.fundamentals.Highlights.MarketCapitalization,

            label: MarketCapLabelService.createMarketLevelCapLabel(
                Number(this.fundamentals.Highlights.MarketCapitalization)
            )
        };

        /*
        We don't have them in this, as they're used only for CAGR
        */
        const [tickerStartingPrice, tickerEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            this.tickerTTMPrices as unknown as IGenericPrice[]
        );

        this.stockProfile.cagr = CAGRCalculatorService.calculateCAGR(tickerStartingPrice, tickerEndingPrice);
    }
    
}
