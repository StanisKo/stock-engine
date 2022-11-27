/*
Iteration 1:

Accepts a ticker that serves as an input for sculpting the profile for given industry

Fetches financial data on the ticker (fundamentals, prices)

Makes use of Parser Service to match API response with our own schema

Creates and saves industry profile

Saves the ticker data for potential further usage
*/

import { ServiceResponse } from '../dtos/serviceResponse';

import { FinancialApiConnector } from './financial-api-connector';

import { FinancialApiParser } from './financial-api-parser';


export class IndustryProfileMaker {

    financialApiConnector: FinancialApiConnector;

    financialApiParser: FinancialApiParser;

    constructor(ticker: string) {

        this.financialApiConnector = new FinancialApiConnector(ticker);
    }

    public async createIndustryProfileFromTicker(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {
            const tickerFinancialData = await this.financialApiConnector.requestFinancicalTickerData();

            this.financialApiParser = new FinancialApiParser(tickerFinancialData);

            this.financialApiParser.parseTickerData();

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
