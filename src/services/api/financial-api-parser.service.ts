/*
Iteration 1

A helper service that:

Accepts raw ticker data

Extracts fields necessary for industry profile

Makes use of calculator services to calculate missing ratios

Returns values back to the caller in the shape of interface that adheres to Industry Profile schema
*/

import { IIndustryProfile } from '../../interfaces/industry-profile.interface';
import { ITickerFinancialData, ITickerFundamentals, ITickerPrice } from '../../interfaces/ticker.interface';

import { CAGRCalculatorService } from '../calculators/cagr-calculator.service';
import { StandardDeviationCalculatorService } from '../calculators/standard-deviation-calculator.service';
import { SharpeRatioCalculatorService } from '../calculators/sharpe-ratio-calculator.service';
import { AlphaCalculatorService } from '../calculators/alpha-calculator.service';
import { RSquaredCalculatorService } from '../calculators/r-squared-calculator.service';
import { LiquidityCalculatorService } from '../calculators/liquidity-calculator.service';
import { DebtCalculatorService } from '../calculators/debt-calculator.service';
import { EVRCalculatorService } from '../calculators/evr-calculator.service';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';
import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class FinancialApiParserService {

    extractedTickerData: IIndustryProfile;

    rawTickerData: ITickerFinancialData;

    fundamentals: ITickerFundamentals;

    prices: ITickerPrice[];

    benchmarkPrices: ITickerPrice[];

    treasuryBondYield: number;

    constructor(rawTickerData: ITickerFinancialData) {

        this.extractedTickerData = {} as IIndustryProfile;

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
            dividendYield: 0,
            dividendPayout: 0
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
    }

    private calculateAndFillMissingMeasurements(
        lastAnnualBalanceSheet: ITickerFundamentals,
        lastAnnualIncomeStatement: ITickerFundamentals
    ): void {

        const tickerTTMPrices = TimeSeriesHelperService.sliceDataSetIntoTTM(this.prices);

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
        Calculate sharpe ratio over ticker TTM prices and risk-free rate (US Treasury 1YR bond yield)
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
        Calculate EV/R based on market cap, last annual balance sheet and income statement
        */

        this.extractedTickerData.valuation.enterpriseValueToRevenue =
            EVRCalculatorService.calculateEnterpriseValueToRevenue(
                this.fundamentals.Highlights.MarketCapitalization,
                lastAnnualBalanceSheet.shortLongTermDebtTotal,
                lastAnnualBalanceSheet.cashAndEquivalents,
                lastAnnualIncomeStatement.totalRevenue
            );

        /*
        Calculate Liquidity based on last annual balance sheet
        */

        this.extractedTickerData.liquidity.currentRatio = LiquidityCalculatorService.calculateCurrentRatio(
            Number(lastAnnualBalanceSheet.totalCurrentAssets),
            Number(lastAnnualBalanceSheet.totalCurrentLiabilities)
        );

        this.extractedTickerData.liquidity.quickRatio = LiquidityCalculatorService.calculateQuickRatio(
            Number(lastAnnualBalanceSheet.cashAndShortTermInvestments),
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
    }

    public parseTickerData(): void {

        console.log('Started parsing the data');

        this.initializeSectionsToFill();

        /*
        Extract available fields
        */
        this.extractedTickerData.industry = this.fundamentals.General.Industry;

        /*
        TODO: build helper for deducing label
        */
        this.extractedTickerData.marketCap = this.fundamentals.Highlights.MarketCapitalization;

        this.extractedTickerData.risk.beta = this.fundamentals.Technicals.Beta;

        /*
        We, of course, use trailing PE

        NOTE: this is also available at this.fundamentals.Valuation.TrailingPE
        */
        this.extractedTickerData.valuation.priceToEarning = this.fundamentals.Highlights.PERatio;

        this.extractedTickerData.valuation.priceToEarningsGrowth = this.fundamentals.Highlights.PEGRatio;

        this.extractedTickerData.valuation.priceToSales = this.fundamentals.Valuation.PriceSalesTTM;

        this.extractedTickerData.valuation.priceToBook = this.fundamentals.Valuation.PriceBookMRQ;

        this.extractedTickerData.valuation.dividendYield = this.fundamentals.Highlights.DividendYield;

        this.extractedTickerData.valuation.dividendPayout = this.fundamentals.SplitsDividends.PayoutRatio;

        this.extractedTickerData.profitability.returnOnAssets = this.fundamentals.Highlights.ReturnOnAssetsTTM;

        this.extractedTickerData.profitability.returnOnEquity = this.fundamentals.Highlights.ReturnOnEquityTTM;

        this.extractedTickerData.profitability.profitMargin = this.fundamentals.Highlights.ProfitMargin;

        /*
        Get the last annual balance sheet and income statement necessary for liquidity and debt calculations
        */
        const lastAnnualBalanceSheet = this.fundamentals.Financials.Balance_Sheet.yearly[
            Object.keys(this.fundamentals.Financials.Balance_Sheet.yearly)[0]
        ];

        const lastAnnualIncomeStatement = this.fundamentals.Financials.Income_Statement.yearly[
            Object.keys(this.fundamentals.Financials.Income_Statement.yearly)[0]
        ];

        /*
        Calculate and fill missing fields
        */
        this.calculateAndFillMissingMeasurements(lastAnnualBalanceSheet, lastAnnualIncomeStatement);

        console.log(this.extractedTickerData);
    }
}
