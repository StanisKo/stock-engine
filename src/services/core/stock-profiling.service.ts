import { ServiceResponse } from '../../dtos/serviceResponse';

import { ApiConnectorService } from './api-connector.service';

import { DataParserService } from './data-parser.service';

export class StockProfilingService {

    apiConnectorService: ApiConnectorService;

    dataParserService: DataParserService;

    constructor() {

        this.apiConnectorService = new ApiConnectorService();
    }

    public async profileStocks(): Promise<ServiceResponse> {

        const response = new ServiceResponse();

        try {

            await this.apiConnectorService.requestBulkFundamentalsData();

            response.success = true;
        }
        catch (error) {
            console.log(error);

            response.success = false;

            response.message = 'Failed to create stock profile from provided ticker';
        }

        return response;
    }
}
