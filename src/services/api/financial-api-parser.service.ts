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

export class FinancialApiParserService {

    extractedTickerData: IIndustryProfile;

    rawTickerData: ITickerFinancialData;

    standardDeviationCalculatorService: StandardDeviationCalculatorService;

    sharpeRatioCalculatorService: SharpeRatioCalculatorService;

    constructor(rawTickerData: ITickerFinancialData) {

        this.extractedTickerData = {} as IIndustryProfile;

        this.rawTickerData = rawTickerData;
    }

    private calculateAndExtractMissingMeasurements(prices: ITickerPrice[], benchmarkTTMPrices: ITickerPrice[]): void {

        /*
        Calculate CAGR over ticker TTM prices
        */
        const tickerTTMPrices = TimeSeriesHelperService.sliceDataSetIntoTTM(prices);

        const [tickerEndingPrice, tickerStartingPrice] = TimeSeriesHelperService.getEndingAndStartingPrice(
            tickerTTMPrices
        );

        const cagr = CAGRCalculatorService.calculateCAGR(tickerEndingPrice, tickerStartingPrice);

        this.extractedTickerData.cagr = cagr;

        /*
        Initialize risk map to extract into
        */
        this.extractedTickerData.risk = {
            standardDeviation: 0,
            sharpeRatio: 0,
            beta: 0,
            alpha: 0,
            rSquared: 0
        };

        /*
        Calculate standard deviation over entire dataset of ticker prices (since IPO date)
        */
        this.standardDeviationCalculatorService = new StandardDeviationCalculatorService(prices);

        const standardDeviation = this.standardDeviationCalculatorService.calculateStandardDeviation();

        this.extractedTickerData.risk.standardDeviation =
            this.standardDeviationCalculatorService.calculateStandardDeviation();

        /*
        Calculate sharpe ratio over ticker TTM prices and benchmark prices (that are TTM by default)
        */
        this.sharpeRatioCalculatorService = new SharpeRatioCalculatorService(
            tickerTTMPrices,
            benchmarkTTMPrices,
            standardDeviation
        );

        this.extractedTickerData.risk.sharpeRatio = this.sharpeRatioCalculatorService.calculateSharpeRatio();
    }

    public parseTickerData(): void {

        console.log('Started parsing the data');

        const { fundamentals, prices, benchmarkPrices } = this.rawTickerData;

        /*
        Extract available fields
        */
        this.extractedTickerData.industry = fundamentals.General.Industry;

        this.extractedTickerData.marketCap = fundamentals.Highlights.MarketCapitalization;

        /*
        Calculate and extract missing fields
        */
        this.calculateAndExtractMissingMeasurements(prices, benchmarkPrices);

        console.log(this.extractedTickerData);
    }
}
