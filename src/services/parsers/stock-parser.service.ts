import { IStockProfile } from '../../interfaces/stock-profile.interface';
import { ITickerFundamentals, ITickerPrice, IBenchmarkPrice, IGenericPrice } from '../../interfaces/ticker.interface';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';
import { CalculatorHelperService } from '../helpers/calculator-helper.service';

import { parseGeneral } from './general-parser.service';
import { parseRisk } from './risk-parser.service';
import { parseValuation } from './valuation-parser.service';
import { parseProfitability } from './profitability-parser.service';
import { parseLiquidity } from './liquidity-parser.service';
import { parseDebt } from './debt-parser.service';
import { parseEfficiency } from './efficiency-parser.service';
import { parseDividends } from './dividends-parser.service';

/*
Serves a purpose of shared storage of data used in sub-parsers and calculators

Hosts profile to return to the caller
*/

export class StockParserService {

    fundamentals: ITickerFundamentals;

    stockProfile: IStockProfile;


    tickerPricesSinceIPO: ITickerPrice[];

    tickerTTMPrices: ITickerPrice[];

    tickerTTMRateOfReturn: number;

    tickerTTMAverageRateOfReturn: number;

    tickerTTMReturns: number[];

    tickerAveragePriceOverLastSixtyTradingDays: number;

    tickerMostRecentPrice: number;


    benchmarkTTMPrices: IBenchmarkPrice[];

    benchmarkTTMRateOfReturn: number;

    benchmarkTTMAverageRateOfReturn: number;

    benchmarkTTMReturns: number[];


    treasuryBondYield: number;


    lastAnnualBalanceSheet: ITickerFundamentals;

    lastAnnualIncomeStatement: ITickerFundamentals;

    lastAnnualCashFlowStatement: ITickerFundamentals;


    exchangeRate?: number;

    constructor(
        fundamentals: ITickerFundamentals,
        prices: ITickerPrice[], benchmarkPrices: IBenchmarkPrice[], treasuryBondYield: number, exchangeRate?: number) {

        this.stockProfile = {} as IStockProfile;

        this.fundamentals = fundamentals;


        this.tickerPricesSinceIPO = prices;

        this.benchmarkTTMPrices = benchmarkPrices;


        this.treasuryBondYield = treasuryBondYield;

        this.exchangeRate = exchangeRate;


        this.constructInputsForCalculators();

        this.initializeCategoriesToFill();
    }

    private constructInputsForCalculators(): void {

        /*
        Get the last annual balance sheet, income statement and cash flow statement
        necessary for liquidity, valuation, debt, and efficiency calculations

        TODO: should we work with annual or quarterly data?

        Probably both
        */
        this.lastAnnualBalanceSheet = this.fundamentals.Financials.Balance_Sheet.yearly_last_0;

        this.lastAnnualIncomeStatement = this.fundamentals.Financials.Income_Statement.yearly_last_0;

        this.lastAnnualCashFlowStatement = this.fundamentals.Financials.Cash_Flow.yearly_last_0;

        /* **** */

        /*
        Get ticker TTM prices
        */
        this.tickerTTMPrices = TimeSeriesHelperService.sliceDatasetIntoTTM(this.tickerPricesSinceIPO);

        /*
        Get ticker starting and ending TTM prices
        */
        const [tickerStartingPrice, tickerEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            this.tickerTTMPrices as unknown as IGenericPrice[]
        );

        /*
        Calculate ticker rate of return over starting and ending prices
        */
        this.tickerTTMRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            tickerStartingPrice,
            tickerEndingPrice
        );

        /*
        Calculate ticker returns and average rate of return TTM
        */
        const [tickerReturns, tickerTTMAverageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            this.tickerTTMPrices as unknown as IGenericPrice[]
        );

        this.tickerTTMReturns = tickerReturns;

        this.tickerTTMAverageRateOfReturn = tickerTTMAverageRateOfReturn;

        /*
        Calculate ticker average price over N (60 in our case) trading days
        */
        const pricesOverLastSixtyTradingDays = TimeSeriesHelperService.sliceDatasetIntoLastNTradingDays(
            this.tickerPricesSinceIPO,
            60
        );

        this.tickerAveragePriceOverLastSixtyTradingDays = CalculatorHelperService.calculateAveragePrice(
            pricesOverLastSixtyTradingDays
        );

        /*
        NOTE: we're using close here, not the adjusted close, since we want raw market output
        */
        this.tickerMostRecentPrice = this.tickerPricesSinceIPO[this.tickerPricesSinceIPO.length - 1].close;

        /* **** */

        /*
        Get benchmark starting and ending TTM prices
        */
        const [benchmarkStartingPrice, benchmarkEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            this.benchmarkTTMPrices as unknown as IGenericPrice[]
        );

        /*
        Calculate benchmark rate of return over starting and ending prices
        */
        this.benchmarkTTMRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            benchmarkStartingPrice,
            benchmarkEndingPrice
        );

        /*
        Calculate benchamrk returns and average rate of return TTM
        */
        const [benchmarkReturns, benchmarkAverageRateOfReturn] = CalculatorHelperService.calculateAverageRateOfReturn(
            this.benchmarkTTMPrices as unknown as IGenericPrice[]
        );

        this.benchmarkTTMReturns = benchmarkReturns;

        this.benchmarkTTMAverageRateOfReturn = benchmarkAverageRateOfReturn;
    }

    private initializeCategoriesToFill(): void {

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

    public parseStockProfile(): IStockProfile {

        parseGeneral(this);

        parseRisk(this);

        parseValuation(this);

        parseProfitability(this);

        parseLiquidity(this);

        parseDebt(this);

        parseEfficiency(this);

        parseDividends(this);

        return this.stockProfile;
    }
}
