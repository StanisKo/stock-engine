/* eslint-disable max-len */

/*
Iteration 1

Accepts raw ticker data

Extracts fields necessary for stock profile

Makes use of calculator services to calculate missing ratios

Returns values back to the caller in the shape of interface that adheres to Stock Profile schema

TODO: this has to be smarten up, broken down and restructured

Also renamed to something more sensible

StockParserService

called in loop for every ticker in batch by stock profiling worker
*/

import { IStockProfile } from '../../interfaces/stock-profile.interface';
import { ITickerFinancialData, ITickerFundamentals, ITickerPrice } from '../../interfaces/ticker.interface';

import { CAGRCalculatorService } from '../calculators/cagr-calculator.service';
import { StandardDeviationCalculatorService } from '../calculators/standard-deviation-calculator.service';
import { SharpeRatioCalculatorService } from '../calculators/sharpe-ratio-calculator.service';
import { AlphaCalculatorService } from '../calculators/alpha-calculator.service';
import { RSquaredCalculatorService } from '../calculators/r-squared-calculator.service';
import { LiquidityCalculatorService } from '../calculators/liquidity-calculator.service';
import { DebtCalculatorService } from '../calculators/debt-calculator.service';
import { ValuationCalculatorService } from '../calculators/valuation-calculator.service';
import { EfficiencyCalculatorService } from '../calculators/efficiency-calculator.service';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';
import { CalculatorHelperService } from '../helpers/calculator-helper.service';
import { MarketCapLabelService } from '../helpers/market-cap-label.service';

export class DataParserService {

    extractedTickerData: IStockProfile;

    rawTickerData: ITickerFinancialData;

    fundamentals: ITickerFundamentals;

    prices: ITickerPrice[];

    benchmarkPrices: ITickerPrice[];

    treasuryBondYield: number;

    constructor(rawTickerData: ITickerFinancialData) {

        this.extractedTickerData = {} as IStockProfile;

        this.fundamentals = rawTickerData.fundamentals;

        this.prices = rawTickerData.prices;

        this.benchmarkPrices = rawTickerData.benchmarkPrices;

        this.treasuryBondYield = rawTickerData.treasuryBondYield;
    }

    private initializeSectionsToFill(): void {

        /*
        Initialize risk map to fill
        */
        this.extractedTickerData.risk = {
            standardDeviation: 0,
            sharpeRatio: 0,
            beta: 0,
            alpha: 0,
            rSquared: 0
        };

        /*
        Initialize valuation map to fill
        */
        this.extractedTickerData.valuation = {
            priceToEarning: 0,
            priceToEarningsGrowth: 0,
            priceToSales: 0,
            priceToBook: 0,
            enterpriseValueToRevenue: 0,
            enterpriseValueToEbitda: 0,
            priceToFreeCashFlow: 0
        };

        /*
        Initialize profitability map to fill
        */
        this.extractedTickerData.profitability = {
            returnOnAssets: 0,
            returnOnEquity: 0,
            profitMargin: 0
        };

        /*
        Initialize liquidity map to fill
        */
        this.extractedTickerData.liquidity = {
            currentRatio: 0,
            quickRatio: 0
        };

        /*
        Initialize debt map to fill
        */
        this.extractedTickerData.debt = {
            debtToEquity: 0,
            interestCoverage: 0
        };

        /*
        Initialize efficiency map to fill
        */
        this.extractedTickerData.efficiency = {
            assetTurnover: 0,
            inventoryTurnover: 0
        };

        /*
        Initialize dividends map to fill
        */
        this.extractedTickerData.dividends = {
            dividendYield: 0,
            dividendPayout: 0
        };
    }

