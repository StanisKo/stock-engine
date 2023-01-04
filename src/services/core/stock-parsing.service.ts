/* eslint-disable max-len */

/*
Some ratios are either present or missing for different stocks;
there are ratios that always missing and we need to calculate them

Not all companies going through parser adhere to GAAP (Generally Accepted Accounting Principiles)
and in such they do not expose key (in our case) financial figures

Therefore, each ratio is checked:

1. On availability to be consumed
2. If not, calculated
3. if not (enough data), marked as N/A, leading to the discarding of stock
*/

import { IStockProfile } from '../../interfaces/stock-profile.interface';
import { ITickerFundamentals, ITickerPrice } from '../../interfaces/ticker.interface';

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

export class StockParsingService {

    fundamentals: ITickerFundamentals;

    prices: ITickerPrice[];

    benchmarkPrices: ITickerPrice[];

    treasuryBondYield: number;

    stockProfile: IStockProfile;

    constructor(fundamentals: ITickerFundamentals, prices: ITickerPrice[], benchmarkPrices: ITickerPrice[], treasuryBondYield: number) {

        this.fundamentals = fundamentals;

        this.prices = prices;

        this.benchmarkPrices = benchmarkPrices;

        this.treasuryBondYield = treasuryBondYield;

        this.stockProfile = {} as IStockProfile;
    }

    private initializeSectionsToFill(): void {

        this.stockProfile.risk = {
            standardDeviation: 0,
            sharpeRatio: 0,
            beta: 0,
            alpha: 0,
            rSquared: 0
        };

        this.stockProfile.valuation = {
            priceToEarning: 0,
            priceToEarningsGrowth: 0,
            priceToSales: 0,
            priceToBook: 0,
            enterpriseValueToRevenue: 0,
            enterpriseValueToEbitda: 0,
            priceToFreeCashFlow: 0
        };

        this.stockProfile.profitability = {
            returnOnAssets: 0,
            returnOnEquity: 0,
            profitMargin: 0
        };

        this.stockProfile.liquidity = {
            currentRatio: 0,
            quickRatio: 0
        };

        this.stockProfile.debt = {
            debtToEquity: 0,
            interestCoverage: 0
        };

        this.stockProfile.efficiency = {
            assetTurnover: 0,
            inventoryTurnover: 0
        };

        this.stockProfile.dividends = {
            dividendYield: 0,
            dividendPayout: 0
        };
    }

    private consumeOrCalculateVariableFields(): void {

        this.stockProfile.ticker = this.fundamentals.General.Code;

        this.stockProfile.industry = this.fundamentals.General.Industry;

        this.stockProfile.marketCap = {

            value: this.fundamentals.Highlights.MarketCapitalization,

            label: MarketCapLabelService.createMarketLevelCapLabel(
                Number(this.fundamentals.Highlights.MarketCapitalization)
            )
        };

        this.stockProfile.risk.beta = this.fundamentals.Technicals.Beta;

        this.stockProfile.valuation.priceToEarning = this.fundamentals.Highlights.PERatio;

        this.stockProfile.valuation.priceToEarningsGrowth = this.fundamentals.Highlights.PEGRatio;

        this.stockProfile.valuation.priceToSales = this.fundamentals.Valuation.PriceSalesTTM;

        this.stockProfile.valuation.priceToBook = this.fundamentals.Valuation.PriceBookMRQ;

        this.stockProfile.profitability.returnOnAssets = this.fundamentals.Highlights.ReturnOnAssetsTTM;

        this.stockProfile.profitability.returnOnEquity = this.fundamentals.Highlights.ReturnOnEquityTTM;

        this.stockProfile.profitability.profitMargin = this.fundamentals.Highlights.ProfitMargin;

        this.stockProfile.dividends.dividendYield = this.fundamentals.Highlights.DividendYield;

        this.stockProfile.dividends.dividendPayout = this.fundamentals.SplitsDividends.PayoutRatio;
    }

