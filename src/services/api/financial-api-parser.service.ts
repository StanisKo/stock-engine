/*
Iteration 1

A helper service that:

Accepts raw ticker data

Extracts fields necessary for industry profile

Makes use of calculator service to calculate missing ratios

Returns values back to the caller in the shape of interface that adheres to Industry Profile schema
*/

import { IIndustryProfile } from '../../interfaces/industry-profile.interface';
import { ITickerFinancialData, ITickerPrice } from '../../interfaces/ticker.interface';

import { CAGRCalculatorService } from '../calculators/cagr-calculator.service';
import { StandardDeviationCalculatorService } from '../calculators/standard-deviation-calculator.service';
import { SharpeRatioCalculatorService } from '../calculators/sharpe-ratio-calculator.service';

import { TimeSeriesHelperService } from '../helpers/time-series-helper.service';
import { CalculatorHelperService } from '../helpers/calculator-helper.service';

export class FinancialApiParserService {

    extractedTickerData: IIndustryProfile;

    rawTickerData: ITickerFinancialData;

    standardDeviationCalculatorService: StandardDeviationCalculatorService;

    constructor(rawTickerData: ITickerFinancialData) {

        this.extractedTickerData = {} as IIndustryProfile;

        this.rawTickerData = rawTickerData;
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

    private calculateAndFillMissingMeasurements(prices: ITickerPrice[], benchmarkTTMPrices: ITickerPrice[]): void {

        /*
        Calculate CAGR over ticker TTM prices
        */
        const tickerTTMPrices = TimeSeriesHelperService.sliceDataSetIntoTTM(prices);

        const [tickerStartingPrice, tickerEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            tickerTTMPrices
        );

        const cagr = CAGRCalculatorService.calculateCAGR(tickerEndingPrice, tickerStartingPrice);

        this.extractedTickerData.cagr = cagr;

        /*
        Calculate standard deviation over entire dataset of ticker prices (since IPO date)
        */

        const standardDeviation = StandardDeviationCalculatorService.calculateStandardDeviation(prices);

        this.extractedTickerData.risk.standardDeviation =
            StandardDeviationCalculatorService.calculateStandardDeviation(prices);

        /*
        Calculate sharpe ratio over ticker TTM prices and benchmark prices (that are TTM by default)
        */
        const [benchmarkStartingPrice, benchmarkEndingPrice] = TimeSeriesHelperService.getStartingAndEndingPrice(
            benchmarkTTMPrices
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

        const { fundamentals, prices, benchmarkPrices } = this.rawTickerData;

        this.initializeSectionsToFill();

        /*
        Extract available fields
        */
        this.extractedTickerData.industry = fundamentals.General.Industry;

        this.extractedTickerData.marketCap = fundamentals.Highlights.MarketCapitalization;

        /*
        Calculate and fill missing fields
        */
        this.calculateAndFillMissingMeasurements(prices, benchmarkPrices);

        console.log(this.extractedTickerData);
    }
}
