/*
Iteration 1:

Accepts a ticker that serves as an input for sculpting the profile for given industry

Fetches financial data on the ticker (fundamentals, prices)

Makes use of Parser Service to match API response with our own schema

Creates and saves industry profile

Saves the ticker data for potential further usage
*/

import { ITickerFinancialData } from '../interfaces/ticker.interface';

import { ServiceResponse } from '../dtos/serviceResponse';

import { FinancialApiService } from './financial-api.service';

import { FinancialApiParserService } from './financial-api-parser.service';


export class IndustryProfileService {

    financialApiService: FinancialApiService;

    financialApiParserService: FinancialApiParserService;

    constructor(ticker: string) {

        this.financialApiService = new FinancialApiService(ticker);
    }

    private async requestFinancialData(): Promise<ITickerFinancialData> {

        const financialData = await this.financialApiService.requestFinancicalTickerData();

        return financialData;
    }

    public async createIndustryProfileFromTicker(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {
            const tickerData = await this.requestFinancialData();

            this.financialApiParserService = new FinancialApiParserService(tickerData);

            this.financialApiParserService.parseTickerData();

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
