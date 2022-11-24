/*
Iteration 1

A helper service that:

Accepts raw ticker data

Extracts fields necessary for industry profile

Returns them back to the caller in the shape of interface that adheres to Industry Profile schema
*/

import { IIndustryProfile } from '../interfaces/industry-profile.interface';

import { ITickerFinancialData } from '../interfaces/ticker.interface';

import { RatiosCalculatorService } from './ratios-calculator.service';

export class FinancialApiParserService {

    extractedTickerData: IIndustryProfile;

    rawTickerData: ITickerFinancialData;

    ratiosCalculatorService: RatiosCalculatorService;

    constructor(rawTickerData: ITickerFinancialData) {

        this.extractedTickerData = {} as IIndustryProfile;

        this.rawTickerData = rawTickerData;
    }

    public parseTickerData(): void {

        const { fundamentals, prices } = this.rawTickerData;

        this.extractedTickerData.industry = fundamentals.General.Industry;

        this.extractedTickerData.marketCap = fundamentals.Highlights.MarketCapitalization;

        /*
        Calculate things that are missing from APIs manually
        */
        this.ratiosCalculatorService = new RatiosCalculatorService(prices);

        const standardDeviation = this.ratiosCalculatorService.calculateStandardDeviation();
    }
}
