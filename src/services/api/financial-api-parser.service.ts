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

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';
import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class FinancialApiParserService {

    extractedTickerData: IIndustryProfile;

    rawTickerData: ITickerFinancialData;

    fundamentals: ITickerFundamentals;

    prices: ITickerPrice[];

    benchmarkPrices: ITickerPrice[];

    constructor(rawTickerData: ITickerFinancialData) {

        this.extractedTickerData = {} as IIndustryProfile;

        this.fundamentals = rawTickerData.fundamentals;

        this.prices = rawTickerData.prices;

        this.benchmarkPrices = rawTickerData.benchmarkPrices;
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
        const cagr = CAGRCalculatorService.calculateCAGR(tickerEndingPrice, tickerStartingPrice);

        this.extractedTickerData.cagr = cagr;

        /*
        Calculate standard deviation over entire dataset of ticker prices (since IPO date)
        */

        const standardDeviation = StandardDeviationCalculatorService.calculateStandardDeviation(this.prices);

        this.extractedTickerData.risk.standardDeviation = standardDeviation;

        /*
        Calculate sharpe ratio over ticker TTM prices and benchmark prices (that are TTM by default)
        */
        const [benchmarkStartingPrice, benchmarkEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            this.benchmarkPrices
        );

        const tickerRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            tickerEndingPrice,
            tickerStartingPrice
        );

        const benchmarkRateOfReturn = CalculatorHelperService.calculateRateOfReturn(
            benchmarkEndingPrice,
            benchmarkStartingPrice
        );

        this.extractedTickerData.risk.sharpeRatio = SharpeRatioCalculatorService.calculateSharpeRatio(
            tickerRateOfReturn,
            benchmarkRateOfReturn,
            standardDeviation
        );
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
