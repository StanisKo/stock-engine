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
    Mind, beta has to be calculated of 5 years of prices (WIP)
    */
    storage.stockProfile.risk.beta = storage.fundamentals.Technicals.Beta;

    /*
    Alpha is always missing, calculate over ticker rate of return, benchmark rate of return,
    risk-free rate (US Treasury 1YR bond yield), and ticker's beta
    */
    storage.stockProfile.risk.alpha = RiskCalculatorService.calculateAlpha(
        storage.tickerTTMRateOfReturn,
        storage.benchmarkTTMRateOfReturn,
        storage.treasuryBondYield,
        storage.stockProfile.risk.beta
    );

    /*
    R-Squared is always missing, calculate R-Squared over ticker TTM returns and benchmark TTM returns
    */
    storage.stockProfile.risk.rSquared = RiskCalculatorService.calculateRSquared(
        storage.tickerTTMReturns,
        storage.benchmarkTTMReturns
    );
};
