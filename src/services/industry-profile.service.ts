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

    constructor(tickers: string) {

        this.ticker = tickers;

        this.apiUrl = process.env.FINANCIAL_DATA_API_URL || '';
    }

    public async requestFinancialData(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {
            const result = await fetch(`${this.apiUrl}/${this.ticker}.US?api_token=demo`);

            const data = await result.json();

            console.log(JSON.stringify(data, null, 4));

            response.success = true;
        }
        catch (error) {
            console.log(error);

            response.success = false;

            response.message = 'Failed to fetch financial data on provided ticker';
        }

        return response;
    }
}
