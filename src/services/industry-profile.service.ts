/*
Iteration 1:

Accepts a ticker that serves as an input for sculpting the profile for given industry

Fetches financial data on the ticker (fundamentals)

Makes use of Parser Service to match API response with our own schema

Creates and saves industry profile

Saves the ticker data for potential further usage
*/

import fetch from 'node-fetch';

import { ServiceResponse } from '../dtos/serviceResponse';

export class IndustryProfileService {

    ticker: string;

    apiUrl: string;

    rawTickerData: { [key: string]: unknown };

    constructor(ticker: string) {

        this.ticker = ticker;

        this.apiUrl = process.env.FINANCIAL_DATA_API_URL || '';
    }

    private async requestFinancialData(): Promise<void> {

        const result = await fetch(`${this.apiUrl}/${this.ticker}.US?api_token=demo`);

        const data = await result.json();

        console.log(data);

        this.rawTickerData = data;
    }

    public async createIndustryProfileFromTicker(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {
            await this.requestFinancialData();

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
