/*
Iteration 1

A helper service that:

Accepts raw ticker data

Extracts fields necessary for industry profile

Returns them back to the caller in the shape of interface that adheres to Industry Profile schema
*/

import { IIndustryProfile } from '../interfaces/industry-profile.interface';

import { ITickerFundamentals } from '../interfaces/ticker-fundamentals.interface';

export class FinancialApiParserService {

    static extractedTickerData: IIndustryProfile;

    static rawTickerData: ITickerFundamentals;

    constructor(rawTickerData: ITickerFundamentals) {

        FinancialApiParserService.extractedTickerData = {} as IIndustryProfile;

        FinancialApiParserService.rawTickerData = rawTickerData;
    }

    public parseTickerData(): void {

        const { extractedTickerData, rawTickerData } = FinancialApiParserService;

        extractedTickerData.industry = rawTickerData.General.Industry;

        extractedTickerData.marketCap = rawTickerData.Highlights.MarketCapitalization;

        console.log(JSON.stringify(rawTickerData, null, 8));
    }
}
