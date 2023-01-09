import { StockParserService } from './stock-parser.service';

export const parseProfitability = (storage: StockParserService): void => {

    storage.stockProfile.profitability.returnOnAssets = storage.fundamentals.Highlights.ReturnOnAssetsTTM;

    storage.stockProfile.profitability.returnOnEquity = storage.fundamentals.Highlights.ReturnOnEquityTTM;

    storage.stockProfile.profitability.profitMargin = storage.fundamentals.Highlights.ProfitMargin;
};
