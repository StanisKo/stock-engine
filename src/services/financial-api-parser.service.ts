/*
Iteration 1

A helper service that:

Accepts raw ticker data

Extracts fields necessary for industry profile

Returns them back to the caller in the shape of interface that adheres to Industry Profile schema
*/

import { IIndustryProfile } from '../interfaces/industry-profile.interface';

import { ITickerData } from '../interfaces/ticker-data.interface';

export class FinancialApiParserService {

    static extractedTickerData: IIndustryProfile;

    static rawTickerData: ITickerData;

    constructor(rawTickerData: ITickerData) {

        FinancialApiParserService.extractedTickerData = {} as IIndustryProfile;

        FinancialApiParserService.rawTickerData = rawTickerData;
    }

    public parseTickerData(): void {

        const { extractedTickerData, rawTickerData } = FinancialApiParserService;

        extractedTickerData.industry = rawTickerData.General.Industry;
    }
}