    private calculateAndFillMissingMeasurements(): void {

        /*
        Get the last annual balance sheet, income statement and cash flow statement
        necessary for liquidity, valution, debt, and efficiency calculations

        TODO: change indexing from current to yearly_last_0

        TODO: work with last quarterly values!

        TODO: consume those available on api, calculate otherwise
        This principle has to be applied to all datapoints:
        check for availability and consume, calculate otherwise!

        TODO: adapt calculations to factor in for missing data
        */

        const lastAnnualBalanceSheet = this.fundamentals.Financials.Balance_Sheet.yearly[
            Object.keys(this.fundamentals.Financials.Balance_Sheet.yearly)[0]
        ];

        const lastAnnualIncomeStatement = this.fundamentals.Financials.Income_Statement.yearly[
            Object.keys(this.fundamentals.Financials.Income_Statement.yearly)[0]
        ];

        const lastAnnualCashFlowStatement = this.fundamentals.Financials.Cash_Flow.yearly[
            Object.keys(this.fundamentals.Financials.Cash_Flow.yearly)[0]
        ];

        const tickerTTMPrices = TimeSeriesHelperService.sliceDatasetIntoTTM(this.prices);

        const [tickerStartingPrice, tickerEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            tickerTTMPrices
        );

        /*
        Calculate CAGR over ticker TTM prices
        */

        this.extractedTickerData.cagr = CAGRCalculatorService.calculateCAGR(tickerStartingPrice, tickerEndingPrice);

        /*
        Calculate standard deviation over entire dataset of ticker prices (since IPO date)
        */

        const standardDeviation = StandardDeviationCalculatorService.calculateStandardDeviation(this.prices);

        this.extractedTickerData.risk.standardDeviation = standardDeviation;

        /*
        Calculate sharpe ratio over ticker rate of return, risk-free rate (US Treasury 1YR bond yield)
        and standard deviation
        */

        const tickerRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            tickerStartingPrice,
            tickerEndingPrice
        );

        this.extractedTickerData.risk.sharpeRatio = SharpeRatioCalculatorService.calculateSharpeRatio(
            tickerRateOfReturn,
            this.treasuryBondYield,
            standardDeviation
        );

        /*
        Calculate alpha over ticker rate of return, benchmark rate of return,
        risk-free rate (US Treasury 1YR bond yield), and ticker's beta
        */

        const [benchmarkStartingPrice, benchmarkEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            this.benchmarkPrices
        );

