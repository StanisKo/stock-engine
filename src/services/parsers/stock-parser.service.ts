import { IStockProfile } from '../../interfaces/stock-profile.interface';
import { ITickerFundamentals, ITickerPrice, IBenchmarkPrice, IGenericPrice } from '../../interfaces/ticker.interface';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';
import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class StockParserService {

    fundamentals: ITickerFundamentals;

    stockProfile: IStockProfile;


    tickerSinceIPOPrices: ITickerPrice[];

    benchmarkTTMPrices: IBenchmarkPrice[];

    treasuryBondYield: number;


    lastAnnualBalanceSheet: ITickerFundamentals;

    lastAnnualIncomeStatement: ITickerFundamentals;

    lastAnnualCashFlowStatement: ITickerFundamentals;


    tickerTTMPrices: ITickerPrice[];

    tickerTTMStartingPrice: number;

    tickerTTMEndingPrice: number;

    tickerTTMRateOfReturn: number;


    benchmarkTTMRateOfReturn: number;


    tickerAveragePriceOverLastSixtyTradingDays: number;

    constructor(
        fundamentals: ITickerFundamentals,
        prices: ITickerPrice[], benchmarkPrices: IBenchmarkPrice[], treasuryBondYield: number) {

        this.fundamentals = fundamentals;

        this.tickerSinceIPOPrices = prices;

        this.benchmarkTTMPrices = benchmarkPrices;

        this.treasuryBondYield = treasuryBondYield;

        this.stockProfile = {} as IStockProfile;
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
        this.tickerTTMPrices = TimeSeriesHelperService.sliceDatasetIntoTTM(this.tickerSinceIPOPrices);

        const [tickerStartingPrice, tickerEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            this.tickerTTMPrices as unknown as IGenericPrice[]
        );

        /*
        Determine ticker's starting and ending price
        */
        this.tickerTTMStartingPrice = tickerStartingPrice;

        this.tickerTTMEndingPrice = tickerEndingPrice;

        /*
        Calculate ticker's rate of return
        */
        this.tickerTTMRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            this.tickerTTMStartingPrice,
            this.tickerTTMEndingPrice
        );

        /*
        Determine benchmark's starting and ending price
        */
        const [benchmarkStartingPrice, benchmarkEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            this.benchmarkTTMPrices as unknown as IGenericPrice[]
        );

        this.benchmarkTTMRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            benchmarkStartingPrice,
            benchmarkEndingPrice
        );

        /*
        Calculate average price over N (60 in our case) trading days
        */
        const pricesOverLastSixtyTradingDays = TimeSeriesHelperService.sliceDatasetIntoLastNTradingDays(
            this.tickerSinceIPOPrices,
            60
        );

        this.tickerAveragePriceOverLastSixtyTradingDays = CalculatorHelperService.calculateAveragePrice(
            pricesOverLastSixtyTradingDays
        );
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
}
