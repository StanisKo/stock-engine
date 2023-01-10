import { StockParserService } from './stock-parser.service';

import { ValuationCalculatorService } from '../calculators/valuation-calculator.service';

export const parseValuation = (storage: StockParserService): void => {

    /*
    All these are WIP and need to be either consumer or calculated
    */
    storage.stockProfile.valuation.priceToEarning =
        storage.fundamentals.Highlights.PERatio ?? ValuationCalculatorService.calculatePriceToEarnings(
            storage.tickerMostRecentPrice,
            Number(storage.lastAnnualIncomeStatement.netIncome),
            Number(storage.lastAnnualBalanceSheet.commonStockSharesOutstanding),
            storage.exchangeRate
        );

    storage.stockProfile.valuation.priceToEarningsGrowth =
        storage.fundamentals.Highlights.PEGRatio ?? ValuationCalculatorService.calculatePriceToEarningsGrowth(
            storage.stockProfile.valuation.priceToEarning,
            storage.annualEarningsGrowth
        );

    storage.stockProfile.valuation.priceToSales =
        storage.fundamentals.Valuation.PriceSalesTTM ?? ValuationCalculatorService.calculatePriceToSales(
            storage.tickerMostRecentPrice,
            Number(storage.lastAnnualIncomeStatement.totalRevenue)
        );

    storage.stockProfile.valuation.priceToBook = storage.fundamentals.Valuation.PriceBookMRQ;

    /*
    Calculate EV based on market cap and last annual balance sheet

    Calculate EVR and EVEBITDA based on revenue and EBITDA (last annual income statement)

    Then calculate P/FCF based on free cash flow (last annual cash flow statement),
    number of outstanding shares (last annual balance sheet), and stock price (average of last 60 trading days)
    */

    ValuationCalculatorService.enterpriseValue =
        storage.fundamentals.Valuation.EnterpriseValue ?? ValuationCalculatorService.calculateEnterpriseValue(
            Number(storage.fundamentals.Highlights.MarketCapitalization),
            Number(storage.lastAnnualBalanceSheet.shortLongTermDebtTotal),
            Number(storage.lastAnnualBalanceSheet.cash),
            Number(storage.lastAnnualBalanceSheet.cashAndEquivalents)
        );

    storage.stockProfile.valuation.enterpriseValueToRevenue =
        storage.fundamentals.Valuation.EnterpriseValueRevenue ?? ValuationCalculatorService.calculateEVR(
            Number(storage.lastAnnualIncomeStatement.totalRevenue)
        );

    storage.stockProfile.valuation.enterpriseValueToEbitda =
        storage.fundamentals.Valuation.EnterpriseValueEbitda ?? ValuationCalculatorService.calculateEVEBITDA(
            Number(storage.lastAnnualIncomeStatement.ebitda)
        );

    /*
    Price to Free Cash Flow is always missing, calculate over cash flow, balance sheet
    and average price over last 60 days
    */
    storage.stockProfile.valuation.priceToFreeCashFlow = ValuationCalculatorService.calculatePriceToFreeCashFlow(
        Number(storage.lastAnnualCashFlowStatement.freeCashFlow),
        Number(storage.lastAnnualBalanceSheet.commonStockSharesOutstanding),
        storage.tickerAveragePriceOverLastSixtyTradingDays
    );
};
