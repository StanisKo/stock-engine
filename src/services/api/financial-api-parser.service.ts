/*
Iteration 1

A helper service that:

Accepts raw ticker data

Extracts fields necessary for industry profile

Makes use of calculator service to calculate missing ratios

Returns values back to the caller in the shape of interface that adheres to Industry Profile schema
*/

import { IIndustryProfile } from '../../interfaces/industry-profile.interface';
import { ITickerFinancialData, ITickerFundamentals, ITickerPrice } from '../../interfaces/ticker.interface';

import { CAGRCalculatorService } from '../calculators/cagr-calculator.service';
import { StandardDeviationCalculatorService } from '../calculators/standard-deviation-calculator.service';
import { SharpeRatioCalculatorService } from '../calculators/sharpe-ratio-calculator.service';
import { AlphaCalculatorService } from '../calculators/alpha-calculator.service';

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
    }

    private calculateAndFillMissingMeasurements(): void {

        const tickerTTMPrices = TimeSeriesHelperService.sliceDataSetIntoTTM(this.prices);

        const [tickerStartingPrice, tickerEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            tickerTTMPrices
        );

        /*
        Calculate CAGR over ticker TTM prices
        */
        const tickerCagr = CAGRCalculatorService.calculateCAGR(tickerEndingPrice, tickerStartingPrice);

        this.extractedTickerData.cagr = tickerCagr;

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

        const alpha = AlphaCalculatorService.calculateAlpha(
            tickerRateOfReturn,
            benchmarkRateOfReturn,
            this.treasuryBondYield,
            this.extractedTickerData.risk.beta
        );

        this.extractedTickerData.risk.alpha = alpha;
    }

    public parseTickerData(): void {

        console.log('Started parsing the data');

        this.initializeSectionsToFill();

        /*
        Extract available fields
        */
        this.extractedTickerData.industry = this.fundamentals.General.Industry;

        this.extractedTickerData.marketCap = this.fundamentals.Highlights.MarketCapitalization;

        this.extractedTickerData.risk.beta = this.fundamentals.Technicals.Beta;

        /*
        Calculate and fill missing fields
        */
        this.calculateAndFillMissingMeasurements();

        console.log(this.extractedTickerData);
    }
}
