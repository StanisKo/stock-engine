/*
Iteration 1

A helper service that:

Accepts raw ticker data

Extracts fields necessary for industry profile

Makes use of calculator service to calculate missing ratios

Returns values back to the caller in the shape of interface that adheres to Industry Profile schema
*/

import { IIndustryProfile } from '../interfaces/industry-profile.interface';

import { ITickerFinancialData } from '../interfaces/ticker.interface';

import { CAGRCalculatorService } from './calculators/cagr-calculator.service';

import { StandardDeviationCalculatorService } from './calculators/standard-deviation-calculator.service';

import { SharpeRatioCalculatorService } from './calculators/sharpe-ratio-calculator.service';
import { TimeSeriesHelperService } from './calculators/time-series-helper.service';

export class FinancialApiParserService {

    extractedTickerData: IIndustryProfile;

    rawTickerData: ITickerFinancialData;

    cagrCalculatorService: CAGRCalculatorService;

    standardDeviationCalculatorService: StandardDeviationCalculatorService;

    sharpeRatioCalculatorService: SharpeRatioCalculatorService;

    constructor(rawTickerData: ITickerFinancialData) {

        this.extractedTickerData = {} as IIndustryProfile;

        this.rawTickerData = rawTickerData;
    }

    public parseTickerData(): void {

        console.log('Started parsing the data');

        const { fundamentals, prices, benchmarkPrices } = this.rawTickerData;

        this.extractedTickerData.industry = fundamentals.General.Industry;

        this.extractedTickerData.marketCap = fundamentals.Highlights.MarketCapitalization;

        this.cagrCalculatorService = new CAGRCalculatorService(prices);

        const cagr = this.cagrCalculatorService.calculateCAGR();

        this.extractedTickerData.cagr = cagr;

        this.standardDeviationCalculatorService = new StandardDeviationCalculatorService(prices);

        const standardDeviation = this.standardDeviationCalculatorService.calculateStandardDeviation();

        this.extractedTickerData.risk = {
            standardDeviation: 0,
            sharpeRatio: 0,
            beta: 0,
            alpha: 0,
            rSquared: 0
        };

        this.extractedTickerData.risk.standardDeviation = standardDeviation;

        const tickerPricesTTM = TimeSeriesHelperService.sliceDataSetIntoTTM(prices);

        /*
        Our benchmark prices are already TTM
        */
        this.sharpeRatioCalculatorService = new SharpeRatioCalculatorService(
            tickerPricesTTM,
            benchmarkPrices,
            standardDeviation
        );

        this.extractedTickerData.risk.sharpeRatio = this.sharpeRatioCalculatorService.calculateSharpeRatio();

        console.log(this.extractedTickerData);
    }
}
