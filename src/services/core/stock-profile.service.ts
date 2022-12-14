/*
Iteration 1:

Accepts a ticker that serves as an input for sculpting the profile for given industry

Fetches financial data on the ticker (fundamentals, prices, benchmark prices, risk free rate)

Makes use of Parser Service to match API response with our own schema

Creates and saves industry profile

Saves the ticker data for potential further usage
*/

import { ServiceResponse } from '../../dtos/serviceResponse';

import { ApiConnectorService } from './api-connector.service';

import { DataParserService } from './data-parser.service';

export class StockProfileService {

    apiConnectorService: ApiConnectorService;

    dataParserService: DataParserService;

    constructor(ticker: string) {

        this.apiConnectorService = new ApiConnectorService(ticker);
    }

    public async createStockProfile(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {
            const tickerFinancialData = await this.apiConnectorService.requestFinancicalTickerData();

            this.dataParserService = new DataParserService(tickerFinancialData);

            this.dataParserService.parseTickerData();

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