    private calculateMissingFields(): void {

        /*
        Get the last annual balance sheet, income statement and cash flow statement
        necessary for liquidity, valution, debt, and efficiency calculations
        */

        const lastAnnualBalanceSheet = this.fundamentals.Financials.Balance_Sheet.yearly_last_0;

        const lastAnnualIncomeStatement = this.fundamentals.Financials.Income_Statement.yearly_last_0;

        const lastAnnualCashFlowStatement = this.fundamentals.Financials.Cash_Flow.yearly_last_0;

        /*
        Get ticker TTM prices
        */

        const tickerTTMPrices = TimeSeriesHelperService.sliceDatasetIntoTTM(this.prices);

        const [tickerStartingPrice, tickerEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            tickerTTMPrices
        );

        /*
        Calculate CAGR over ticker TTM prices
        */

        this.stockProfile.cagr = CAGRCalculatorService.calculateCAGR(tickerStartingPrice, tickerEndingPrice);

        /*
        Calculate standard deviation over entire dataset of ticker prices (since IPO date)
        */

        const standardDeviation = StandardDeviationCalculatorService.calculateStandardDeviation(this.prices);

        this.stockProfile.risk.standardDeviation = standardDeviation;

        /*
        Calculate sharpe ratio over ticker rate of return, risk-free rate (US Treasury 1YR bond yield)
        and standard deviation
        */

        const tickerRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            tickerStartingPrice,
            tickerEndingPrice
        );

        this.stockProfile.risk.sharpeRatio = SharpeRatioCalculatorService.calculateSharpeRatio(
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

        this.stockProfile.risk.alpha = AlphaCalculatorService.calculateAlpha(
            tickerRateOfReturn,
            benchmarkRateOfReturn,
            this.treasuryBondYield,
            this.stockProfile.risk.beta
        );

        /*
        Calculate R-Squared over ticker TTM prices and benchmark TTM prices
        */

        this.stockProfile.risk.rSquared = RSquaredCalculatorService.calculateRSquared(
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

        this.stockProfile.valuation.enterpriseValueToRevenue = ValuationCalculatorService.calculateEVR(
            Number(lastAnnualIncomeStatement.totalRevenue)
        );

        this.stockProfile.valuation.enterpriseValueToEbitda = ValuationCalculatorService.calculateEVEBITDA(
            Number(lastAnnualIncomeStatement.ebitda)
        );

        const pricesOverLastSixtyTradingDays = TimeSeriesHelperService.sliceDatasetIntoLastNTradingDays(
            this.prices,
            60
        );

        const averagePriceOverLastSixtyTradingDays = CalculatorHelperService.calculateAveragePrice(
            pricesOverLastSixtyTradingDays
        );

        this.stockProfile.valuation.priceToFreeCashFlow = ValuationCalculatorService.calculatePriceToFreeCashFlow(
            Number(lastAnnualCashFlowStatement.freeCashFlow),
            Number(lastAnnualBalanceSheet.commonStockSharesOutstanding),
            averagePriceOverLastSixtyTradingDays
        );

        /*
        Calculate Liquidity based on last annual balance sheet
        */

        this.stockProfile.liquidity.currentRatio = LiquidityCalculatorService.calculateCurrentRatio(
            Number(lastAnnualBalanceSheet.totalCurrentAssets),
            Number(lastAnnualBalanceSheet.totalCurrentLiabilities)
        );

        this.stockProfile.liquidity.quickRatio = LiquidityCalculatorService.calculateQuickRatio(
            Number(lastAnnualBalanceSheet.cash),
            Number(lastAnnualBalanceSheet.cashAndEquivalents),
            Number(lastAnnualBalanceSheet.shortTermInvestments),
            Number(lastAnnualBalanceSheet.netReceivables),
            Number(lastAnnualBalanceSheet.totalCurrentLiabilities)
        );

        /*
        Calculate Debt based on last annual balance sheet and income statement
        */

        this.stockProfile.debt.debtToEquity = DebtCalculatorService.calculateDebtToEquity(
            Number(lastAnnualBalanceSheet.totalLiab),
            Number(lastAnnualBalanceSheet.totalStockholderEquity)
        );

        this.stockProfile.debt.interestCoverage = DebtCalculatorService.calculateInterestCoverage(
            Number(lastAnnualIncomeStatement.ebit),
            Number(lastAnnualIncomeStatement.interestExpense)
        );

        /*
        Calculate Efficiency on last annual income statement and balance sheet
        */

        this.stockProfile.efficiency.assetTurnover = EfficiencyCalculatorService.calculateAssetTurnover(
            Number(lastAnnualIncomeStatement.totalRevenue),
            Number(lastAnnualBalanceSheet.totalAssets)
        );

        this.stockProfile.efficiency.inventoryTurnover = EfficiencyCalculatorService.calculateInventoryTurnover(
            Number(lastAnnualIncomeStatement.costOfRevenue),
            Number(lastAnnualBalanceSheet.inventory)
        );
    }

    public parseOutStockProfile(): IStockProfile {

        this.initializeSectionsToFill();

        this.consumeOrCalculateVariableFields();

        this.calculateMissingFields();

        return this.stockProfile;
    }
}
