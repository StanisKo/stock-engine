import { StockParserService } from './stock-parser.service';

import { IGenericPrice } from '../../interfaces/ticker.interface';

import { MarketCapLabelService } from '../helpers/market-cap-label.service';
import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';

import { CAGRCalculatorService } from '../calculators/cagr-calculator.service';

export function parseGeneral(storage: StockParserService): void {

    storage.stockProfile.ticker = storage.fundamentals.General.Code;

    storage.stockProfile.industry = storage.fundamentals.General.Industry;

    storage.stockProfile.marketCap = {

        value: storage.fundamentals.Highlights.MarketCapitalization,

        label: MarketCapLabelService.createMarketLevelCapLabel(
            Number(storage.fundamentals.Highlights.MarketCapitalization)
        )
    };

    /*
    We don't have them in storage, as they're used only for CAGR
    */
    const [tickerStartingPrice, tickerEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
        storage.tickerTTMPrices as unknown as IGenericPrice[]
    );

    storage.stockProfile.cagr = CAGRCalculatorService.calculateCAGR(tickerStartingPrice, tickerEndingPrice);
}