        const benchmarkRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            benchmarkStartingPrice,
            benchmarkEndingPrice
        );

        this.extractedTickerData.risk.alpha = AlphaCalculatorService.calculateAlpha(
            tickerRateOfReturn,
            benchmarkRateOfReturn,
            this.treasuryBondYield,
            this.extractedTickerData.risk.beta
        );

        /*
        Calculate R-Squared over ticker TTM prices and benchmark TTM prices
        */

        this.extractedTickerData.risk.rSquared = RSquaredCalculatorService.calculateRSquared(
            tickerTTMPrices,
            this.benchmarkPrices
        );

        /*
        Calculate EV based on market cap and last annual balance sheet

        Calculate EVR and EVEBITDA based on revenue and EBITDA (last annual income statement)

        Then calculate P/FCF based on free cash flow (last annual cash flow statement),
        number of outstanding shares (last annual balance sheet), and stock price (average of last 60 trading days)
        */

        ValuationCalculatorService.calculateEnterpriseValue(
            Number(this.fundamentals.Highlights.MarketCapitalization),
            Number(lastAnnualBalanceSheet.shortLongTermDebtTotal),
            Number(lastAnnualBalanceSheet.cash),
            Number(lastAnnualBalanceSheet.cashAndEquivalents)
        );

        this.extractedTickerData.valuation.enterpriseValueToRevenue = ValuationCalculatorService.calculateEVR(
            Number(lastAnnualIncomeStatement.totalRevenue)
        );

        this.extractedTickerData.valuation.enterpriseValueToEbitda = ValuationCalculatorService.calculateEVEBITDA(
            Number(lastAnnualIncomeStatement.ebitda)
        );

        const pricesOverLastSixtyTradingDays = TimeSeriesHelperService.sliceDatasetIntoLastNTradingDays(
            this.prices,
            60
        );

        const averagePriceOverLastSixtyTradingDays = CalculatorHelperService.calculateAveragePrice(
            pricesOverLastSixtyTradingDays
        );

        this.extractedTickerData.valuation.priceToFreeCashFlow = ValuationCalculatorService.calculatePriceToFreeCashFlow(
            Number(lastAnnualCashFlowStatement.freeCashFlow),
            Number(lastAnnualBalanceSheet.commonStockSharesOutstanding),
            averagePriceOverLastSixtyTradingDays
        );

        /*
        Calculate Liquidity based on last annual balance sheet
        */

        this.extractedTickerData.liquidity.currentRatio = LiquidityCalculatorService.calculateCurrentRatio(
            Number(lastAnnualBalanceSheet.totalCurrentAssets),
            Number(lastAnnualBalanceSheet.totalCurrentLiabilities)
        );

        this.extractedTickerData.liquidity.quickRatio = LiquidityCalculatorService.calculateQuickRatio(
            Number(lastAnnualBalanceSheet.cash),
            Number(lastAnnualBalanceSheet.cashAndEquivalents),
            Number(lastAnnualBalanceSheet.shortTermInvestments),
            Number(lastAnnualBalanceSheet.netReceivables),
            Number(lastAnnualBalanceSheet.totalCurrentLiabilities)
        );

        /*
        Calculate Debt based on last annual balance sheet and income statement
        */

        this.extractedTickerData.debt.debtToEquity = DebtCalculatorService.calculateDebtToEquity(
            Number(lastAnnualBalanceSheet.totalLiab),
            Number(lastAnnualBalanceSheet.totalStockholderEquity)
        );

        this.extractedTickerData.debt.interestCoverage = DebtCalculatorService.calculateInterestCoverage(
            Number(lastAnnualIncomeStatement.ebit),
            Number(lastAnnualIncomeStatement.interestExpense)
        );

        /*
        Calculate Efficiency on last annual income statement and balance sheet
        */

        this.extractedTickerData.efficiency.assetTurnover = EfficiencyCalculatorService.calculateAssetTurnover(
            Number(lastAnnualIncomeStatement.totalRevenue),
            Number(lastAnnualBalanceSheet.totalAssets)
        );

        this.extractedTickerData.efficiency.inventoryTurnover = EfficiencyCalculatorService.calculateInventoryTurnover(
            Number(lastAnnualIncomeStatement.costOfRevenue),
            Number(lastAnnualBalanceSheet.inventory)
        );
    }

    public parseTickerData(): void {

        console.log('Started parsing the data');

        this.initializeSectionsToFill();

        /*
        Extract available fields
        */
        this.extractedTickerData.ticker = this.fundamentals.General.Code;

        this.extractedTickerData.industry = this.fundamentals.General.Industry;

        this.extractedTickerData.marketCap = {

            value: this.fundamentals.Highlights.MarketCapitalization,

            label: MarketCapLabelService.createMarketLevelCapLabel(
                Number(this.fundamentals.Highlights.MarketCapitalization)
            )
        };

        this.extractedTickerData.risk.beta = this.fundamentals.Technicals.Beta;

        this.extractedTickerData.valuation.priceToEarning = this.fundamentals.Highlights.PERatio;

        this.extractedTickerData.valuation.priceToEarningsGrowth = this.fundamentals.Highlights.PEGRatio;

        this.extractedTickerData.valuation.priceToSales = this.fundamentals.Valuation.PriceSalesTTM;

        this.extractedTickerData.valuation.priceToBook = this.fundamentals.Valuation.PriceBookMRQ;

        this.extractedTickerData.profitability.returnOnAssets = this.fundamentals.Highlights.ReturnOnAssetsTTM;

        this.extractedTickerData.profitability.returnOnEquity = this.fundamentals.Highlights.ReturnOnEquityTTM;

        this.extractedTickerData.profitability.profitMargin = this.fundamentals.Highlights.ProfitMargin;

        this.extractedTickerData.dividends.dividendYield = this.fundamentals.Highlights.DividendYield;

        this.extractedTickerData.dividends.dividendPayout = this.fundamentals.SplitsDividends.PayoutRatio;

        /*
        Calculate and fill missing fields
        */
        this.calculateAndFillMissingMeasurements();

        console.log(this.extractedTickerData);
    }
}
