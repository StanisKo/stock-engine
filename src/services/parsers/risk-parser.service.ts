import { StockParserService } from './stock-parser.service';

import { RiskCalculatorService } from '../calculators/risk-calculator.service';

export const parseRisk = (storage: StockParserService): void => {

    /*
    Standard Deviation is always missing,
    calculate over entire dataset of ticker prices (since IPO date)
    */
    const standardDeviation = RiskCalculatorService.calculateStandardDeviation(storage.tickerPricesSinceIPO);

    storage.stockProfile.risk.standardDeviation = standardDeviation;

    /*
    Sharpe Ratio is always missing,
    calculate over ticker rate of return, risk-free rate (US Treasury 1YR bond yield) and standard deviation
    */
    storage.stockProfile.risk.sharpeRatio = RiskCalculatorService.calculateSharpeRatio(
        storage.tickerTTMRateOfReturn,
        storage.treasuryBondYield,
        standardDeviation
    );

    /*
    Mind, beta has to be calculated of 5 years of prices
    */
    storage.stockProfile.risk.beta = storage.fundamentals.Technicals.Beta;

    /*
    Calculate alpha over ticker rate of return, benchmark rate of return,
    risk-free rate (US Treasury 1YR bond yield), and ticker's beta
    */
    storage.stockProfile.risk.alpha = RiskCalculatorService.calculateAlpha(
        storage.tickerTTMRateOfReturn,
        storage.benchmarkTTMRateOfReturn,
        storage.treasuryBondYield,
        storage.stockProfile.risk.beta
    );

    /*
    Calculate R-Squared over ticker TTM prices and benchmark TTM prices
    */
    storage.stockProfile.risk.rSquared = RiskCalculatorService.calculateRSquared(
        storage.tickerTTMPrices,
        storage.benchmarkTTMPrices
    );
};
