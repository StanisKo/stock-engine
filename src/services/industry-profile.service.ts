/*
Iteration 1:

Accepts a ticker that serves as an input for sculpting the profile for given industry

Fetches financial data on the ticker (fundamentals)

Makes use of Parser Service to match API response with our own schema

Creates and saves industry profile

Saves the ticker data for potential further usage
*/

import fetch from 'node-fetch';

import { ITickerData } from '../interfaces/ticker-data.interface';

import { ServiceResponse } from '../dtos/serviceResponse';

import { FinancialApiParserService } from './financial-api-parser.service';

export class IndustryProfileService {

    ticker: string;

    apiUrl: string;

    financialApiParserService = FinancialApiParserService;

    constructor(ticker: string) {

        this.ticker = ticker;

        this.apiUrl = process.env.FINANCIAL_DATA_API_URL || '';
    }

    private async requestFinancialData(): Promise<ITickerData> {

        const result = await fetch(`${this.apiUrl}/${this.ticker}.US?api_token=demo`);

        const data = await result.json() as ITickerData;

        return data;
    }

    public async createIndustryProfileFromTicker(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {
            const tickerData = await this.requestFinancialData();

            this.financialApiParserService = new FinancialApiParserService(tickerData);

            response.success = true;
        }
        catch (error) {
            console.log(error);

            response.success = false;

            response.message = 'Failed to create industry profile from provided ticker';
        }

        return response;
    }
}
