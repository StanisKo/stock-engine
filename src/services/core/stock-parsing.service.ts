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
import { ITickerFundamentals, ITickerPrice, IBenchmarkPrice, IGenericPrice } from '../../interfaces/ticker.interface';

import { CAGRCalculatorService } from '../calculators/cagr-calculator.service';

import { RiskCalculatorService } from '../calculators/risk-calculator.service';
import { ValuationCalculatorService } from '../calculators/valuation-calculator.service';
import { LiquidityCalculatorService } from '../calculators/liquidity-calculator.service';
import { DebtCalculatorService } from '../calculators/debt-calculator.service';
import { EfficiencyCalculatorService } from '../calculators/efficiency-calculator.service';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';
import { CalculatorHelperService } from '../helpers/calculator-helper.service';
import { MarketCapLabelService } from '../helpers/market-cap-label.service';

export class StockParsingService {

    fundamentals: ITickerFundamentals;

    prices: ITickerPrice[];

    benchmarkPrices: IBenchmarkPrice[];

    treasuryBondYield: number;

    stockProfile: IStockProfile;


    /*
    Inputs for calculators
    */
    lastAnnualBalanceSheet: ITickerFundamentals;

    lastAnnualIncomeStatement: ITickerFundamentals;

    lastAnnualCashFlowStatement: ITickerFundamentals;

    tickerTTMPrices: ITickerPrice[];

    tickerStartingPrice: number;

    tickerEndingPrice: number;

    tickerRateOfReturn: number;

    benchmarkRateOfReturn: number;

    averagePriceOverLastSixtyTradingDays: number;

    constructor(fundamentals: ITickerFundamentals, prices: ITickerPrice[], benchmarkPrices: IBenchmarkPrice[], treasuryBondYield: number) {

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

    private constructInputsForCalculators(): void {

        /*
        Get the last annual balance sheet, income statement and cash flow statement
        necessary for liquidity, valuation, debt, and efficiency calculations
        */
        this.lastAnnualBalanceSheet = this.fundamentals.Financials.Balance_Sheet.yearly_last_0;

        this.lastAnnualIncomeStatement = this.fundamentals.Financials.Income_Statement.yearly_last_0;

        this.lastAnnualCashFlowStatement = this.fundamentals.Financials.Cash_Flow.yearly_last_0;

        /*
        Get ticker TTM prices
        */
        this.tickerTTMPrices = TimeSeriesHelperService.sliceDatasetIntoTTM(this.prices);

        const [tickerStartingPrice, tickerEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            this.tickerTTMPrices as unknown as IGenericPrice[]
        );

        /*
        Determine ticker's starting and ending price
        */
        this.tickerStartingPrice = tickerStartingPrice;

        this.tickerEndingPrice = tickerEndingPrice;

        /*
        Calculate ticker's rate of return
        */
        this.tickerRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            this.tickerStartingPrice,
            this.tickerEndingPrice
        );

        /*
        Determine benchmark's starting and ending price

        NOTE: benchmark prices are already TTM by default
        */
        const [benchmarkStartingPrice, benchmarkEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            this.benchmarkPrices as unknown as IGenericPrice[]
        );

        this.benchmarkRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            benchmarkStartingPrice,
            benchmarkEndingPrice
        );

        /*
        Calculate average price over N (60 in our case) trading days
        */
        const pricesOverLastSixtyTradingDays = TimeSeriesHelperService.sliceDatasetIntoLastNTradingDays(
            this.prices,
            60
        );

