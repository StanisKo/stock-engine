import { StockParserService } from './stock-parser.service';

export const parseDividends = (storage: StockParserService): void => {

    /*
    We do not concern ourselves with dividends (yet), therefore 0s
    */

    storage.stockProfile.dividends.dividendYield = storage.fundamentals.Highlights.DividendYield ?? 0;

    storage.stockProfile.dividends.dividendPayout = storage.fundamentals.SplitsDividends.PayoutRatio ?? 0;
};
