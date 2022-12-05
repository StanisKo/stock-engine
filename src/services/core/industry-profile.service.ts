/*
Iteration 1:

Accepts a ticker that serves as an input for sculpting the profile for given industry

Fetches financial data on the ticker (fundamentals, prices)

Makes use of Parser Service to match API response with our own schema

Creates and saves industry profile

Saves the ticker data for potential further usage
*/

import { ServiceResponse } from '../../dtos/serviceResponse';

import { FinancialApiConnectorService } from '../api/financial-api-connector.service';

import { FinancialApiParserService } from '../api/financial-api-parser.service';


export class IndustryProfileService {

    financialApiConnectorService: FinancialApiConnectorService;

    financialApiParserService: FinancialApiParserService;

    constructor(ticker: string) {

        this.financialApiConnectorService = new FinancialApiConnectorService(ticker);
    }

    public async createIndustryProfileFromTicker(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {
            const tickerFinancialData = await this.financialApiConnectorService.requestFinancicalTickerData();

            this.financialApiParserService = new FinancialApiParserService(tickerFinancialData);

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