        this.averagePriceOverLastSixtyTradingDays = CalculatorHelperService.calculateAveragePrice(
            pricesOverLastSixtyTradingDays
        );
    }

    private consumeOrCalculateRatios(): void {

        this.stockProfile.ticker = this.fundamentals.General.Code;

        this.stockProfile.industry = this.fundamentals.General.Industry;

        this.stockProfile.marketCap = {

            value: this.fundamentals.Highlights.MarketCapitalization,

            label: MarketCapLabelService.createMarketLevelCapLabel(
                Number(this.fundamentals.Highlights.MarketCapitalization)
            )
        };

        /*
        Calculate CAGR over ticker TTM prices
        */
        this.stockProfile.cagr = CAGRCalculatorService.calculateCAGR(this.tickerStartingPrice, this.tickerEndingPrice);

        /* **** */

        this.stockProfile.risk.beta = this.fundamentals.Technicals.Beta;

        /*
        Calculate standard deviation over entire dataset of ticker prices (since IPO date)
        */
        const standardDeviation = RiskCalculatorService.calculateStandardDeviation(this.prices);

        this.stockProfile.risk.standardDeviation = standardDeviation;

        /*
        Calculate sharpe ratio over ticker rate of return, risk-free rate (US Treasury 1YR bond yield)
        and standard deviation
        */
        this.stockProfile.risk.sharpeRatio = RiskCalculatorService.calculateSharpeRatio(
            this.tickerRateOfReturn,
            this.treasuryBondYield,
            standardDeviation
        );

        /*
        Calculate alpha over ticker rate of return, benchmark rate of return,
        risk-free rate (US Treasury 1YR bond yield), and ticker's beta
        */
        this.stockProfile.risk.alpha = RiskCalculatorService.calculateAlpha(
            this.tickerRateOfReturn,
            this.benchmarkRateOfReturn,
            this.treasuryBondYield,
            this.stockProfile.risk.beta
        );

        /*
        Calculate R-Squared over ticker TTM prices and benchmark TTM prices
        */
        this.stockProfile.risk.rSquared = RiskCalculatorService.calculateRSquared(
            this.tickerTTMPrices,
            this.benchmarkPrices
        );

        /* **** */

        this.stockProfile.valuation.priceToEarning = this.fundamentals.Highlights.PERatio;

        this.stockProfile.valuation.priceToEarningsGrowth = this.fundamentals.Highlights.PEGRatio;

        this.stockProfile.valuation.priceToSales = this.fundamentals.Valuation.PriceSalesTTM;

        this.stockProfile.valuation.priceToBook = this.fundamentals.Valuation.PriceBookMRQ;

        /*
        Calculate EV based on market cap and last annual balance sheet

        Calculate EVR and EVEBITDA based on revenue and EBITDA (last annual income statement)

        Then calculate P/FCF based on free cash flow (last annual cash flow statement),
        number of outstanding shares (last annual balance sheet), and stock price (average of last 60 trading days)
        */

        ValuationCalculatorService.calculateEnterpriseValue(
            Number(this.fundamentals.Highlights.MarketCapitalization),
            Number(this.lastAnnualBalanceSheet.shortLongTermDebtTotal),
            Number(this.lastAnnualBalanceSheet.cash),
            Number(this.lastAnnualBalanceSheet.cashAndEquivalents)
        );

        this.stockProfile.valuation.enterpriseValueToRevenue = ValuationCalculatorService.calculateEVR(
            Number(this.lastAnnualIncomeStatement.totalRevenue)
        );

        this.stockProfile.valuation.enterpriseValueToEbitda = ValuationCalculatorService.calculateEVEBITDA(
            Number(this.lastAnnualIncomeStatement.ebitda)
        );

        this.stockProfile.valuation.priceToFreeCashFlow = ValuationCalculatorService.calculatePriceToFreeCashFlow(
            Number(this.lastAnnualCashFlowStatement.freeCashFlow),
            Number(this.lastAnnualBalanceSheet.commonStockSharesOutstanding),
            this.averagePriceOverLastSixtyTradingDays
        );

        /* **** */

        this.stockProfile.profitability.returnOnAssets = this.fundamentals.Highlights.ReturnOnAssetsTTM;

        this.stockProfile.profitability.returnOnEquity = this.fundamentals.Highlights.ReturnOnEquityTTM;

        this.stockProfile.profitability.profitMargin = this.fundamentals.Highlights.ProfitMargin;

        /* **** */

        /*
        Calculate Liquidity based on last annual balance sheet
        */
        this.stockProfile.liquidity.currentRatio = LiquidityCalculatorService.calculateCurrentRatio(
            Number(this.lastAnnualBalanceSheet.totalCurrentAssets),
            Number(this.lastAnnualBalanceSheet.totalCurrentLiabilities)
        );

        this.stockProfile.liquidity.quickRatio = LiquidityCalculatorService.calculateQuickRatio(
            Number(this.lastAnnualBalanceSheet.cash),
            Number(this.lastAnnualBalanceSheet.cashAndEquivalents),
            Number(this.lastAnnualBalanceSheet.shortTermInvestments),
            Number(this.lastAnnualBalanceSheet.netReceivables),
            Number(this.lastAnnualBalanceSheet.totalCurrentLiabilities)
        );

        /*
        Calculate Debt based on last annual balance sheet and income statement
        */
        this.stockProfile.debt.debtToEquity = DebtCalculatorService.calculateDebtToEquity(
            Number(this.lastAnnualBalanceSheet.totalLiab),
            Number(this.lastAnnualBalanceSheet.totalStockholderEquity)
        );

        this.stockProfile.debt.interestCoverage = DebtCalculatorService.calculateInterestCoverage(
            Number(this.lastAnnualIncomeStatement.ebit),
            Number(this.lastAnnualIncomeStatement.interestExpense)
        );

        /*
        Calculate Efficiency on last annual income statement and balance sheet
        */
        this.stockProfile.efficiency.assetTurnover = EfficiencyCalculatorService.calculateAssetTurnover(
            Number(this.lastAnnualIncomeStatement.totalRevenue),
            Number(this.lastAnnualBalanceSheet.totalAssets)
        );

        this.stockProfile.efficiency.inventoryTurnover = EfficiencyCalculatorService.calculateInventoryTurnover(
            Number(this.lastAnnualIncomeStatement.costOfRevenue),
            Number(this.lastAnnualBalanceSheet.inventory)
        );

        /* **** */

        this.stockProfile.dividends.dividendYield = this.fundamentals.Highlights.DividendYield;

        this.stockProfile.dividends.dividendPayout = this.fundamentals.SplitsDividends.PayoutRatio;
    }

    public parseOutStockProfile(): IStockProfile {

        this.initializeSectionsToFill();

        this.constructInputsForCalculators();

        this.consumeOrCalculateRatios();

        return this.stockProfile;
    }
}
